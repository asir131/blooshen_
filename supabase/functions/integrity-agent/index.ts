// AutoWurx Integrity Agent
// Validates vehicle listings on status change to 'pending_review' or via manual trigger
// by Master Admin. Runs an 8-step pipeline and updates the listing accordingly.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AGENT_NAME = "AutoWurx Integrity Agent";

const PLACEHOLDER_TERMS = [
  "test", "demo", "sample", "lorem", "ipsum", "placeholder",
  "fake", "example", "n/a", "tbd", "car name", "vehicle",
];

const VIN_TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function validateVIN(vin: string): boolean {
  if (typeof vin !== "string") return false;
  const v = vin.trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return false;
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const ch = v[i];
    const value = /\d/.test(ch) ? Number(ch) : VIN_TRANSLITERATION[ch];
    if (value === undefined) return false;
    sum += value * VIN_WEIGHTS[i];
  }
  const checkDigit = sum % 11;
  const expected = checkDigit === 10 ? "X" : String(checkDigit);
  return v[8] === expected;
}

function detectPlaceholders(text: string | null | undefined, field: string): string[] {
  if (!text || typeof text !== "string") return [];
  const lower = text.toLowerCase();
  const flags: string[] = [];
  for (const term of PLACEHOLDER_TERMS) {
    if (lower.includes(term)) {
      flags.push(`PLACEHOLDER_TEXT_DETECTED:${field}:${term}`);
      break; // one flag per field is enough
    }
  }
  return flags;
}

interface DecodedVin {
  Make?: string;
  Model?: string;
  ErrorCode?: string;
}

