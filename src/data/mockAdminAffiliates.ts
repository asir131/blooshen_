import { type ListingCategory } from "./mockDashboard";

/* ── Overview Stats ── */
export const mockAdminOverview = {
  totalCommissionsAllTime: 24850,
  totalCommissionsThisMonth: 4320,
  pendingPayouts: 2175,
  totalPaidOut: 22675,
  activePromoters: 47,
  conversionRate: 3.8,
  topPromotersThisMonth: [
    { rank: 1, name: "JayDrives", earned: 1240, conversions: 18 },
    { rank: 2, name: "CarPartsMike", earned: 890, conversions: 14 },
    { rank: 3, name: "RentalQueenH", earned: 720, conversions: 11 },
    { rank: 4, name: "HTXCarScene", earned: 560, conversions: 9 },
    { rank: 5, name: "AutoSavvyAli", earned: 410, conversions: 7 },
  ],
};

/* ── Pending Commissions ── */
export type FraudFlag = "same_ip" | "fast_conversion" | "repeat_conversion";

export interface PendingCommission {
  id: string;
  promoterName: string;
  promoterEmail: string;
  listingTitle: string;
  category: ListingCategory;
  conversionType: string;
  amount: number;
  date: string;
  referralUrl: string;
  flags: FraudFlag[];
}

export const mockPendingCommissions: PendingCommission[] = [
  { id: "pc-1", promoterName: "JayDrives", promoterEmail: "jay@email.com", listingTitle: "2022 BMW M4 Competition", category: "Cars for Sale", conversionType: "Lead", amount: 25, date: "2026-03-18", referralUrl: "https://autowurx.com/cars/1?ref=WURX-A1B2C3", flags: [] },
  { id: "pc-2", promoterName: "CarPartsMike", promoterEmail: "mike@email.com", listingTitle: "K&N Cold Air Intake Kit", category: "Parts & Accessories", conversionType: "Sale", amount: 19.2, date: "2026-03-18", referralUrl: "https://autowurx.com/parts/5?ref=WURX-D4E5F6", flags: [] },
  { id: "pc-3", promoterName: "HTXCarScene", promoterEmail: "htx@email.com", listingTitle: "Houston Cars & Coffee", category: "Events & Meetups", conversionType: "Ticket", amount: 20, date: "2026-03-17", referralUrl: "https://autowurx.com/events/3?ref=WURX-G7H8I9", flags: ["fast_conversion"] },
  { id: "pc-4", promoterName: "RentalQueenH", promoterEmail: "queen@email.com", listingTitle: "2024 Tesla Model 3 — Daily Rental", category: "Rentals", conversionType: "Booking", amount: 48, date: "2026-03-17", referralUrl: "https://autowurx.com/rentals/2?ref=WURX-J0K1L2", flags: [] },
  { id: "pc-5", promoterName: "ShadyPromo99", promoterEmail: "shady@email.com", listingTitle: "2022 BMW M4 Competition", category: "Cars for Sale", conversionType: "Lead", amount: 25, date: "2026-03-16", referralUrl: "https://autowurx.com/cars/1?ref=WURX-M3N4O5", flags: ["same_ip", "repeat_conversion"] },
  { id: "pc-6", promoterName: "AutoSavvyAli", promoterEmail: "ali@email.com", listingTitle: "Mobile Detailing Service", category: "Service Providers", conversionType: "Booking", amount: 35, date: "2026-03-16", referralUrl: "https://autowurx.com/services/8?ref=WURX-P6Q7R8", flags: [] },
];

/* ── Promoter Directory ── */
export type PromoterStatus = "Active" | "Suspended" | "Pending";

export interface AdminPromoter {
  id: string;
  name: string;
  email: string;
  code: string;
  joinDate: string;
  totalEarned: number;
  pendingEarnings: number;
  totalClicks: number;
  totalConversions: number;
  status: PromoterStatus;
  flaggedEvents: number;
}

