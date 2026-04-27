/**
 * AutoWurx — Safe Listings Data Layer
 *
 * The ONLY function the public marketplace should use to fetch vehicle
 * listings. Combines server-side RLS-friendly filters with a client-side
 * defense-in-depth pass to guarantee that nothing flagged, blocked, or
 * thinly-validated ever reaches the storefront.
 *
 * Never use raw `.from('vehicle_listings').select('*')` in marketplace code.
 */
import { supabase } from "@/integrations/supabase/client";

export interface ListingFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  yearMin?: number;
  yearMax?: number;
  bodyStyle?: string;
  sellerType?: "dealer" | "private" | "broker";
  limit?: number;
}

export interface SafeListingImage {
  url: string;
  is_primary: boolean;
  quality_score: number;
}

export interface SafeListing {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  body_style: string | null;
  color: string | null;
  condition: string | null;
  seller_type: string;
  description: string;
  fraud_score: number;
  validation_score: number;
  validation_status: string;
  status: string;
  is_published: boolean;
  published_at: string | null;
  flag_reasons: unknown;
  listing_images: SafeListingImage[];
}

interface FlagEntry {
  severity?: string;
  code?: string;
}

export async function getApprovedListings(
  filters: ListingFilters = {},
): Promise<SafeListing[]> {
  let query = supabase
    .from("vehicle_listings")
    .select(
      `
      *,
      listing_images!inner(url, is_primary, quality_score)
    `,
    )
    .eq("status", "approved")
    .eq("is_published", true)
    .eq("validation_status", "passed")
    .gte("validation_score", 70)
    .order("published_at", { ascending: false });

  if (filters.make) query = query.ilike("make", `%${filters.make}%`);
  if (filters.model) query = query.ilike("model", `%${filters.model}%`);
  if (filters.bodyStyle) query = query.eq("body_style", filters.bodyStyle);
  if (filters.sellerType) query = query.eq("seller_type", filters.sellerType);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
  if (filters.yearMin != null) query = query.gte("year", filters.yearMin);
  if (filters.yearMax != null) query = query.lte("year", filters.yearMax);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[safeListings] query failed:", error.message);
    return [];
  }

  // Defense in depth — never trust a single layer.
  return ((data ?? []) as unknown as SafeListing[]).filter((listing) => {
    const images = listing.listing_images ?? [];
    if (images.length < 3) return false;
    if ((listing.fraud_score ?? 0) >= 60) return false;
    const flags = Array.isArray(listing.flag_reasons)
      ? (listing.flag_reasons as FlagEntry[])
      : [];
    if (flags.some((f) => f && f.severity === "critical")) return false;
    return true;
  });
}

export async function getApprovedListingById(
  id: string,
): Promise<SafeListing | null> {
  const { data, error } = await supabase
    .from("vehicle_listings")
    .select(
      `
      *,
      listing_images(url, is_primary, quality_score)
    `,
    )
    .eq("id", id)
    .eq("status", "approved")
    .eq("is_published", true)
    .eq("validation_status", "passed")
    .maybeSingle();

  if (error || !data) return null;
  const listing = data as unknown as SafeListing;
  if ((listing.listing_images ?? []).length < 3) return null;
  if ((listing.fraud_score ?? 0) >= 60) return null;
  return listing;
}
