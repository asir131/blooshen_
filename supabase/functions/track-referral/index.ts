import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const COOKIE_NAME = "autowurx_ref";
const COOKIE_DAYS = 30;

const LISTING_CATEGORIES = [
  "cars_for_sale",
  "parts_accessories",
  "service_providers",
  "rentals",
  "neighborhood_experts",
  "events_meetups",
] as const;

type ListingCategory = (typeof LISTING_CATEGORIES)[number];

interface TrackPayload {
  ref_code: string;
  listing_id?: string;
  listing_category?: ListingCategory;
  referral_url?: string;
}

function buildSetCookie(value: string, days: number): string {
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  // SameSite=None + Secure required so cookie is sent on cross-site fetch from preview/published domain
  return `${COOKIE_NAME}=${encodeURIComponent(
    value,
  )}; Path=/; Expires=${expires}; SameSite=None; Secure; HttpOnly`;
}

function fingerprint(req: Request): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";
  const ua = req.headers.get("user-agent") ?? "unknown";
  // Simple opaque fingerprint — not PII heavy
  return btoa(`${ip}|${ua}`).slice(0, 64);
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

  try {
    const body = (await req.json()) as TrackPayload;

    if (!body?.ref_code || typeof body.ref_code !== "string") {
      return new Response(
        JSON.stringify({ error: "ref_code is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (
      body.listing_category &&
      !LISTING_CATEGORIES.includes(body.listing_category)
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid listing_category" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Resolve promoter by code
    const { data: promoter, error: promoterErr } = await supabase
      .from("promoter_profiles")
      .select("id, promoter_code")
      .eq("promoter_code", body.ref_code)
      .maybeSingle();

    if (promoterErr) {
      console.error("Promoter lookup failed:", promoterErr);
      return new Response(
        JSON.stringify({ error: "Lookup failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!promoter) {
      return new Response(
        JSON.stringify({ error: "Unknown referral code" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const visitor_fp = fingerprint(req);

    // Insert click only when we have listing context (table requires both)
    if (body.listing_id && body.listing_category) {
      const { error: clickErr } = await supabase
        .from("referral_clicks")
        .insert({
          promoter_id: promoter.id,
          listing_id: body.listing_id,
          listing_category: body.listing_category,
          referral_url: body.referral_url ?? null,
          visitor_fingerprint: visitor_fp,
        });

      if (clickErr) {
        console.error("Click insert failed:", clickErr);
        // Continue — still set cookie so attribution works downstream
      }
    }

    // Cookie payload mirrors client-side StoredReferral
    const cookiePayload = JSON.stringify({
      promoter_code: promoter.promoter_code,
      promoter_id: promoter.id,
      listing_id: body.listing_id,
      listing_category: body.listing_category,
      timestamp: Date.now(),
    });

    return new Response(
      JSON.stringify({
        ok: true,
        promoter_id: promoter.id,
        promoter_code: promoter.promoter_code,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Set-Cookie": buildSetCookie(cookiePayload, COOKIE_DAYS),
        },
      },
    );
  } catch (e) {
    console.error("track-referral error:", e);
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
