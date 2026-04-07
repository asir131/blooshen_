export interface RentalReview {
  id: number;
  renterName: string;
  renterAvatar: string;
  rating: number;
  date: string;
  text: string;
}

export interface RentalDetail {
  seats: number;
  doors: number;
  transmission: string;
  fuelType: string;
  mpg: string;
  mileageLimit: string;
  deposit: number;
  minRentalDays: number;
  latePolicy: string;
  fuelPolicy: string;
  deliveryOption: string;
  allowedUses: string;
  included: string[];
  bookedDates: string[]; // YYYY-MM-DD
  reviews: RentalReview[];
  images: string[];
}

export interface RentalListing {
  id: number;
  year: number;
  make: string;
  model: string;
  vehicleType: string;
  dailyRate: number;
  weeklyRate: number;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerAvatar: string;
  memberSince: string;
  ownerType: "Individual Owner" | "Small Business" | "Fleet Operator";
  distance: number;
  availableNow: boolean;
  nextAvailable?: string;
  features: string[];
  image: string;
  detail?: RentalDetail;
}

const sharedDetail = (overrides: Partial<RentalDetail> = {}): RentalDetail => ({
  seats: 5, doors: 4, transmission: "Automatic", fuelType: "Gasoline", mpg: "32 city / 38 hwy",
  mileageLimit: "200 mi/day", deposit: 250, minRentalDays: 1, latePolicy: "Grace period of 1 hour, then $25/hr",
  fuelPolicy: "Return full tank", deliveryOption: "No", allowedUses: "Personal use only",
  included: ["Liability insurance included", "Roadside assistance 24/7", "1 free car seat on request", "Bluetooth / AUX audio", "Phone charger cables"],
  bookedDates: ["2025-01-05", "2025-01-06", "2025-01-07", "2025-01-12", "2025-01-13", "2025-01-14", "2025-01-15", "2025-01-20", "2025-01-21"],
  reviews: [
    { id: 1, renterName: "Alex P.", renterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&facepad=2", rating: 5, date: "2024-12-10", text: "Fantastic experience! Car was spotless and the owner was super communicative. Will rent again." },
    { id: 2, renterName: "Jordan K.", renterAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&facepad=2", rating: 4, date: "2024-11-22", text: "Great car, smooth pickup. Only minor issue was the GPS was outdated. Overall highly recommend." },
    { id: 3, renterName: "Taylor M.", renterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&facepad=2", rating: 5, date: "2024-11-05", text: "Best rental experience I've had. Way better than the big agencies. Cash payment was super convenient." },
    { id: 4, renterName: "Sam R.", renterAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&h=60&fit=crop&facepad=2", rating: 4, date: "2024-10-18", text: "Solid vehicle, fair price. Owner was flexible with pickup time. Would use Autowurx again." },
  ],
  images: [],
  ...overrides,
});

export const mockRentals: RentalListing[] = [
  { id: 1, year: 2023, make: "Toyota", model: "Camry SE", vehicleType: "Car", dailyRate: 45, weeklyRate: 270, rating: 4.9, reviewCount: 87, ownerName: "Marcus J.", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&facepad=2", memberSince: "2021", ownerType: "Individual Owner", distance: 2.1, availableNow: true, features: ["Cash Accepted", "Pet Friendly", "Long-Term OK"], image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
    detail: sharedDetail({ images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop"], deliveryOption: "Yes — $15 within 10 mi", allowedUses: "Personal, business, rideshare OK" }) },
  { id: 2, year: 2024, make: "Tesla", model: "Model Y", vehicleType: "Electric/Hybrid", dailyRate: 89, weeklyRate: 530, rating: 4.7, reviewCount: 42, ownerName: "EV Rides LLC", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&facepad=2", memberSince: "2022", ownerType: "Small Business", distance: 4.3, availableNow: true, features: ["Delivery Available", "Airport Pickup"], image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
    detail: sharedDetail({ fuelType: "Electric", mpg: "280 mi range", deposit: 500, mileageLimit: "250 mi/day", deliveryOption: "Yes — free within 15 mi", included: ["Full coverage insurance", "Roadside assistance 24/7", "Home charger adapter included", "Autopilot enabled", "Phone charger cables"], images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=900&h=600&fit=crop"] }) },
  { id: 3, year: 2022, make: "Ford", model: "F-150 XLT", vehicleType: "Truck", dailyRate: 75, weeklyRate: 450, rating: 4.5, reviewCount: 63, ownerName: "Big Dave", ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&facepad=2", memberSince: "2020", ownerType: "Individual Owner", distance: 6.8, availableNow: false, nextAvailable: "2025-01-15", features: ["Cash Accepted", "Long-Term OK"], image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 5, doors: 4, fuelType: "Gasoline", mpg: "20 city / 26 hwy", mileageLimit: "150 mi/day", deposit: 300, minRentalDays: 2, allowedUses: "Personal, moving, towing OK", images: ["https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop"] }) },
  { id: 4, year: 2023, make: "Mercedes-Benz", model: "E-Class", vehicleType: "Luxury", dailyRate: 120, weeklyRate: 720, rating: 4.8, reviewCount: 31, ownerName: "Prestige Auto Rentals", ownerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&facepad=2", memberSince: "2019", ownerType: "Small Business", distance: 3.5, availableNow: true, features: ["Airport Pickup", "Delivery Available"], image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 5, doors: 4, mpg: "25 city / 34 hwy", deposit: 750, mileageLimit: "200 mi/day", deliveryOption: "Yes — $25 within 20 mi", allowedUses: "Personal, business", included: ["Premium insurance included", "Roadside assistance 24/7", "GPS navigation", "Sunroof", "Heated seats"], images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop"] }) },
  { id: 5, year: 2021, make: "Honda", model: "Odyssey", vehicleType: "Van", dailyRate: 65, weeklyRate: 390, rating: 4.6, reviewCount: 54, ownerName: "Sarah M.", ownerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&facepad=2", memberSince: "2021", ownerType: "Individual Owner", distance: 1.9, availableNow: true, features: ["Cash Accepted", "Pet Friendly"], image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 8, doors: 4, mpg: "19 city / 28 hwy", mileageLimit: "200 mi/day", allowedUses: "Personal, family trips", included: ["Liability insurance included", "Roadside assistance 24/7", "2 car seats available", "Rear entertainment system", "Stow & Go seating"], images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=900&h=600&fit=crop"] }) },
  { id: 6, year: 2024, make: "Jeep", model: "Wrangler Sport", vehicleType: "SUV", dailyRate: 85, weeklyRate: 510, rating: 4.4, reviewCount: 29, ownerName: "Trail Rentals Co", ownerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&facepad=2", memberSince: "2023", ownerType: "Small Business", distance: 8.2, availableNow: true, features: ["Cash Accepted", "Pet Friendly", "Long-Term OK"], image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 4, doors: 2, transmission: "Manual", mpg: "17 city / 25 hwy", mileageLimit: "Unlimited", deposit: 400, allowedUses: "Personal, off-road OK", included: ["Liability insurance included", "Roadside assistance 24/7", "Removable top", "All-terrain tires", "Recovery kit"], images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1625231334168-25433bcc8830?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop"] }) },
  { id: 7, year: 2023, make: "Ford", model: "Mustang GT Convertible", vehicleType: "Convertible", dailyRate: 110, weeklyRate: 660, rating: 4.9, reviewCount: 76, ownerName: "Carlos R.", ownerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&facepad=2", memberSince: "2020", ownerType: "Individual Owner", distance: 5.0, availableNow: true, features: ["Cash Accepted"], image: "https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 4, doors: 2, transmission: "Automatic", fuelType: "Gasoline (Premium)", mpg: "15 city / 24 hwy", mileageLimit: "150 mi/day", deposit: 500, allowedUses: "Personal only — no racing", images: ["https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1614162692292-7ac56d7f649e?w=900&h=600&fit=crop"] }) },
  { id: 8, year: 2022, make: "Ram", model: "ProMaster 2500", vehicleType: "Cargo Van", dailyRate: 95, weeklyRate: 570, rating: 4.2, reviewCount: 18, ownerName: "MoveSmart Fleet", ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&facepad=2", memberSince: "2021", ownerType: "Fleet Operator", distance: 7.5, availableNow: false, nextAvailable: "2025-01-12", features: ["Cash Accepted", "Long-Term OK", "Delivery Available"], image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 2, doors: 3, mpg: "15 city / 21 hwy", mileageLimit: "Unlimited", deposit: 350, minRentalDays: 1, deliveryOption: "Yes — free within 20 mi", allowedUses: "Moving, business, personal", images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1530124566582-a45a7e3ff4e8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=900&h=600&fit=crop"] }) },
  { id: 9, year: 2024, make: "BMW", model: "X5 xDrive40i", vehicleType: "Luxury", dailyRate: 135, weeklyRate: 810, rating: 4.7, reviewCount: 22, ownerName: "Apex Luxury", ownerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&facepad=2", memberSince: "2018", ownerType: "Small Business", distance: 4.1, availableNow: true, features: ["Airport Pickup", "Delivery Available"], image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 5, doors: 4, mpg: "21 city / 26 hwy", deposit: 800, deliveryOption: "Yes — $30 within 25 mi", included: ["Premium insurance included", "Roadside assistance 24/7", "GPS navigation", "Panoramic sunroof", "Heated/cooled seats"], images: ["https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop"] }) },
  { id: 10, year: 2020, make: "Chevrolet", model: "Silverado 1500", vehicleType: "Truck", dailyRate: 70, weeklyRate: 420, rating: 4.3, reviewCount: 41, ownerName: "Jake T.", ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&facepad=2", memberSince: "2022", ownerType: "Individual Owner", distance: 11.3, availableNow: true, features: ["Cash Accepted", "Pet Friendly", "Long-Term OK"], image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    detail: sharedDetail({ mpg: "18 city / 24 hwy", mileageLimit: "150 mi/day", deposit: 300, allowedUses: "Personal, moving, towing OK", images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop"] }) },
  { id: 11, year: 2023, make: "Penske", model: "26ft Moving Truck", vehicleType: "Moving Truck", dailyRate: 125, weeklyRate: 700, rating: 4.0, reviewCount: 15, ownerName: "Metro Movers", ownerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&facepad=2", memberSince: "2020", ownerType: "Fleet Operator", distance: 9.7, availableNow: true, features: ["Cash Accepted", "Delivery Available"], image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    detail: sharedDetail({ seats: 3, doors: 2, mpg: "10 city / 14 hwy", mileageLimit: "Unlimited", deposit: 500, minRentalDays: 1, deliveryOption: "Yes — $40 within 30 mi", allowedUses: "Moving only", included: ["Basic liability insurance", "Roadside assistance 24/7", "Moving blankets (10)", "Hand truck / dolly", "Ramp included"], images: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1530124566582-a45a7e3ff4e8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=900&h=600&fit=crop"] }) },
  { id: 12, year: 2024, make: "Hyundai", model: "Ioniq 5", vehicleType: "Electric/Hybrid", dailyRate: 72, weeklyRate: 430, rating: 4.8, reviewCount: 33, ownerName: "GreenWheel", ownerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&facepad=2", memberSince: "2023", ownerType: "Small Business", distance: 3.0, availableNow: true, features: ["Delivery Available", "Airport Pickup", "Long-Term OK"], image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    detail: sharedDetail({ fuelType: "Electric", mpg: "303 mi range", deposit: 400, mileageLimit: "200 mi/day", deliveryOption: "Yes — free within 10 mi", included: ["Full coverage insurance", "Roadside assistance 24/7", "Home charger adapter", "Vehicle-to-Load adapter", "Phone charger cables"], images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop","https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop"] }) },
];