export const mockAdminPromoters: AdminPromoter[] = [
  { id: "ap-1", name: "Jay Williams", email: "jay@email.com", code: "WURX-A1B2C3", joinDate: "2025-11-02", totalEarned: 4820, pendingEarnings: 125, totalClicks: 1847, totalConversions: 62, status: "Active", flaggedEvents: 0 },
  { id: "ap-2", name: "Mike Chen", email: "mike@email.com", code: "WURX-D4E5F6", joinDate: "2025-12-15", totalEarned: 3210, pendingEarnings: 89, totalClicks: 1204, totalConversions: 41, status: "Active", flaggedEvents: 1 },
  { id: "ap-3", name: "Hannah Rodriguez", email: "queen@email.com", code: "WURX-J0K1L2", joinDate: "2026-01-08", totalEarned: 2640, pendingEarnings: 210, totalClicks: 956, totalConversions: 34, status: "Active", flaggedEvents: 0 },
  { id: "ap-4", name: "Derek Thompson", email: "htx@email.com", code: "WURX-G7H8I9", joinDate: "2026-01-20", totalEarned: 1890, pendingEarnings: 0, totalClicks: 723, totalConversions: 28, status: "Active", flaggedEvents: 0 },
  { id: "ap-5", name: "Ali Farouk", email: "ali@email.com", code: "WURX-P6Q7R8", joinDate: "2026-02-05", totalEarned: 960, pendingEarnings: 35, totalClicks: 412, totalConversions: 15, status: "Active", flaggedEvents: 0 },
  { id: "ap-6", name: "Shady Promo", email: "shady@email.com", code: "WURX-M3N4O5", joinDate: "2026-03-01", totalEarned: 50, pendingEarnings: 25, totalClicks: 89, totalConversions: 3, status: "Suspended", flaggedEvents: 4 },
  { id: "ap-7", name: "New Applicant", email: "newbie@email.com", code: "WURX-S9T0U1", joinDate: "2026-03-18", totalEarned: 0, pendingEarnings: 0, totalClicks: 0, totalConversions: 0, status: "Pending", flaggedEvents: 0 },
];

/* ── Payout Queue ── */
export interface PayoutItem {
  id: string;
  promoterName: string;
  promoterEmail: string;
  amount: number;
  method: "Venmo" | "PayPal" | "ACH" | "Check";
  commissionsCount: number;
  approvedDate: string;
}

export const mockPayoutQueue: PayoutItem[] = [
  { id: "po-1", promoterName: "Jay Williams", promoterEmail: "jay@email.com", amount: 425, method: "Venmo", commissionsCount: 8, approvedDate: "2026-03-15" },
  { id: "po-2", promoterName: "Mike Chen", promoterEmail: "mike@email.com", amount: 312, method: "PayPal", commissionsCount: 6, approvedDate: "2026-03-15" },
  { id: "po-3", promoterName: "Hannah Rodriguez", promoterEmail: "queen@email.com", amount: 580, method: "ACH", commissionsCount: 11, approvedDate: "2026-03-14" },
  { id: "po-4", promoterName: "Derek Thompson", promoterEmail: "htx@email.com", amount: 195, method: "Venmo", commissionsCount: 4, approvedDate: "2026-03-14" },
  { id: "po-5", promoterName: "Ali Farouk", promoterEmail: "ali@email.com", amount: 105, method: "PayPal", commissionsCount: 3, approvedDate: "2026-03-13" },
];

/* ── Commission Rules ── */
export interface CommissionRule {
  category: ListingCategory;
  categoryKey: string;
  leadRate: number;
  saleRate: number;
  saleType: "fixed" | "percent";
  enabled: boolean;
  lastChanged: string;
  changedBy: string;
}

