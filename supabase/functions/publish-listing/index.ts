// AutoWurx Publish Listing
// Final gate before a listing goes live. Re-runs the integrity-agent and
// only publishes if the listing comes back clean (validation_status =
// 'passed' AND status = 'approved'). Master-admin only.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // ---- Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub as string;

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: roleRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const roles = (roleRows ?? []).map((r) => r.role);
    if (!roles.includes("master_admin")) {
      return jsonResponse({ success: false, error: "Forbidden — master_admin only" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const listingId = body.listing_id as string | undefined;
    if (!listingId) {
      return jsonResponse({ success: false, error: "listing_id is required" }, 400);
    }

    // ---- Re-run integrity agent
    let agentResult: unknown = null;
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/integrity-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ listing_id: listingId, triggered_by: userId }),
      });
      agentResult = await res.json();
    } catch (err) {
      console.error("[publish-listing] agent call failed", err);
      return jsonResponse(
        { success: false, error: "Integrity agent failed", agentResult: null },
        500,
      );
    }

    // ---- Re-fetch the listing post-scan
    const { data: listing, error: listErr } = await admin
      .from("vehicle_listings")
      .select("id, status, validation_status, validation_score, fraud_score, flag_reasons, vin")
      .eq("id", listingId)
      .maybeSingle();

    if (listErr || !listing) {
      return jsonResponse(
        { success: false, error: "Listing not found", agentResult },
        404,
      );
    }

    // ---- Verify image count >= 3 (defense in depth)
    const { count: imgCount } = await admin
      .from("listing_images")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId);

    const imageCountOk = (imgCount ?? 0) >= 3;
    const cleanScan =
      listing.validation_status === "passed" &&
      listing.status === "approved" &&
      (listing.validation_score ?? 0) >= 70 &&
      (listing.fraud_score ?? 0) < 60;

    if (!cleanScan || !imageCountOk) {
      await admin.from("audit_logs").insert({
        user_id: userId,
        action: "PUBLISH_BLOCKED",
        entity_type: "vehicle_listing",
        entity_id: listingId,
        metadata: {
          reason: !imageCountOk ? "INSUFFICIENT_IMAGES" : "FAILED_INTEGRITY_RECHECK",
          validation_status: listing.validation_status,
          status: listing.status,
          validation_score: listing.validation_score,
          fraud_score: listing.fraud_score,
          image_count: imgCount ?? 0,
        } as never,
      });

      return jsonResponse({
        success: false,
        error: !imageCountOk
          ? "At least 3 images are required to publish"
          : "Listing failed integrity recheck",
        agentResult,
        data: { listing },
      }, 422);
    }

    // ---- Publish
    const { error: updErr } = await admin
      .from("vehicle_listings")
      .update({
        is_published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId);

    if (updErr) {
      return jsonResponse(
        { success: false, error: updErr.message, agentResult },
        500,
      );
    }

    // ---- Audit log
    await admin.from("audit_logs").insert({
      user_id: userId,
      action: "LISTING_PUBLISHED",
      entity_type: "vehicle_listing",
      entity_id: listingId,
      metadata: {
        vin: listing.vin,
        validation_score: listing.validation_score,
        fraud_score: listing.fraud_score,
      } as never,
    });

    return jsonResponse({
      success: true,
      data: { listing_id: listingId, published: true },
      agentResult,
    });
  } catch (err) {
    console.error("[publish-listing] error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ success: false, error: message }, 500);
  }
});
