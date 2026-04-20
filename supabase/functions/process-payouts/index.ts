import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PayoutBody {
  /** Optional list of promoter_ids to restrict the batch. Default: all promoters with approved commissions. */
  promoter_ids?: string[];
  /** Default payout method when promoter has no payout_settings row. */
  default_method?: string;
  /** Dry run — compute totals without writing payout_history or marking commissions paid. */
  dry_run?: boolean;
}

interface PayoutResult {
  promoter_id: string;
  amount: number;
  commission_count: number;
  payout_method: string;
  payout_id?: string;
  skipped_reason?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ─── Auth: caller must be admin ─────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claims?.claims?.sub) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const callerId = claims.claims.sub as string;

  // Service-role client for elevated reads/writes
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: isAdmin, error: roleErr } = await admin.rpc("has_role", {
    _user_id: callerId,
    _role: "admin",
  });

  if (roleErr || !isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ─── Parse body ─────────────────────────────────────────────────────────────
  let body: PayoutBody = {};
  try {
    if (req.headers.get("content-length") !== "0") {
      body = (await req.json()) as PayoutBody;
    }
  } catch {
    body = {};
  }

  const defaultMethod = body.default_method ?? "paypal";
  const dryRun = body.dry_run === true;

  // ─── Fetch approved (unpaid) commissions ────────────────────────────────────
  let q = admin
    .from("commissions")
    .select("id, promoter_id, commission_amount")
    .eq("status", "approved")
    .is("paid_at", null);

  if (body.promoter_ids?.length) {
    q = q.in("promoter_id", body.promoter_ids);
  }

  const { data: commissions, error: cErr } = await q;
  if (cErr) {
    console.error("commissions query failed:", cErr);
    return new Response(JSON.stringify({ error: "Query failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!commissions || commissions.length === 0) {
    return new Response(
      JSON.stringify({
        ok: true,
        dry_run: dryRun,
        processed: 0,
        total_amount: 0,
        results: [],
        message: "No approved commissions to pay out.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // ─── Group by promoter ──────────────────────────────────────────────────────
  const byPromoter = new Map<
    string,
    { ids: string[]; amount: number }
  >();
  for (const c of commissions) {
    const entry = byPromoter.get(c.promoter_id) ?? { ids: [], amount: 0 };
    entry.ids.push(c.id);
    entry.amount += Number(c.commission_amount);
    byPromoter.set(c.promoter_id, entry);
  }

  // ─── Load payout settings for all involved promoters ────────────────────────
  const promoterIds = Array.from(byPromoter.keys());
  const { data: settings } = await admin
    .from("payout_settings")
    .select("promoter_id, payout_method, payout_threshold")
    .in("promoter_id", promoterIds);

  const settingsMap = new Map(
    (settings ?? []).map((s) => [s.promoter_id, s]),
  );

  // ─── Process each promoter ──────────────────────────────────────────────────
  const results: PayoutResult[] = [];
  let totalAmount = 0;
  let processedCount = 0;

  for (const [promoter_id, { ids, amount }] of byPromoter) {
    const setting = settingsMap.get(promoter_id);
    const method = setting?.payout_method ?? defaultMethod;
    const threshold = Number(setting?.payout_threshold ?? 0);
    const rounded = Math.round(amount * 100) / 100;

    if (rounded < threshold) {
      results.push({
        promoter_id,
        amount: rounded,
        commission_count: ids.length,
        payout_method: method,
        skipped_reason: `Below threshold ($${threshold.toFixed(2)})`,
      });
      continue;
    }

    if (dryRun) {
      results.push({
        promoter_id,
        amount: rounded,
        commission_count: ids.length,
        payout_method: method,
      });
      totalAmount += rounded;
      processedCount += ids.length;
      continue;
    }

    // 1) Insert payout_history row
    const { data: payout, error: payoutErr } = await admin
      .from("payout_history")
      .insert({
        promoter_id,
        amount: rounded,
        payout_method: method,
        status: "pending",
        reference_id: `BATCH-${Date.now()}-${promoter_id.slice(0, 8)}`,
      })
      .select("id")
      .single();

    if (payoutErr || !payout) {
      console.error("payout_history insert failed:", payoutErr);
      results.push({
        promoter_id,
        amount: rounded,
        commission_count: ids.length,
        payout_method: method,
        skipped_reason: "Failed to record payout",
      });
      continue;
    }

    // 2) Mark commissions as paid (trigger updates promoter_profiles totals)
    const { error: updErr } = await admin
      .from("commissions")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .in("id", ids);

    if (updErr) {
      console.error("commissions update failed:", updErr);
      results.push({
        promoter_id,
        amount: rounded,
        commission_count: ids.length,
        payout_method: method,
        payout_id: payout.id,
        skipped_reason: "Payout recorded but commissions update failed",
      });
      continue;
    }

    results.push({
      promoter_id,
      amount: rounded,
      commission_count: ids.length,
      payout_method: method,
      payout_id: payout.id,
    });
    totalAmount += rounded;
    processedCount += ids.length;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      dry_run: dryRun,
      processed: processedCount,
      total_amount: Math.round(totalAmount * 100) / 100,
      promoters_paid: results.filter((r) => !r.skipped_reason).length,
      promoters_skipped: results.filter((r) => r.skipped_reason).length,
      results,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
