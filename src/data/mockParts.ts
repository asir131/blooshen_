export interface PartListing {
  id: number;
  name: string;
  category: string;
  compatibleVehicles: string[];
  condition: "New" | "Used" | "Refurbished" | "OEM" | "Aftermarket";
  price: number;
  sellerName: string;
  sellerType: "Individual" | "Shop" | "Dealer";
  location: string;
  image: string;
}

export const mockParts: PartListing[] = [
  { id: 1, name: 'K&N Cold Air Intake Kit', category: "Engine", compatibleVehicles: ["2018-2024 Ford Mustang GT"], condition: "New", price: 349, sellerName: "SpeedParts USA", sellerType: "Shop", location: "Houston, TX", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop" },
  { id: 2, name: 'Brembo GT Big Brake Kit (Front)', category: "Brakes", compatibleVehicles: ["2015-2023 BMW M3/M4"], condition: "New", price: 2850, sellerName: "Euro Performance", sellerType: "Dealer", location: "Los Angeles, CA", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop" },
  { id: 3, name: 'KW V3 Coilover Kit', category: "Suspension", compatibleVehicles: ["2019-2024 Porsche 911 (992)"], condition: "New", price: 3200, sellerName: "Track Ready Parts", sellerType: "Shop", location: "Atlanta, GA", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop" },
  { id: 4, name: 'OEM Tail Light Assembly (Left)', category: "Electrical", compatibleVehicles: ["2020-2023 Tesla Model 3"], condition: "OEM", price: 425, sellerName: "Tesla Parts Direct", sellerType: "Dealer", location: "Fremont, CA", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop" },
  { id: 5, name: 'Carbon Fiber Front Lip Splitter', category: "Body/Exterior", compatibleVehicles: ["2022-2024 Chevrolet Corvette C8"], condition: "New", price: 899, sellerName: "Mike\'s Garage", sellerType: "Individual", location: "Phoenix, AZ", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop" },
  { id: 6, name: 'Recaro Sportster CS Seat (Pair)', category: "Interior", compatibleVehicles: ["Universal Fit"], condition: "Refurbished", price: 1800, sellerName: "Interior Specialists", sellerType: "Shop", location: "Dallas, TX", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=600&h=400&fit=crop" },
  { id: 7, name: 'BBS RS-GT 19" Forged Wheels (Set)', category: "Wheels/Tires", compatibleVehicles: ["2018-2024 Audi RS5", "2019-2024 BMW M4"], condition: "Used", price: 2400, sellerName: "WheelSwap", sellerType: "Individual", location: "Portland, OR", image: "https://images.unsplash.com/photo-1611859266785-925b86093938?w=600&h=400&fit=crop" },
  { id: 8, name: 'Snap-On 450pc Master Tool Set', category: "Tools", compatibleVehicles: ["Universal"], condition: "New", price: 5999, sellerName: "Pro Tool Supply", sellerType: "Shop", location: "Chicago, IL", image: "https://images.unsplash.com/photo-1530124566582-a45a7e3ff4e8?w=600&h=400&fit=crop" },
  { id: 9, name: 'Borla ATAK Cat-Back Exhaust', category: "Engine", compatibleVehicles: ["2021-2024 Ford Mustang Mach 1"], condition: "New", price: 1650, sellerName: "Exhaust Authority", sellerType: "Shop", location: "Nashville, TN", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop" },
  { id: 10, name: 'Used OEM Front Bumper Cover', category: "Body/Exterior", compatibleVehicles: ["2018-2021 Mercedes C63 AMG"], condition: "Used", price: 550, sellerName: "Sal\'s Salvage", sellerType: "Individual", location: "Newark, NJ", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop" },
  { id: 11, name: 'Bilstein B8 5100 Shock Set', category: "Suspension", compatibleVehicles: ["2014-2024 Toyota 4Runner"], condition: "New", price: 720, sellerName: "Off-Road Warehouse", sellerType: "Dealer", location: "Denver, CO", image: "https://images.unsplash.com/photo-1625231334168-25433bcc8830?w=600&h=400&fit=crop" },
  { id: 12, name: 'Morimoto XB LED Headlights (Pair)', category: "Electrical", compatibleVehicles: ["2009-2018 Ram 1500"], condition: "Aftermarket", price: 1100, sellerName: "LightWorks Auto", sellerType: "Shop", location: "Miami, FL", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop" },
];