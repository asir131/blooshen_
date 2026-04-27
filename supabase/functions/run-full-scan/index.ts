// AutoWurx Run Full Scan
// Triggers the integrity-agent on all listings currently in
// pending_review or with validation_status = 'flagged'.
// Master-admin only.

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

    // ---- Auth check
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

    // ---- Role check (master_admin or admin)
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const roles = (roleRows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("master_admin")) {
      return jsonResponse({ success: false, error: "Forbidden" }, 403);
    }

    // ---- Find listings to rescan
    const { data: listings, error: listErr } = await admin
      .from("vehicle_listings")
      .select("id")
      .or("status.eq.pending_review,validation_status.eq.flagged");

    if (listErr) {
      return jsonResponse({ success: false, error: listErr.message }, 500);
    }

    const ids = (listings ?? []).map((l) => l.id);

    // ---- Trigger integrity-agent for each (sequential to avoid hammering NHTSA)
    const results: Array<{ id: string; ok: boolean; error?: string }> = [];
    for (const id of ids) {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/integrity-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ listing_id: id, triggered_by: userId }),
        });
        results.push({ id, ok: res.ok });
        await res.text(); // consume body
      } catch (err) {
        results.push({
          id,
          ok: false,
          error: err instanceof Error ? err.message : "unknown",
        });
      }
    }

    // ---- Audit log
    await admin.from("audit_logs").insert({
      user_id: userId,
      action: "INTEGRITY_AGENT_FULL_SCAN",
      entity_type: "system",
      entity_id: null,
      metadata: {
        scanned_count: ids.length,
        success_count: results.filter((r) => r.ok).length,
        failed_count: results.filter((r) => !r.ok).length,
      } as never,
    });

    return jsonResponse({
      success: true,
      data: {
        scanned: ids.length,
        passed: results.filter((r) => r.ok).length,
        failed: results.filter((r) => !r.ok).length,
        results,
      },
    });
  } catch (err) {
    console.error("[run-full-scan] error", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ success: false, error: message }, 500);
  }
});
