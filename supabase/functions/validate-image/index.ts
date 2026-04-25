// AutoWurx image validation + ingestion
// Accepts a multipart upload, validates type/size/dimensions, hashes the
// content, dedupes against existing images, scores quality, uploads to
// the listing-images bucket, and inserts a row into listing_images.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const MIN_W = 400;
const MIN_H = 300;

async function md5(bytes: Uint8Array): Promise<string> {
  // Deno's crypto subtle doesn't support MD5; use a tiny pure-JS implementation
  // but for our purposes a SHA-1 hex is sufficient as a content fingerprint.
  // The DB column is named `hash` and is just text.
  const hashBuffer = await crypto.subtle.digest("SHA-1", bytes);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Read PNG/JPEG/WEBP intrinsic dimensions from raw bytes. */
function readDimensions(
  bytes: Uint8Array,
  mime: string,
): { width: number; height: number } | null {
  try {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (mime === "image/png") {
      // PNG: width @ offset 16, height @ offset 20 (big-endian)
      return { width: dv.getUint32(16), height: dv.getUint32(20) };
    }
    if (mime === "image/jpeg") {
      // Walk JPEG markers
      let offset = 2;
      while (offset < bytes.length) {
        if (bytes[offset] !== 0xff) return null;
        const marker = bytes[offset + 1];
        const size = dv.getUint16(offset + 2);
        // SOF0..SOF15 except DHT(0xC4), DAC(0xCC), DNL(0xDC)
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          const height = dv.getUint16(offset + 5);
          const width = dv.getUint16(offset + 7);
          return { width, height };
        }
        offset += 2 + size;
      }
      return null;
    }
    if (mime === "image/webp") {
      // RIFF....WEBPVP8 / VP8L / VP8X
      const fourcc = new TextDecoder().decode(bytes.subarray(12, 16));
      if (fourcc === "VP8 ") {
        const w = dv.getUint16(26, true) & 0x3fff;
        const h = dv.getUint16(28, true) & 0x3fff;
        return { width: w, height: h };
      }
      if (fourcc === "VP8L") {
        const b0 = bytes[21], b1 = bytes[22], b2 = bytes[23], b3 = bytes[24];
        const w = 1 + (((b1 & 0x3f) << 8) | b0);
        const h = 1 + (((b3 & 0xf) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
        return { width: w, height: h };
      }
      if (fourcc === "VP8X") {
        const w = 1 + ((bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) & 0xffffff);
        const h = 1 + ((bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) & 0xffffff);
        return { width: w, height: h };
      }
    }
  } catch (_e) {
    return null;
  }
  return null;
}

function calculateQualityScore(width: number, height: number, size: number): number {
  let score = 50;
  if (width >= 1200) score += 20;
  if (size < 5 * 1024 * 1024) score += 20;
  // Penalize images that barely meet the minimum
  if (width < MIN_W * 1.25 || height < MIN_H * 1.25) score -= 30;
  return Math.max(0, Math.min(100, score));
}

function bad(status: number, message: string, extra: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({ success: false, error: message, ...extra }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabase.auth.getUser(jwt);
    if (!userData?.user) return bad(401, "Unauthorized");
    const uploaderUserId = userData.user.id;

    const form = await req.formData();
    const file = form.get("file");
    const listingId = String(form.get("listing_id") ?? "");
    const isPrimary = String(form.get("is_primary") ?? "false") === "true";

    if (!(file instanceof File)) return bad(400, "Missing file");
    if (!listingId) return bad(400, "Missing listing_id");
    if (!ALLOWED_TYPES.has(file.type)) {
      return bad(400, `Unsupported type: ${file.type}. Allowed: JPG, PNG, WEBP`);
    }
    if (file.size > MAX_SIZE) return bad(400, "File exceeds 15MB limit");

    const bytes = new Uint8Array(await file.arrayBuffer());
    const dims = readDimensions(bytes, file.type);
    if (!dims) return bad(400, "Could not read image dimensions");
    if (dims.width < MIN_W || dims.height < MIN_H) {
      return bad(400, `Image too small. Minimum ${MIN_W}x${MIN_H}.`);
    }

    const hash = await md5(bytes);

    // Duplicate detection
    const { data: dupes } = await supabase
      .from("listing_images")
      .select("id, listing_id")
      .eq("hash", hash);

    let flagged = false;
    let flagReason: string | null = null;
    if (dupes && dupes.length > 0) {
      flagged = true;
      flagReason = dupes.some((d) => d.listing_id === listingId)
        ? "DUPLICATE_IMAGE"
        : "REUSED_IMAGE_FROM_OTHER_LISTING";
    }

    const qualityScore = calculateQualityScore(dims.width, dims.height, file.size);

    // Upload to storage
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${listingId}/${hash}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("listing-images")
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (uploadErr) return bad(500, `Upload failed: ${uploadErr.message}`);

    const { data: pub } = supabase.storage.from("listing-images").getPublicUrl(path);
    const url = pub.publicUrl;

    // Insert row
    const { data: inserted, error: insertErr } = await supabase
      .from("listing_images")
      .insert({
        listing_id: listingId,
        uploaded_by: uploaderUserId,
        file_name: file.name,
        file_size: file.size,
        url,
        hash,
        width: dims.width,
        height: dims.height,
        quality_score: qualityScore,
        is_flagged: flagged,
        flag_reason: flagReason,
        is_primary: isPrimary,
      } as never)
      .select("id")
      .single();
    if (insertErr) return bad(500, `DB insert failed: ${insertErr.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        imageId: (inserted as { id: string }).id,
        url,
        hash,
        width: dims.width,
        height: dims.height,
        qualityScore,
        flagged,
        flagReason,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[validate-image]", err);
    return bad(500, message);
  }
});
