import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];
type ConversionType = Database["public"]["Enums"]["conversion_type"];

const REF_COOKIE_KEY = "autowurx_ref";
const REF_STORAGE_KEY = "autowurx_referral";
const COOKIE_DAYS = 30;

interface StoredReferral {
  promoter_code: string;
  promoter_id: string;
  listing_id?: string;
  listing_category?: ListingCategory;
  timestamp: number;
}

// Cookie helpers
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Reads the stored referral from cookie (primary) or localStorage (fallback) */
export function getStoredReferral(): StoredReferral | null {
  try {
    const cookieVal = getCookie(REF_COOKIE_KEY);
    if (cookieVal) return JSON.parse(cookieVal);
    const lsVal = localStorage.getItem(REF_STORAGE_KEY);
    if (lsVal) return JSON.parse(lsVal);
  } catch {
    // ignore
  }
  return null;
}

/** Clears the stored referral */
export function clearStoredReferral() {
  document.cookie = `${REF_COOKIE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  localStorage.removeItem(REF_STORAGE_KEY);
}

/**
 * Hook: detects ?ref= param on page load, resolves the promoter, stores attribution,
 * and records a referral click.
 */
export function useReferralDetection() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (!refCode) return;

    (async () => {
      // Look up promoter by code
      const { data: promoter } = await supabase
        .from("promoter_profiles")
        .select("id, promoter_code")
        .eq("promoter_code", refCode)
        .maybeSingle();

      if (!promoter) return;

      // Extract listing info from current path
      const path = window.location.pathname;
      let listing_id: string | undefined;
      let listing_category: ListingCategory | undefined;

      const carMatch = path.match(/\/cars-for-sale\/(\d+)/);
      const rentalMatch = path.match(/\/rentals\/(\d+)/);

      if (carMatch) {
        listing_id = carMatch[1];
        listing_category = "cars_for_sale";
      } else if (rentalMatch) {
        listing_id = rentalMatch[1];
        listing_category = "rentals";
      }

      const referral: StoredReferral = {
        promoter_code: promoter.promoter_code,
        promoter_id: promoter.id,
        listing_id,
        listing_category,
        timestamp: Date.now(),
      };

      // Store in cookie + localStorage
      setCookie(REF_COOKIE_KEY, JSON.stringify(referral), COOKIE_DAYS);
      localStorage.setItem(REF_STORAGE_KEY, JSON.stringify(referral));

      // Record click
      if (listing_id && listing_category) {
        await supabase.from("referral_clicks").insert({
          promoter_id: promoter.id,
          listing_id,
          listing_category,
          referral_url: window.location.href,
        });
      }

      // Clean ref param from URL
      searchParams.delete("ref");
      setSearchParams(searchParams, { replace: true });
    })();
  }, [searchParams, setSearchParams]);
}

/**
 * Fire an attribution / conversion event. Checks for a stored referral and
 * inserts a commission row if one exists.
 */
export async function fireConversionEvent(opts: {
  listing_id: string;
  listing_category: ListingCategory;
  conversion_type: ConversionType;
  sale_amount?: number;
}) {
  const referral = getStoredReferral();
  if (!referral) return null;

  const { data, error } = await supabase.from("commissions").insert({
    promoter_id: referral.promoter_id,
    listing_id: opts.listing_id,
    listing_category: opts.listing_category,
    conversion_type: opts.conversion_type,
    sale_amount: opts.sale_amount ?? null,
    metadata: {
      referral_code: referral.promoter_code,
      original_listing: referral.listing_id,
    },
  }).select().single();

  if (error) {
    console.error("Failed to record conversion:", error);
    return null;
  }

  return data;
}