async function decodeVinViaNHTSA(vin: string): Promise<{ valid: boolean; data: DecodedVin }> {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(vin)}?format=json`,
    );
    if (!res.ok) return { valid: false, data: {} };
    const json = await res.json();
    const results = (json?.Results ?? []) as Array<{ Variable: string; Value: string | null }>;
    const get = (name: string) => results.find((r) => r.Variable === name)?.Value ?? "";
    const data: DecodedVin = {
      Make: get("Make") || undefined,
      Model: get("Model") || undefined,
      ErrorCode: get("Error Code") || undefined,
    };
    // ErrorCode "0" means VIN decoded cleanly
    const valid = !!data.Make && (data.ErrorCode === "0" || data.ErrorCode === "");
    return { valid, data };
  } catch (err) {
    console.error("[integrity-agent] NHTSA fetch failed", err);
    return { valid: false, data: {} };
  }
}

interface VehicleListing {
  id: string;
  created_by: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  description: string;
  seller_type: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({}));
    const listingId: string | undefined = body.listing_id;
    const triggeredBy: string = body.triggered_by ?? "system";

    if (!listingId) {
      return new Response(
        JSON.stringify({ error: "listing_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Load listing
    const { data: listing, error: listingErr } = await supabase
      .from("vehicle_listings")
      .select("*")
      .eq("id", listingId)
      .maybeSingle();

    if (listingErr || !listing) {
      return new Response(
        JSON.stringify({ error: "Listing not found", details: listingErr?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const l = listing as VehicleListing;
    const flags: string[] = [];
    let fraudScore = 0;

    // ---- Step 1: Field Completeness
    const required: Array<keyof VehicleListing> = [
      "vin", "make", "model", "year", "mileage", "price", "description", "seller_type",
    ];
    for (const f of required) {
      const v = l[f];
      if (v === null || v === undefined || (typeof v === "string" && v.trim() === "")) {
        flags.push(`MISSING_REQUIRED_FIELD:${f}`);
      }
    }

    // ---- Step 2: Placeholder Detection (vin, make, model, description)
    flags.push(...detectPlaceholders(l.vin, "vin"));
    flags.push(...detectPlaceholders(l.make, "make"));
    flags.push(...detectPlaceholders(l.model, "model"));
    flags.push(...detectPlaceholders(l.description, "description"));

    // ---- Step 3: VIN Validation
    let vinValid = false;
    let decodedData: DecodedVin = {};
    if (l.vin) {
      const formatValid = validateVIN(l.vin);
      if (!formatValid) {
        flags.push("INVALID_VIN_FORMAT");
      }

      // Cache lookup
      const { data: cached } = await supabase
        .from("vin_validation_cache")
        .select("*")
        .eq("vin", l.vin.toUpperCase())
        .maybeSingle();

      if (cached) {
        vinValid = cached.is_valid;
        decodedData = (cached.decoded_data ?? {}) as DecodedVin;
      } else if (formatValid) {
        const result = await decodeVinViaNHTSA(l.vin.toUpperCase());
        vinValid = result.valid;
        decodedData = result.data;
        await supabase.from("vin_validation_cache").upsert({
          vin: l.vin.toUpperCase(),
          is_valid: result.valid,
          decoded_data: result.data as never,
          validated_at: new Date().toISOString(),
        });
      }

      // Cross-check make/model with decoded data
      if (vinValid && decodedData.Make && l.make) {
        const a = decodedData.Make.toLowerCase().trim();
        const b = l.make.toLowerCase().trim();
        if (a && b && !a.includes(b) && !b.includes(a)) {
          flags.push("VIN_MISMATCH:make");
        }
      }
      if (vinValid && decodedData.Model && l.model) {
        const a = decodedData.Model.toLowerCase().trim();
        const b = l.model.toLowerCase().trim();
        if (a && b && !a.includes(b) && !b.includes(a)) {
          flags.push("VIN_MISMATCH:model");
        }
      }
    }

    // ---- Step 4: Description Quality
    const descLen = (l.description ?? "").trim().length;
    if (descLen < 100) flags.push("DESCRIPTION_TOO_SHORT");

    // ---- Step 5: Price Anomaly
    const price = Number(l.price ?? 0);
    if (price > 0 && price < 500) flags.push("PRICE_SUSPICIOUSLY_LOW");
    if (price > 500_000) flags.push("PRICE_SUSPICIOUSLY_HIGH");

    // ---- Step 6: Image Validation
    const { data: images } = await supabase
      .from("listing_images")
      .select("id, hash, quality_score, is_flagged")
      .eq("listing_id", listingId);

    const imgs = images ?? [];
    if (imgs.length < 3) flags.push("INSUFFICIENT_IMAGES");
    if (imgs.some((i) => (i.quality_score ?? 0) < 30)) flags.push("LOW_QUALITY_IMAGE");
    if (imgs.some((i) => i.is_flagged)) flags.push("FLAGGED_IMAGE_DETECTED");

    // Duplicate hashes within listing
    const hashes = imgs.map((i) => i.hash).filter((h): h is string => !!h);
    const uniqueHashes = new Set(hashes);
    if (hashes.length !== uniqueHashes.size) flags.push("DUPLICATE_IMAGE");

    // Reused hashes across other listings
    if (hashes.length > 0) {
      const { data: otherImgs } = await supabase
        .from("listing_images")
        .select("listing_id, hash")
        .in("hash", hashes)
        .neq("listing_id", listingId);
      if (otherImgs && otherImgs.length > 0) {
        flags.push("REUSED_IMAGE_FROM_OTHER_LISTING");
      }
    }

    // ---- Step 7: Duplicate VIN
    if (l.vin) {
      const { data: dupVin } = await supabase
        .from("vehicle_listings")
        .select("id")
        .eq("vin", l.vin)
        .neq("id", listingId)
        .limit(1);
      if (dupVin && dupVin.length > 0) flags.push("DUPLICATE_VIN_DETECTED");
    }

    // ---- Step 8: User Verification
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, is_active")
      .eq("id", l.created_by)
      .maybeSingle();
    if (!profile || !profile.is_active) flags.push("UNVERIFIED_USER");

    // ---- Score & Decision
    fraudScore = Math.min(100, flags.length * 20);
    const validationStatus =
      flags.length === 0 ? "passed" : fraudScore >= 60 ? "failed" : "flagged";
    const newStatus =
      validationStatus === "passed"
        ? "approved"
        : validationStatus === "failed"
        ? "rejected"
        : "pending_review";

    const validationScore = Math.max(0, 100 - fraudScore);

    // ---- Update listing
    const { error: updateErr } = await supabase
      .from("vehicle_listings")
      .update({
        validation_status: validationStatus,
        validation_score: validationScore,
        fraud_score: fraudScore,
        flag_reasons: flags as never,
        status: newStatus,
        rejection_reason: validationStatus === "failed" ? flags.join("; ") : null,
        is_published: validationStatus === "passed",
        published_at: validationStatus === "passed" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId);

    if (updateErr) {
      console.error("[integrity-agent] update failed", updateErr);
    }

    // ---- System alert for critical issues
    if (fraudScore >= 60) {
      await supabase.from("system_alerts").insert({
        alert_type: "critical",
        title: `${AGENT_NAME}: Listing rejected`,
        message: `Listing ${listingId} failed validation. Flags: ${flags.join(", ")}`,
        listing_id: listingId,
      } as never);
    } else if (flags.length > 0) {
      await supabase.from("system_alerts").insert({
        alert_type: "warning",
        title: `${AGENT_NAME}: Listing flagged`,
        message: `Listing ${listingId} has issues: ${flags.join(", ")}`,
        listing_id: listingId,
      } as never);
    }

    // ---- Audit log
    await supabase.from("audit_logs").insert({
      user_id: null,
      action: "integrity_agent_run",
      entity_type: "vehicle_listing",
      entity_id: listingId,
      metadata: {
        agent: AGENT_NAME,
        triggered_by: triggeredBy,
        flags,
        fraud_score: fraudScore,
        validation_score: validationScore,
        validation_status: validationStatus,
        new_status: newStatus,
      } as never,
    });

    return new Response(
      JSON.stringify({
        success: true,
        agent: AGENT_NAME,
        listing_id: listingId,
        validation_status: validationStatus,
        validation_score: validationScore,
        fraud_score: fraudScore,
        status: newStatus,
        flags,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[integrity-agent] error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
