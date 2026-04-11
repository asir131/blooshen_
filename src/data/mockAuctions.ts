export interface Auction {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  engine: string;
  transmission: string;
  color: string;
  location: string;
  currentBid: number;
  minIncrement: number;
  status: "live" | "timed" | "upcoming";
  /** ms from now until end (or start for upcoming) */
  timeLeftMs: number;
  bids: number;
  watchers: number;
  noReserve: boolean;
  condition: "Clean Title" | "Salvage" | "Rebuilt";
  reserveMet: boolean;
  sellerName: string;
  sellerRating: number;
  image: string;
  vin: string;
  description: string;
}

const hours = (h: number) => h * 3600_000;
const mins = (m: number) => m * 60_000;
const days = (d: number) => d * 86400_000;

export const mockAuctions: Auction[] = [
  {
    id: "auc-001",
    year: 2019, make: "Ford", model: "F-150", trim: "XLT",
    mileage: 44200, engine: "3.5L EcoBoost", transmission: "Auto", color: "White",
    location: "East Atlanta, GA",
    currentBid: 18400, minIncrement: 250,
    status: "live", timeLeftMs: hours(2) + mins(14) + 33000,
    bids: 47, watchers: 14, noReserve: true, condition: "Clean Title", reserveMet: true,
    sellerName: "Marcus J.", sellerRating: 4.9,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop",
    vin: "1FTEW1EP5KKC12345", description: "One owner, garage kept F-150 XLT with EcoBoost.",
  },
  {
    id: "auc-002",
    year: 2021, make: "Toyota", model: "4Runner", trim: "SR5",
    mileage: 28500, engine: "4.0L V6", transmission: "Auto", color: "Black",
    location: "Decatur, GA",
    currentBid: 32100, minIncrement: 500,
    status: "timed", timeLeftMs: hours(6) + mins(42) + 10000,
    bids: 23, watchers: 9, noReserve: false, condition: "Clean Title", reserveMet: false,
    sellerName: "Tanya R.", sellerRating: 4.8,
    image: "https://images.unsplash.com/photo-1625231334168-32536257f732?w=600&h=400&fit=crop",
    vin: "JTEBU5JR5M5123456", description: "Low-mileage 4Runner SR5 in great condition.",
  },
  {
    id: "auc-003",
    year: 2017, make: "BMW", model: "5 Series", trim: "540i",
    mileage: 61000, engine: "3.0L Twin Turbo", transmission: "Auto", color: "Gray",
    location: "Buckhead, GA",
    currentBid: 24800, minIncrement: 250,
    status: "live", timeLeftMs: mins(47) + 22000,
    bids: 31, watchers: 21, noReserve: false, condition: "Clean Title", reserveMet: true,
    sellerName: "David K.", sellerRating: 4.7,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    vin: "WBAJE5C38HG123456", description: "540i with M Sport package, fully loaded.",
  },
  {
    id: "auc-004",
    year: 2020, make: "Chevrolet", model: "Silverado 1500", trim: "LT",
    mileage: 38700, engine: "5.3L V8", transmission: "Auto", color: "Red",
    location: "Stone Mountain, GA",
    currentBid: 28600, minIncrement: 500,
    status: "timed", timeLeftMs: days(1) + hours(2) + mins(15),
    bids: 18, watchers: 7, noReserve: true, condition: "Clean Title", reserveMet: true,
    sellerName: "James L.", sellerRating: 4.6,
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop",
    vin: "3GCUYDED0LG123456", description: "Silverado LT with tow package and bed liner.",
  },
  {
    id: "auc-005",
    year: 2016, make: "Jeep", model: "Wrangler", trim: "Unlimited",
    mileage: 72300, engine: "3.6L V6", transmission: "Manual", color: "Green",
    location: "Marietta, GA",
    currentBid: 19500, minIncrement: 250,
    status: "timed", timeLeftMs: mins(31) + 44000,
    bids: 52, watchers: 18, noReserve: true, condition: "Clean Title", reserveMet: true,
    sellerName: "Nina P.", sellerRating: 4.9,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
    vin: "1C4BJWDG2GL123456", description: "Wrangler Unlimited with lift kit and off-road tires.",
  },
  {
    id: "auc-006",
    year: 2018, make: "Honda", model: "Civic", trim: "Type R",
    mileage: 29100, engine: "2.0L Turbo", transmission: "Manual", color: "White",
    location: "Smyrna, GA",
    currentBid: 22300, minIncrement: 250,
    status: "live", timeLeftMs: hours(4) + mins(8) + 55000,
    bids: 38, watchers: 12, noReserve: false, condition: "Clean Title", reserveMet: false,
    sellerName: "Chris M.", sellerRating: 4.8,
    image: "https://images.unsplash.com/photo-1606611013016-969c19ba27d5?w=600&h=400&fit=crop",
    vin: "SHHFK8G70JU123456", description: "One owner Civic Type R, unmodified.",
  },
  {
    id: "auc-007",
    year: 2015, make: "Ford", model: "Mustang", trim: "GT",
    mileage: 55400, engine: "5.0L V8", transmission: "Manual", color: "Blue",
    location: "Kennesaw, GA",
    currentBid: 14900, minIncrement: 250,
    status: "timed", timeLeftMs: mins(52) + 18000,
    bids: 29, watchers: 15, noReserve: true, condition: "Clean Title", reserveMet: true,
    sellerName: "Alex T.", sellerRating: 4.5,
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600&h=400&fit=crop",
    vin: "1FA6P8CF0F5123456", description: "Mustang GT with Brembo brake package.",
  },
  {
    id: "auc-008",
    year: 2022, make: "Tesla", model: "Model 3", trim: "Long Range",
    mileage: 18200, engine: "Dual Motor", transmission: "Auto", color: "White",
    location: "Midtown Atlanta, GA",
    currentBid: 28100, minIncrement: 500,
    status: "upcoming", timeLeftMs: hours(3),
    bids: 0, watchers: 22, noReserve: false, condition: "Clean Title", reserveMet: false,
    sellerName: "Taylor S.", sellerRating: 5.0,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
    vin: "5YJ3E1EA5NF123456", description: "Model 3 LR with FSD and white interior.",
  },
  {
    id: "auc-009",
    year: 2019, make: "RAM", model: "1500", trim: "Laramie",
    mileage: 49800, engine: "5.7L HEMI", transmission: "Auto", color: "Black",
    location: "Duluth, GA",
    currentBid: 27400, minIncrement: 500,
    status: "timed", timeLeftMs: days(2) + hours(4) + mins(30),
    bids: 11, watchers: 5, noReserve: false, condition: "Clean Title", reserveMet: false,
    sellerName: "Jerome W.", sellerRating: 4.7,
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop",
    vin: "1C6SRFFT7KN123456", description: "Laramie with leather, nav, and sunroof.",
  },
  {
    id: "auc-010",
    year: 2014, make: "Chevrolet", model: "Camaro", trim: "SS",
    mileage: 68200, engine: "6.2L V8", transmission: "Manual", color: "Red",
    location: "College Park, GA",
    currentBid: 16800, minIncrement: 250,
    status: "live", timeLeftMs: hours(1) + mins(22) + 40000,
    bids: 44, watchers: 16, noReserve: true, condition: "Clean Title", reserveMet: true,
    sellerName: "Brian H.", sellerRating: 4.6,
    image: "https://images.unsplash.com/photo-1603553329474-99f95f35394f?w=600&h=400&fit=crop",
    vin: "2G1FK1EJ1E9123456", description: "Camaro SS with performance exhaust and cold air intake.",
  },
  {
    id: "auc-011",
    year: 2020, make: "Kia", model: "Telluride", trim: "EX",
    mileage: 31400, engine: "3.8L V6", transmission: "Auto", color: "Dark Moss",
    location: "Norcross, GA",
    currentBid: 29700, minIncrement: 500,
    status: "timed", timeLeftMs: hours(5) + mins(15),
    bids: 16, watchers: 8, noReserve: false, condition: "Clean Title", reserveMet: false,
    sellerName: "Lisa C.", sellerRating: 4.9,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0637?w=600&h=400&fit=crop",
    vin: "5XYP6DHC6LG123456", description: "Telluride EX with premium package.",
  },
  {
    id: "auc-012",
    year: 2011, make: "Ford", model: "F-250", trim: "Super Duty",
    mileage: 142000, engine: "6.7L Power Stroke", transmission: "Auto", color: "Silver",
    location: "Lawrenceville, GA",
    currentBid: 11200, minIncrement: 250,
    status: "timed", timeLeftMs: mins(38) + 50000,
    bids: 19, watchers: 10, noReserve: true, condition: "Salvage", reserveMet: true,
    sellerName: "Ray G.", sellerRating: 4.3,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop",
    vin: "1FT7W2B69BEA12345", description: "F-250 Power Stroke, salvage title, runs strong.",
  },
];

/** Auctions ending within ~1 hour */
export const endingSoonIds = ["auc-003", "auc-005", "auc-007", "auc-012"];

export const mockBidHistory = [
  { bidder: "bidder_***92", amount: 18400, time: "2m ago" },
  { bidder: "bidder_***17", amount: 18150, time: "6m ago" },
  { bidder: "bidder_***45", amount: 17900, time: "11m ago" },
  { bidder: "bidder_***92", amount: 17650, time: "14m ago" },
  { bidder: "bidder_***03", amount: 17400, time: "19m ago" },
];
