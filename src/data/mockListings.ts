export interface CarListing {
  id: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  mileage: number;
  location: string;
  bodyStyle: string;
  condition: "New" | "Used" | "Certified";
  image: string;
  // Detail fields
  images?: string[];
  engine?: string;
  transmission?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  description?: string;
  datePosted?: string;
  seller?: {
    name: string;
    avatar: string;
    memberSince: string;
    phone: string;
    email: string;
  };
}

export const mockListings: CarListing[] = [
  {
    id: 1, year: 2024, make: "BMW", model: "M4", trim: "Competition xDrive", price: 72500, mileage: 3200, location: "Los Angeles, CA", bodyStyle: "Coupe", condition: "New",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop",
    ],
    engine: "3.0L Twin-Turbo I6", transmission: "8-Speed Automatic", exteriorColor: "Isle of Man Green", interiorColor: "Black Merino Leather", vin: "WBS43AZ09R8B12345", datePosted: "2024-12-15",
    description: "Stunning 2024 BMW M4 Competition xDrive in Isle of Man Green Metallic. This vehicle features the Competition package with 503 hp, carbon fiber roof, M Carbon bucket seats, and the full M Driver's Package. Only 3,200 miles — essentially brand new. Clean title, single owner, garaged.",
    seller: { name: "West Coast Motors", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&facepad=2", memberSince: "2019", phone: "(310) 555-0142", email: "sales@westcoastmotors.com" },
  },
  {
    id: 2, year: 2023, make: "Porsche", model: "911", trim: "Carrera S", price: 98900, mileage: 8400, location: "Miami, FL", bodyStyle: "Coupe", condition: "Used",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f649e?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611859266785-925b86093938?w=900&h=600&fit=crop",
    ],
    engine: "3.0L Twin-Turbo H6", transmission: "7-Speed PDK", exteriorColor: "Guards Red", interiorColor: "Black Leather", vin: "WP0AB2A98PS210987", datePosted: "2024-11-28",
    description: "Beautiful 2023 Porsche 911 Carrera S with Sport Chrono Package. Equipped with PASM sport suspension, sport exhaust, and 20/21\" RS Spyder wheels. Full Porsche service history, CPO eligible. No accidents.",
    seller: { name: "Miami Exotics", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&facepad=2", memberSince: "2020", phone: "(305) 555-0198", email: "info@miamiexotics.com" },
  },
  {
    id: 3, year: 2024, make: "Tesla", model: "Model 3", trim: "Long Range AWD", price: 38750, mileage: 1100, location: "Austin, TX", bodyStyle: "Sedan", condition: "New",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=900&h=600&fit=crop",
    ],
    engine: "Dual Motor Electric", transmission: "Single-Speed", exteriorColor: "Pearl White", interiorColor: "White Vegan Leather", vin: "5YJ3E1EA4RF123456", datePosted: "2024-12-20",
    description: "2024 Tesla Model 3 Long Range with Full Self-Driving capability. Includes 18\" Aero Wheels, premium interior, glass roof. Only 1,100 miles. Home charging setup available for additional cost.",
    seller: { name: "Jake Morrison", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=2", memberSince: "2022", phone: "(512) 555-0077", email: "jake.m@email.com" },
  },
  {
    id: 4, year: 2023, make: "Ford", model: "Mustang", trim: "GT Premium", price: 45200, mileage: 12600, location: "Chicago, IL", bodyStyle: "Coupe", condition: "Used",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop",
    ],
    engine: "5.0L V8", transmission: "6-Speed Manual", exteriorColor: "Grabber Blue", interiorColor: "Ebony Leather", vin: "1FA6P8CF5P5100234", datePosted: "2024-12-01",
    description: "2023 Ford Mustang GT Premium with the 5.0L Coyote V8 and 6-speed manual — the purist's choice. Active exhaust, MagneRide suspension, 401A equipment group. Clean Carfax, no modifications.",
    seller: { name: "Windy City Autos", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&facepad=2", memberSince: "2018", phone: "(312) 555-0265", email: "sales@windycityautos.com" },
  },
  {
    id: 5, year: 2024, make: "Mercedes-Benz", model: "AMG C63", trim: "S E Performance", price: 68300, mileage: 5800, location: "New York, NY", bodyStyle: "Sedan", condition: "Certified",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop",
    ],
    engine: "2.0L Turbo I4 + Electric", transmission: "9-Speed AMG Speedshift", exteriorColor: "Obsidian Black", interiorColor: "Red Pepper / Black Nappa", vin: "W1KZF8DB4RA045678", datePosted: "2024-12-10",
    description: "Certified Pre-Owned 2024 Mercedes-AMG C63 S E Performance with 671 combined hp. AMG Performance exhaust, carbon fiber trim, Burmester sound, AMG Night Package. Factory warranty until 2029.",
    seller: { name: "Manhattan Motors", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&facepad=2", memberSince: "2017", phone: "(212) 555-0333", email: "info@manhattanmotors.com" },
  },
  {
    id: 6, year: 2022, make: "Toyota", model: "4Runner", trim: "TRD Pro", price: 42800, mileage: 18500, location: "Denver, CO", bodyStyle: "SUV", condition: "Used",
    image: "https://images.unsplash.com/photo-1625231334168-25433bcc8830?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1625231334168-25433bcc8830?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop",
    ],
    engine: "4.0L V6", transmission: "5-Speed Automatic", exteriorColor: "Lime Rush", interiorColor: "Black SofTex", vin: "JTEBU5JR8N5123456", datePosted: "2024-11-20",
    description: "2022 Toyota 4Runner TRD Pro in Lime Rush — the iconic trail-ready SUV. Equipped with KDSS, crawl control, multi-terrain select, TRD Pro skid plate, and Fox internal bypass shocks. Perfect Colorado rig.",
    seller: { name: "Mile High Trucks", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&facepad=2", memberSince: "2021", phone: "(720) 555-0189", email: "info@milehightrucks.com" },
  },
  {
    id: 7, year: 2024, make: "Chevrolet", model: "Corvette", trim: "Z06 3LZ", price: 115000, mileage: 900, location: "Scottsdale, AZ", bodyStyle: "Coupe", condition: "New",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop",
    ],
    engine: "5.5L Flat-Plane V8", transmission: "8-Speed DCT", exteriorColor: "Torch Red", interiorColor: "Adrenaline Red", vin: "1G1YK2D41R5100567", datePosted: "2024-12-22",
    description: "Brand new 2024 Corvette Z06 with the flat-plane crank 5.5L V8 producing 670 hp. 3LZ package with competition seats, visible carbon fiber, Z07 performance package, carbon ceramic brakes. Museum delivery available.",
    seller: { name: "Desert Performance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&facepad=2", memberSince: "2016", phone: "(480) 555-0421", email: "sales@desertperformance.com" },
  },
  {
    id: 8, year: 2023, make: "Jeep", model: "Wrangler", trim: "Rubicon 392", price: 52400, mileage: 9200, location: "Portland, OR", bodyStyle: "SUV", condition: "Used",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1625231334168-25433bcc8830?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop",
    ],
    engine: "6.4L HEMI V8", transmission: "8-Speed Automatic", exteriorColor: "Sarge Green", interiorColor: "Black Cloth", vin: "1C4HJXFG9PW456789", datePosted: "2024-11-30",
    description: "2023 Jeep Wrangler Rubicon 392 — the V8-powered off-road beast. 470 hp, Dana 44 axles, electronic sway bar disconnect, 37\" mud-terrain tires. Includes half doors, Sky One-Touch power top.",
    seller: { name: "Pacific NW Off-Road", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&facepad=2", memberSince: "2020", phone: "(503) 555-0312", email: "pnw@offroad.com" },
  },
  {
    id: 9, year: 2021, make: "Ram", model: "1500", trim: "Laramie Longhorn", price: 38900, mileage: 32000, location: "Dallas, TX", bodyStyle: "Truck", condition: "Used",
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop",
    ],
    engine: "5.7L HEMI V8", transmission: "8-Speed Automatic", exteriorColor: "Granite Crystal", interiorColor: "Mountain Brown / Light Frost", vin: "1C6SRFJT8MN654321", datePosted: "2024-10-15",
    description: "2021 Ram 1500 Laramie Longhorn with the luxury-grade western-inspired interior. Crew cab, 4x4, 12\" Uconnect touchscreen, air suspension, panoramic sunroof. Towing package rated at 12,750 lbs.",
    seller: { name: "Lone Star Trucks", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&facepad=2", memberSince: "2018", phone: "(214) 555-0087", email: "info@lonestartrucks.com" },
  },
  {
    id: 10, year: 2024, make: "Audi", model: "RS5", trim: "Sportback", price: 78500, mileage: 2100, location: "San Francisco, CA", bodyStyle: "Sedan", condition: "New",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=900&h=600&fit=crop",
    ],
    engine: "2.9L Twin-Turbo V6", transmission: "8-Speed Tiptronic", exteriorColor: "Nardo Gray", interiorColor: "Black Valcona Leather", vin: "WUABWCF59RA012345", datePosted: "2024-12-18",
    description: "2024 Audi RS5 Sportback in exclusive Nardo Gray. RS sport exhaust, Dynamic Plus package, carbon optic package, Bang & Olufsen 3D sound. Quattro AWD with sport differential. Factory warranty included.",
    seller: { name: "Bay Area Audi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&facepad=2", memberSince: "2019", phone: "(415) 555-0199", email: "sales@bayareaaudi.com" },
  },
  {
    id: 11, year: 2023, make: "Mazda", model: "MX-5 Miata", trim: "Grand Touring", price: 33200, mileage: 7600, location: "San Diego, CA", bodyStyle: "Convertible", condition: "Used",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f649e?w=900&h=600&fit=crop",
    ],
    engine: "2.0L Skyactiv-G I4", transmission: "6-Speed Manual", exteriorColor: "Soul Red Crystal", interiorColor: "Tan Nappa Leather", vin: "JM1NDAD71P0234567", datePosted: "2024-12-05",
    description: "2023 Mazda MX-5 Miata Grand Touring in Soul Red Crystal. The ultimate driver's car with Bilstein dampers, Brembo brakes, BBS forged wheels, and the glorious 6-speed manual. Heated leather seats, Bose audio.",
    seller: { name: "SoCal Roadsters", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&facepad=2", memberSince: "2021", phone: "(619) 555-0445", email: "info@socalroadsters.com" },
  },
  {
    id: 12, year: 2022, make: "Honda", model: "Odyssey", trim: "Elite", price: 41500, mileage: 21000, location: "Seattle, WA", bodyStyle: "Van", condition: "Certified",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=900&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=900&h=600&fit=crop",
    ],
    engine: "3.5L V6", transmission: "10-Speed Automatic", exteriorColor: "Platinum White Pearl", interiorColor: "Gray Leather", vin: "5FNRL6H98NB012345", datePosted: "2024-11-10",
    description: "Certified Pre-Owned 2022 Honda Odyssey Elite — the family hauler that does it all. Rear entertainment system, CabinWatch, CabinTalk, wireless charging, HondaVAC built-in vacuum. Honda Sensing suite included.",
    seller: { name: "Northwest Honda", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&facepad=2", memberSince: "2015", phone: "(206) 555-0276", email: "sales@nwhonda.com" },
  },
];