export const mockCommissionRules: CommissionRule[] = [
  { category: "Cars for Sale", categoryKey: "cars_for_sale", leadRate: 25, saleRate: 150, saleType: "fixed", enabled: true, lastChanged: "2026-02-01", changedBy: "Admin" },
  { category: "Parts & Accessories", categoryKey: "parts_accessories", leadRate: 0, saleRate: 8, saleType: "percent", enabled: true, lastChanged: "2026-02-01", changedBy: "Admin" },
  { category: "Service Providers", categoryKey: "service_providers", leadRate: 10, saleRate: 35, saleType: "fixed", enabled: true, lastChanged: "2026-02-15", changedBy: "Admin" },
  { category: "Rentals", categoryKey: "rentals", leadRate: 0, saleRate: 12, saleType: "percent", enabled: true, lastChanged: "2026-02-01", changedBy: "Admin" },
  { category: "Neighborhood Experts", categoryKey: "neighborhood_experts", leadRate: 8, saleRate: 0, saleType: "fixed", enabled: true, lastChanged: "2026-02-01", changedBy: "Admin" },
  { category: "Events & Meetups", categoryKey: "events_meetups", leadRate: 5, saleRate: 20, saleType: "fixed", enabled: true, lastChanged: "2026-03-10", changedBy: "Admin" },
];

/* ── AI Agent Logs ── */
export interface AgentLog {
  id: string;
  listingTitle: string;
  category: ListingCategory;
  startTime: string;
  durationMinutes: number;
  messageCount: number;
  leadCaptured: boolean;
  conversionFired: boolean;
  promoterAttributed: string | null;
  flagged: boolean;
  transcript: { role: "user" | "assistant"; content: string }[];
}

export const mockAgentLogs: AgentLog[] = [
  { id: "al-1", listingTitle: "2022 BMW M4 Competition", category: "Cars for Sale", startTime: "2026-03-18T14:23:00", durationMinutes: 8, messageCount: 12, leadCaptured: true, conversionFired: true, promoterAttributed: "JayDrives", flagged: false, transcript: [{ role: "assistant", content: "Hey! Interested in this 2022 BMW M4 Competition? I can answer questions or help schedule a test drive." }, { role: "user", content: "What's the mileage on it?" }, { role: "assistant", content: "Great question! This M4 has 12,400 miles — very low for a 2022 model." }, { role: "user", content: "Price negotiable?" }, { role: "assistant", content: "The seller is open to reasonable offers. Would you like me to connect you directly?" }] },
  { id: "al-2", listingTitle: "2024 Tesla Model 3 — Daily Rental", category: "Rentals", startTime: "2026-03-18T11:05:00", durationMinutes: 5, messageCount: 8, leadCaptured: true, conversionFired: false, promoterAttributed: "RentalQueenH", flagged: false, transcript: [{ role: "assistant", content: "Looking to rent this Tesla Model 3? I can check dates and terms." }, { role: "user", content: "Available next weekend?" }, { role: "assistant", content: "Let me check... Yes, it's available March 22-23!" }] },
  { id: "al-3", listingTitle: "K&N Cold Air Intake Kit", category: "Parts & Accessories", startTime: "2026-03-17T16:42:00", durationMinutes: 3, messageCount: 5, leadCaptured: false, conversionFired: false, promoterAttributed: null, flagged: false, transcript: [{ role: "assistant", content: "Got questions about this part? I can confirm compatibility." }, { role: "user", content: "Will this fit a 2020 Civic Si?" }, { role: "assistant", content: "This specific kit is designed for the 10th gen Civic Si (2016-2021), so yes!" }] },
  { id: "al-4", listingTitle: "Mobile Detailing Service", category: "Service Providers", startTime: "2026-03-17T09:15:00", durationMinutes: 12, messageCount: 18, leadCaptured: true, conversionFired: true, promoterAttributed: "AutoSavvyAli", flagged: true, transcript: [{ role: "assistant", content: "Need detailing service? I can get you a quote or book today." }, { role: "user", content: "How much for a full detail on a truck?" }, { role: "assistant", content: "For trucks, the full detail starts at $199. Includes interior, exterior, and engine bay." }] },
  { id: "al-5", listingTitle: "Houston Cars & Coffee", category: "Events & Meetups", startTime: "2026-03-16T20:30:00", durationMinutes: 2, messageCount: 4, leadCaptured: false, conversionFired: false, promoterAttributed: "HTXCarScene", flagged: false, transcript: [{ role: "assistant", content: "Interested in this event? I can give you details or help RSVP." }, { role: "user", content: "Is parking free?" }, { role: "assistant", content: "Yes! Free parking at the venue. The event is also free to attend." }] },
];
