// Expert Profile Data Model
export interface ExpertProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  banner_url: string | null;
  tagline: string;
  bio: string;
  location: string;
  specialties: string[];
  badge_tier: "starter" | "pro" | "elite" | "legend";
  is_verified: boolean;
  is_online: boolean;
  social_links: {
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  stats: {
    listings_referred: number;
    total_deal_value: number;
    avg_response_hours: number;
    member_since_years: number;
  };
  affiliate_id: string;
  rating: {
    average: number;
    count: number;
    breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  };
}

export interface FeaturedVehicle {
  id: string;
  listing_id: string;
  image_url: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: string;
  price: number;
  expert_note: string;
  category: string;
  is_cash_deal: boolean;
  seller_name: string;
  seller_location: string;
  sort_order: number;
}

export interface SocialPost {
  id: string;
  platform: "instagram" | "facebook" | "x" | "tiktok" | "youtube";
  thumbnail_url: string;
  caption: string;
  post_url: string;
  timestamp: string;
  likes: number;
  comments: number;
  is_video: boolean;
}

export interface ExpertArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnail_url: string;
  published_at: string;
  read_time: string;
}

export interface ExpertReview {
  id: string;
  reviewer_name: string;
  reviewer_avatar: string | null;
  rating: number;
  text: string;
  date: string;
  is_verified: boolean;
  vehicle_helped: string;
}

export const mockExpert: ExpertProfile = {
  id: "exp-001",
  username: "marcus-johnson",
  display_name: "Marcus Johnson",
  avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  banner_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop",
  tagline: "Your Neighborhood Car Guy · East Atlanta · Specializing in Used Trucks & Cash Deals",
  bio: "Hey, I'm Marcus — a car enthusiast and neighborhood broker based in East Atlanta. I've helped over 120 families find the right vehicle at the right price. I specialize in cash-friendly deals, trucks, and connecting buyers with honest local sellers. Reach out anytime — I respond fast.",
  location: "East Atlanta, GA",
  specialties: ["Used Cars", "Cash Deals", "Trucks & SUVs", "First-Time Buyers", "Luxury Vehicles", "Rentals", "Parts Sourcing"],
  badge_tier: "elite",
  is_verified: true,
  is_online: true,
  social_links: {
    instagram: "https://instagram.com/marcusj_cars",
    facebook: "https://facebook.com/marcusjcars",
    x: "https://x.com/marcusj_cars",
    youtube: "https://youtube.com/@marcusjcars",
    tiktok: "https://tiktok.com/@marcusj_cars",
  },
  stats: {
    listings_referred: 127,
    total_deal_value: 84200,
    avg_response_hours: 3.2,
    member_since_years: 4,
  },
  affiliate_id: "WURX-A1B2C3",
  rating: {
    average: 4.9,
    count: 128,
    breakdown: { 5: 84, 4: 12, 3: 3, 2: 1, 1: 0 },
  },
};

export const mockFeaturedVehicles: FeaturedVehicle[] = [
  {
    id: "fv-1", listing_id: "1", image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop",
    year: 2021, make: "Ford", model: "F-150", trim: "XLT", mileage: "34,200 mi", price: 32500,
    expert_note: "Clean title, one owner — great family truck.", category: "Truck",
    is_cash_deal: true, seller_name: "Atlanta Auto Sales", seller_location: "Decatur, GA", sort_order: 1,
  },
  {
    id: "fv-2", listing_id: "2", image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=300&fit=crop",
    year: 2020, make: "Honda", model: "Accord", trim: "Sport", mileage: "42,100 mi", price: 24800,
    expert_note: "Bulletproof reliability. Perfect commuter car.", category: "Car",
    is_cash_deal: false, seller_name: "Honest Deals ATL", seller_location: "East Atlanta, GA", sort_order: 2,
  },
  {
    id: "fv-3", listing_id: "3", image_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&h=300&fit=crop",
    year: 2019, make: "Toyota", model: "4Runner", trim: "SR5", mileage: "58,000 mi", price: 35900,
    expert_note: "Holds value like nothing else. Trail-ready.", category: "SUV",
    is_cash_deal: false, seller_name: "Peachtree Motors", seller_location: "Marietta, GA", sort_order: 3,
  },
  {
    id: "fv-4", listing_id: "4", image_url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=300&fit=crop",
    year: 2022, make: "Chevrolet", model: "Silverado", trim: "LT", mileage: "21,400 mi", price: 38700,
    expert_note: "Low miles, fleet maintained. Steal of a deal.", category: "Truck",
    is_cash_deal: true, seller_name: "South DeKalb Auto", seller_location: "Lithonia, GA", sort_order: 4,
  },
  {
    id: "fv-5", listing_id: "5", image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=300&fit=crop",
    year: 2020, make: "BMW", model: "330i", trim: "M Sport", mileage: "38,900 mi", price: 31200,
    expert_note: "Luxury feel without the luxury price tag.", category: "Car",
    is_cash_deal: false, seller_name: "Premier Auto ATL", seller_location: "Buckhead, GA", sort_order: 5,
  },
  {
    id: "fv-6", listing_id: "6", image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&h=300&fit=crop",
    year: 2018, make: "Jeep", model: "Wrangler", trim: "Sahara", mileage: "62,300 mi", price: 28500,
    expert_note: "Weekend warrior. Soft top, ready for summer.", category: "SUV",
    is_cash_deal: true, seller_name: "Offroad Kings", seller_location: "Conyers, GA", sort_order: 6,
  },
];

