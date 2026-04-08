export interface CashDealListing {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  color: string;
  location: string;
  distance: number;
  askingPrice: number;
  marketAvg: number;
  paymentMethods: ("Cash" | "Venmo" | "CashApp" | "Financing")[];
  dealScore: number;
  condition: "Clean Title" | "Salvage" | "Rebuilt Title";
  image: string;
  sellerName: string;
  sellerRating: number;
  bodyType: "Car" | "Truck" | "SUV" | "Van";
  isBestDeal: boolean;
}

export const cashDealListings: CashDealListing[] = [
  {
    id: 101, year: 2018, make: "Honda", model: "Civic", trim: "LX", mileage: 62000, color: "Silver",
    location: "East Atlanta, GA", distance: 1.8, askingPrice: 8400, marketAvg: 10200,
    paymentMethods: ["Cash", "Venmo", "CashApp"], dealScore: 82, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop",
    sellerName: "Marcus T.", sellerRating: 4.8, bodyType: "Car", isBestDeal: false,
  },
  {
    id: 102, year: 2016, make: "Ford", model: "F-150", trim: "XLT", mileage: 94000, color: "Black",
    location: "Decatur, GA", distance: 4.2, askingPrice: 14500, marketAvg: 16800,
    paymentMethods: ["Cash"], dealScore: 74, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop",
    sellerName: "DeShawn R.", sellerRating: 4.6, bodyType: "Truck", isBestDeal: false,
  },
  {
    id: 103, year: 2015, make: "Toyota", model: "Camry", trim: "SE", mileage: 88000, color: "Blue",
    location: "Stone Mountain, GA", distance: 7.1, askingPrice: 7900, marketAvg: 9400,
    paymentMethods: ["Cash", "CashApp"], dealScore: 79, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&h=400&fit=crop",
    sellerName: "Jessica M.", sellerRating: 4.9, bodyType: "Car", isBestDeal: false,
  },
  {
    id: 104, year: 2019, make: "Kia", model: "Soul", trim: "LX", mileage: 51000, color: "White",
    location: "Marietta, GA", distance: 9.3, askingPrice: 10200, marketAvg: 12500,
    paymentMethods: ["Cash", "Venmo"], dealScore: 88, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop",
    sellerName: "Carlos P.", sellerRating: 4.7, bodyType: "Car", isBestDeal: true,
  },
  {
    id: 105, year: 2014, make: "Chevrolet", model: "Silverado 1500", trim: "", mileage: 118000, color: "Red",
    location: "Norcross, GA", distance: 11.8, askingPrice: 11800, marketAvg: 13200,
    paymentMethods: ["Cash"], dealScore: 68, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    sellerName: "Brian K.", sellerRating: 4.3, bodyType: "Truck", isBestDeal: false,
  },
  {
    id: 106, year: 2017, make: "Nissan", model: "Altima", trim: "S", mileage: 79000, color: "Gray",
    location: "Kennesaw, GA", distance: 14.2, askingPrice: 9100, marketAvg: 10800,
    paymentMethods: ["Cash", "Venmo", "CashApp"], dealScore: 77, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    sellerName: "Anita W.", sellerRating: 4.5, bodyType: "Car", isBestDeal: false,
  },
  {
    id: 107, year: 2020, make: "Toyota", model: "Corolla", trim: "LE", mileage: 38000, color: "White",
    location: "Smyrna, GA", distance: 3.6, askingPrice: 14900, marketAvg: 16200,
    paymentMethods: ["Cash", "CashApp"], dealScore: 71, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    sellerName: "Tyrone L.", sellerRating: 4.8, bodyType: "Car", isBestDeal: false,
  },
  {
    id: 108, year: 2013, make: "Honda", model: "Accord", trim: "EX", mileage: 101000, color: "Charcoal",
    location: "Duluth, GA", distance: 16.4, askingPrice: 6200, marketAvg: 7800,
    paymentMethods: ["Cash", "Venmo"], dealScore: 85, condition: "Clean Title",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop",
    sellerName: "Linda C.", sellerRating: 4.9, bodyType: "Car", isBestDeal: true,
  },
  {
    id: 109, year: 2016, make: "Jeep", model: "Cherokee", trim: "Sport", mileage: 84000, color: "Silver",
    location: "College Park, GA", distance: 12.7, askingPrice: 10500, marketAvg: 12900,
    paymentMethods: ["Cash", "Venmo", "CashApp"], dealScore: 76, condition: "Rebuilt Title",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop",
    sellerName: "Ray J.", sellerRating: 4.4, bodyType: "SUV", isBestDeal: false,
  },
];
