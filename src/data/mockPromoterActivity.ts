export interface ListingPromoterActivity {
  listingId: string;
  activePromoters: number;
  totalClicks: number;
  totalConversions: number;
  totalCommissionsPaid: number;
  commissionsPaused: boolean;
  featuredInMarketplace: boolean;
  topPromoter: { name: string; conversions: number } | null;
}

export const mockPromoterActivity: Record<string, ListingPromoterActivity> = {
  "dl-1": {
    listingId: "dl-1",
    activePromoters: 8,
    totalClicks: 247,
    totalConversions: 12,
    totalCommissionsPaid: 300,
    commissionsPaused: false,
    featuredInMarketplace: true,
    topPromoter: { name: "JayDrives", conversions: 5 },
  },
  "dl-2": {
    listingId: "dl-2",
    activePromoters: 3,
    totalClicks: 89,
    totalConversions: 4,
    totalCommissionsPaid: 64,
    commissionsPaused: false,
    featuredInMarketplace: false,
    topPromoter: { name: "CarPartsMike", conversions: 2 },
  },
  "dl-4": {
    listingId: "dl-4",
    activePromoters: 5,
    totalClicks: 156,
    totalConversions: 7,
    totalCommissionsPaid: 210,
    commissionsPaused: false,
    featuredInMarketplace: false,
    topPromoter: { name: "RentalQueenH", conversions: 3 },
  },
  "dl-5": {
    listingId: "dl-5",
    activePromoters: 2,
    totalClicks: 45,
    totalConversions: 15,
    totalCommissionsPaid: 75,
    commissionsPaused: false,
    featuredInMarketplace: false,
    topPromoter: { name: "HTXCarScene", conversions: 10 },
  },
};