// TODO: Replace with live social API integration
// Supported: Instagram Basic Display API, Facebook Graph API, Twitter/X API v2, TikTok Display API
export const mockSocialPosts: SocialPost[] = [
  {
    id: "sp-1", platform: "instagram",
    thumbnail_url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop",
    caption: "Just helped another family drive off the lot in their dream truck 🔥 #AutoWurx #EastATL",
    post_url: "#", timestamp: "2 hours ago", likes: 342, comments: 28, is_video: false,
  },
  {
    id: "sp-2", platform: "tiktok",
    thumbnail_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    caption: "POV: You find a clean title F-150 under $30K in Atlanta 👀",
    post_url: "#", timestamp: "1 day ago", likes: 12400, comments: 891, is_video: true,
  },
  {
    id: "sp-3", platform: "youtube",
    thumbnail_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    caption: "5 Things Your Dealer Won't Tell You About Used Trucks",
    post_url: "#", timestamp: "3 days ago", likes: 8200, comments: 342, is_video: true,
  },
  {
    id: "sp-4", platform: "facebook",
    thumbnail_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
    caption: "New inventory alert! 2022 Silverado just dropped at South DeKalb Auto. DM me for details.",
    post_url: "#", timestamp: "4 days ago", likes: 156, comments: 34, is_video: false,
  },
  {
    id: "sp-5", platform: "x",
    thumbnail_url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop",
    caption: "Cash deals are king right now. Banks are slow, sellers want speed. Take advantage 💰",
    post_url: "#", timestamp: "5 days ago", likes: 523, comments: 67, is_video: false,
  },
  {
    id: "sp-6", platform: "instagram",
    thumbnail_url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop",
    caption: "4Runner never lets you down. This one's pristine. Link in bio for details.",
    post_url: "#", timestamp: "1 week ago", likes: 891, comments: 112, is_video: false,
  },
];

export const mockArticles: ExpertArticle[] = [
  {
    id: "art-1", title: "Why I Only Recommend Cash Deals in This Market",
    excerpt: "With interest rates climbing and dealers desperate to move inventory, cash buyers have more leverage than ever. Here's how I negotiate the best price for my clients using the power of immediate payment.",
    category: "Cash Deals", thumbnail_url: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=600&h=400&fit=crop",
    published_at: "Mar 28, 2026", read_time: "6 min read",
  },
  {
    id: "art-2", title: "The 5 Used Trucks Under $15K I'd Buy Right Now in East Atlanta",
    excerpt: "I've driven, inspected, and referred hundreds of trucks in the ATL area. These are the five I'd put my own family in today.",
    category: "Buying Guide", thumbnail_url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop",
    published_at: "Mar 15, 2026", read_time: "8 min read",
  },
  {
    id: "art-3", title: "How to Spot a Good Deal vs. a Money Pit",
    excerpt: "What dealers won't tell you about hidden problems, title washes, and the red flags I check for before recommending any vehicle.",
    category: "Local Market", thumbnail_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
    published_at: "Feb 28, 2026", read_time: "5 min read",
  },
  {
    id: "art-4", title: "My Checklist Before I Recommend Any Vehicle to a Client",
    excerpt: "From VIN checks to test drive protocols — the 12-point system I use before putting my name behind any listing.",
    category: "Maintenance", thumbnail_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    published_at: "Feb 10, 2026", read_time: "4 min read",
  },
];

export const mockReviews: ExpertReview[] = [
  {
    id: "rev-1", reviewer_name: "Tanya W.", reviewer_avatar: null, rating: 5,
    text: "Marcus found me the perfect truck in under a week. He negotiated a price I never could have gotten on my own. Honest, fast, and knows the Atlanta market inside and out.",
    date: "Mar 22, 2026", is_verified: true, vehicle_helped: "2021 Ford F-150 · Referred by Marcus",
  },
  {
    id: "rev-2", reviewer_name: "David K.", reviewer_avatar: null, rating: 5,
    text: "First-time buyer and I was nervous. Marcus walked me through every step — even came to the inspection with me. Can't recommend him enough.",
    date: "Mar 10, 2026", is_verified: true, vehicle_helped: "2020 Honda Accord · Referred by Marcus",
  },
  {
    id: "rev-3", reviewer_name: "Jasmine R.", reviewer_avatar: null, rating: 4,
    text: "Great experience overall. Marcus responded quickly and had several options for me within my budget. Only wish he had more SUV picks at the time.",
    date: "Feb 28, 2026", is_verified: true, vehicle_helped: "2019 Toyota 4Runner · Referred by Marcus",
  },
  {
    id: "rev-4", reviewer_name: "Carlos M.", reviewer_avatar: null, rating: 5,
    text: "I've used Marcus for two vehicles now. Both times he saved me money and found better options than I could find online. He's the real deal.",
    date: "Feb 15, 2026", is_verified: true, vehicle_helped: "2022 Chevrolet Silverado · Referred by Marcus",
  },
  {
    id: "rev-5", reviewer_name: "Brittany S.", reviewer_avatar: null, rating: 5,
    text: "Cash deal, no hassle, drove it home the same day. Marcus knows what he's doing.",
    date: "Jan 30, 2026", is_verified: false, vehicle_helped: "2018 Jeep Wrangler · Referred by Marcus",
  },
  {
    id: "rev-6", reviewer_name: "Darnell P.", reviewer_avatar: null, rating: 5,
    text: "The man got me into a BMW for under $32K. Clean title, no issues. Marcus is the plug.",
    date: "Jan 12, 2026", is_verified: true, vehicle_helped: "2020 BMW 330i · Referred by Marcus",
  },
];
