export type ListingCategory = "Cars for Sale" | "Parts & Accessories" | "Service Providers" | "Rentals" | "Neighborhood Experts" | "Events & Meetups";
export type ListingStatus = "Active" | "Pending" | "Expired" | "Draft";

export interface DashboardListing {
  id: string;
  title: string;
  thumbnail: string;
  category: ListingCategory;
  views: number;
  datePosted: string;
  status: ListingStatus;
}

export interface MyRentalVehicle {
  id: string;
  photo: string;
  name: string;
  dailyRate: number;
  daysBookedThisMonth: number;
  earningsToDate: number;
}

export interface BookedRental {
  id: string;
  vehiclePhoto: string;
  vehicleName: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalPaid: number;
  status: "Upcoming" | "Active" | "Completed";
  reviewed: boolean;
}

export interface DashboardMessage {
  id: string;
  from: string;
  avatar: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
}

export interface DashboardReview {
  id: string;
  entityName: string;
  rating: number;
  text: string;
  date: string;
}

export interface DashboardEvent {
  id: string;
  title: string;
  date: string;
  type: "rsvp" | "hosted";
  attending: number;
}

export const categoryColors: Record<ListingCategory, string> = {
  "Cars for Sale": "bg-primary/15 text-primary",
  "Parts & Accessories": "bg-cta/15 text-cta",
  "Service Providers": "bg-success/15 text-success",
  "Rentals": "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  "Neighborhood Experts": "bg-[hsl(270_60%_60%)]/15 text-[hsl(270_60%_60%)]",
  "Events & Meetups": "bg-destructive/15 text-destructive",
};

export const mockListingsDashboard: DashboardListing[] = [
  { id: "dl-1", title: "2022 BMW M4 Competition", thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&h=100&fit=crop", category: "Cars for Sale", views: 342, datePosted: "2026-03-10", status: "Active" },
  { id: "dl-2", title: "K&N Cold Air Intake Kit", thumbnail: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&h=100&fit=crop", category: "Parts & Accessories", views: 128, datePosted: "2026-03-05", status: "Active" },
  { id: "dl-3", title: "Marcus Jenkins — Engine Diagnostics", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", category: "Neighborhood Experts", views: 89, datePosted: "2026-02-20", status: "Active" },
  { id: "dl-4", title: "2024 Tesla Model 3 — Daily Rental", thumbnail: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&h=100&fit=crop", category: "Rentals", views: 215, datePosted: "2026-03-01", status: "Active" },
  { id: "dl-5", title: "Houston Cars & Coffee", thumbnail: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&h=100&fit=crop", category: "Events & Meetups", views: 512, datePosted: "2026-02-15", status: "Active" },
  { id: "dl-6", title: "Mobile Detailing Service", thumbnail: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=100&h=100&fit=crop", category: "Service Providers", views: 176, datePosted: "2026-03-08", status: "Pending" },
  { id: "dl-7", title: "2019 Ford F-150 XLT", thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=100&h=100&fit=crop", category: "Cars for Sale", views: 67, datePosted: "2026-01-15", status: "Expired" },
  { id: "dl-8", title: "Borla Exhaust System", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100&h=100&fit=crop", category: "Parts & Accessories", views: 0, datePosted: "2026-03-18", status: "Draft" },
];

export const mockMyRentalVehicles: MyRentalVehicle[] = [
  { id: "rv-1", photo: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=150&fit=crop", name: "2024 Tesla Model 3", dailyRate: 85, daysBookedThisMonth: 18, earningsToDate: 4250 },
  { id: "rv-2", photo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=150&fit=crop", name: "2023 Toyota Camry", dailyRate: 55, daysBookedThisMonth: 12, earningsToDate: 2640 },
];

export const mockBookedRentals: BookedRental[] = [
  { id: "br-1", vehiclePhoto: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop", vehicleName: "2022 Porsche 911", ownerName: "Carlos M.", startDate: "2026-03-25", endDate: "2026-03-28", totalPaid: 750, status: "Upcoming", reviewed: false },
  { id: "br-2", vehiclePhoto: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=150&fit=crop", vehicleName: "2021 Ford Mustang GT", ownerName: "Sarah K.", startDate: "2026-03-10", endDate: "2026-03-12", totalPaid: 340, status: "Completed", reviewed: false },
  { id: "br-3", vehiclePhoto: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=150&fit=crop", vehicleName: "2023 Chevy Tahoe", ownerName: "Mike R.", startDate: "2026-02-20", endDate: "2026-02-25", totalPaid: 625, status: "Completed", reviewed: true },
];

export const mockMessages: DashboardMessage[] = [
  { id: "msg-1", from: "Carlos M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", subject: "Re: Porsche 911 rental", preview: "Sounds good! I'll have the car ready at 10 AM on the 25th...", date: "2026-03-18", read: false },
  { id: "msg-2", from: "Sarah K.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face", subject: "Mustang GT — how was it?", preview: "Hey! Hope you enjoyed the car. Would love a review if you...", date: "2026-03-13", read: false },
  { id: "msg-3", from: "AutoWurx Support", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face", subject: "Your listing has been approved", preview: "Your listing 'Mobile Detailing Service' is now live...", date: "2026-03-09", read: true },
];

export const mockDashboardReviews: DashboardReview[] = [
  { id: "dr-1", entityName: "AutoTech Solutions", rating: 5, text: "Best mechanic in the city. Fixed my transmission issue...", date: "2026-03-10" },
  { id: "dr-2", entityName: "K&N Cold Air Intake", rating: 5, text: "Noticeable power increase and great throttle response...", date: "2026-03-05" },
];

export const mockDashboardEvents: DashboardEvent[] = [
  { id: "de-1", title: "Houston Cars & Coffee", date: "2026-03-28", type: "hosted", attending: 342 },
  { id: "de-2", title: "MSR Houston Track Day", date: "2026-04-05", type: "rsvp", attending: 87 },
  { id: "de-3", title: "Spring Auto Swap Meet", date: "2026-04-12", type: "rsvp", attending: 215 },
];
