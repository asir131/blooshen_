export interface Broker {
  id: string;
  username: string;
  name: string;
  location: string;
  distance: string;
  tagline: string;
  specialties: string[];
  deals: number;
  rating: number;
  responseTime: string;
  years: number;
  bio: string;
  badge: "Starter" | "Pro" | "Elite" | "Legend";
  verified: boolean;
  online: boolean;
  avatarUrl: string;
  featuredVehicles: { name: string; price: string }[];
}

export const mockBrokers: Broker[] = [
  {
    id: "1",
    username: "marcuswilliams",
    name: "Marcus J. Williams",
    location: "East Atlanta, GA",
    distance: "2.4 mi",
    tagline: "Your Neighborhood Car Guy · Cash Deals & Trucks",
    specialties: ["Cash Deals", "Used Trucks", "First-Time Buyers"],
    deals: 127,
    rating: 4.9,
    responseTime: "3hr",
    years: 4,
    bio: "I find cash-friendly deals you won't see on the big sites. I've helped 120+ families skip the dealership drama and drive away happy. Reach out — I respond fast.",
    badge: "Elite",
    verified: true,
    online: true,
    avatarUrl: "",
    featuredVehicles: [
      { name: "2020 F-150", price: "$28,500" },
      { name: "2019 Accord", price: "$18,200" },
      { name: "2021 4Runner", price: "$34,900" },
    ],
  },
  {
    id: "2",
    username: "keishamonroe",
    name: "Keisha T. Monroe",
    location: "Decatur, GA",
    distance: "5.1 mi",
    tagline: "Luxury & Family SUV Specialist · No-Nonsense Deals",
    specialties: ["Luxury Vehicles", "SUVs", "Financing Guidance"],
    deals: 89,
    rating: 4.8,
    responseTime: "1hr",
    years: 3,
    bio: "Former finance manager turned buyer advocate. I know every trick dealers use — and I use that knowledge to protect my clients. Certified in automotive finance. Let me save you thousands.",
    badge: "Pro",
    verified: true,
    online: true,
    avatarUrl: "",
    featuredVehicles: [
      { name: "2022 Highlander", price: "$36,400" },
      { name: "2021 GX460", price: "$42,100" },
      { name: "2023 Pilot", price: "$38,700" },
    ],
  },
  {
    id: "3",
    username: "devonokafor",
    name: "Devon R. Okafor",
    location: "Stone Mountain, GA",
    distance: "8.7 mi",
    tagline: "First-Time Buyer Expert · Remote & In-Person",
    specialties: ["First-Time Buyers", "Remote Paperwork", "Budget Builds", "Cash Deals"],
    deals: 54,
    rating: 5.0,
    responseTime: "45min",
    years: 2,
    bio: "I specialize in helping first-time buyers navigate the process without getting taken advantage of. I walk you through everything — from pre-approval to the keys in your hand. Rising star on the AutoWurx leaderboard.",
    badge: "Pro",
    verified: true,
    online: false,
    avatarUrl: "",
    featuredVehicles: [
      { name: "2019 Civic", price: "$16,800" },
      { name: "2020 Corolla", price: "$17,500" },
      { name: "2018 Sentra", price: "$12,200" },
    ],
  },
];

export const testimonials = [
  {
    quote: "Marcus found me a clean F-150 cash deal in 48 hours. I described what I wanted on Monday — I was driving it by Wednesday. Unreal.",
    name: "Tanya D.",
    city: "East Atlanta",
  },
  {
    quote: "As a first-time buyer I had no idea what I was doing. Devon walked me through everything. He knew every trick dealers try and made sure none of them worked on me.",
    name: "James R.",
    city: "Stone Mountain",
  },
  {
    quote: "Keisha saved me $4,200 on my Highlander compared to what the dealer originally quoted. She's a former finance manager — she knew exactly where the markup was hiding.",
    name: "Priya M.",
    city: "Decatur",
  },
  {
    quote: "I didn't step inside a dealership once. My broker brought two cars to my house for test drives, handled all the paperwork remotely, and the car was in my driveway by Friday.",
    name: "Chris W.",
    city: "Atlanta",
  },
  {
    quote: "Stop going to dealerships alone. Just stop. Use an AutoWurx broker. I wish I'd known about this years ago.",
    name: "Marcus B.",
    city: "Marietta",
  },
  {
    quote: "Devon responded to my message in 22 minutes. By the end of the week he had found me 3 options under my budget. Couldn't be happier.",
    name: "Simone T.",
    city: "Smyrna",
  },
];
