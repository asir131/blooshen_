import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { CarListing } from "@/data/mockListings";
import type { RentalListing, RentalDetail } from "@/data/mockRentals";
import type { PartListing } from "@/data/mockParts";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

type ListingRow = {
  id: string;
  category: ListingCategory;
  title: string;
  description: string | null;
  price: number | null;
  location: string | null;
  city: string | null;
  state: string | null;
  image: string | null;
  images: string[];
  data: Record<string, any>;
  created_at: string;
};

// Deterministic small integer from UUID for components that still expect numeric ids.
const hashToInt = (uuid: string): number => {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) h = (h * 31 + uuid.charCodeAt(i)) >>> 0;
  return h % 1_000_000;
};

const toCarListing = (r: ListingRow): CarListing => {
  const d = r.data ?? {};
  return {
    id: d.legacyId ?? hashToInt(r.id),
    year: d.year,
    make: d.make,
    model: d.model,
    trim: d.trim,
    price: Number(r.price ?? 0),
    mileage: d.mileage ?? 0,
    location: r.location ?? `${r.city ?? ""}${r.state ? `, ${r.state}` : ""}`,
    bodyStyle: d.bodyStyle ?? "",
    condition: d.condition ?? "Used",
    image: r.image ?? "",
    images: r.images?.length ? r.images : undefined,
    engine: d.engine,
    transmission: d.transmission,
    exteriorColor: d.exteriorColor,
    interiorColor: d.interiorColor,
    vin: d.vin,
    description: r.description ?? undefined,
    datePosted: d.datePosted,
    seller: d.seller,
  };
};

const toRentalListing = (r: ListingRow): RentalListing => {
  const d = r.data ?? {};
  return {
    id: d.legacyId ?? hashToInt(r.id),
    year: d.year,
    make: d.make,
    model: d.model,
    vehicleType: d.vehicleType,
    dailyRate: Number(d.dailyRate ?? r.price ?? 0),
    weeklyRate: Number(d.weeklyRate ?? 0),
    rating: d.rating ?? 0,
    reviewCount: d.reviewCount ?? 0,
    ownerName: d.ownerName ?? "",
    ownerAvatar: d.ownerAvatar ?? "",
    memberSince: d.memberSince ?? "",
    ownerType: d.ownerType ?? "Individual Owner",
    distance: d.distance ?? 0,
    availableNow: d.availableNow ?? true,
    nextAvailable: d.nextAvailable,
    features: d.features ?? [],
    image: r.image ?? "",
    detail: d.detail as RentalDetail | undefined,
  };
};

const toPartListing = (r: ListingRow): PartListing => {
  const d = r.data ?? {};
  return {
    id: d.legacyId ?? hashToInt(r.id),
    name: r.title,
    category: d.category ?? "",
    compatibleVehicles: d.compatibleVehicles ?? [],
    condition: d.condition ?? "New",
    price: Number(r.price ?? 0),
    sellerName: d.sellerName ?? "",
    sellerType: d.sellerType ?? "Individual",
    location: r.location ?? "",
    image: r.image ?? "",
  };
};

// Overloads give callers precise return types per category.
export function useListings(category: "cars_for_sale"): ReturnType<typeof useQuery<CarListing[]>>;
export function useListings(category: "rentals"): ReturnType<typeof useQuery<RentalListing[]>>;
export function useListings(category: "parts_accessories"): ReturnType<typeof useQuery<PartListing[]>>;
export function useListings(category: ListingCategory) {
  return useQuery({
    queryKey: ["listings", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("category", category)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data as unknown as ListingRow[]) ?? [];
      if (category === "cars_for_sale") return rows.map(toCarListing);
      if (category === "rentals") return rows.map(toRentalListing);
      if (category === "parts_accessories") return rows.map(toPartListing);
      return rows;
    },
  });
}
