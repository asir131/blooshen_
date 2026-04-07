export interface ServiceProvider {
  id: number;
  name: string;
  serviceTypes: string[];
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  certifications: string[];
  openNow: boolean;
  image: string;
  distance: number; // miles from search center
}

export const mockProviders: ServiceProvider[] = [
  { id: 1, name: "Precision Auto Works", serviceTypes: ["General Repair", "Custom/Performance"], rating: 4.8, reviewCount: 312, address: "1420 S Main St, Los Angeles, CA 90015", phone: "(213) 555-0147", certifications: ["ASE Certified"], openNow: true, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", distance: 2.3 },
  { id: 2, name: "Eagle Transmission & Auto", serviceTypes: ["Transmission", "General Repair"], rating: 4.5, reviewCount: 187, address: "8700 Preston Rd, Dallas, TX 75225", phone: "(214) 555-0233", certifications: ["ASE Certified", "AAA Approved"], openNow: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop", distance: 5.1 },
  { id: 3, name: "Maaco Collision Repair", serviceTypes: ["Body Shop"], rating: 4.1, reviewCount: 89, address: "3300 NW 79th Ave, Miami, FL 33122", phone: "(305) 555-0391", certifications: [], openNow: false, image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop", distance: 8.7 },
  { id: 4, name: "Quick Tag & Title Services", serviceTypes: ["Tag & Title"], rating: 4.3, reviewCount: 256, address: "550 W Adams Blvd, Chicago, IL 60661", phone: "(312) 555-0412", certifications: [], openNow: true, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0645?w=600&h=400&fit=crop", distance: 1.2 },
  { id: 5, name: "Diamond Detail Studio", serviceTypes: ["Detailing"], rating: 4.9, reviewCount: 445, address: "2100 E Camelback Rd, Scottsdale, AZ 85016", phone: "(480) 555-0558", certifications: [], openNow: true, image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop", distance: 3.5 },
  { id: 6, name: "Discount Tire & Brake", serviceTypes: ["Tires", "Oil Change"], rating: 4.2, reviewCount: 178, address: "900 Broadway, Denver, CO 80203", phone: "(720) 555-0623", certifications: ["ASE Certified"], openNow: false, image: "https://images.unsplash.com/photo-1611859266785-925b86093938?w=600&h=400&fit=crop", distance: 6.4 },
  { id: 7, name: "Turbo Performance Garage", serviceTypes: ["Custom/Performance", "General Repair"], rating: 4.7, reviewCount: 201, address: "4455 NE Sandy Blvd, Portland, OR 97213", phone: "(503) 555-0789", certifications: ["ASE Certified"], openNow: true, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop", distance: 4.0 },
  { id: 8, name: "AAA Towing & Recovery", serviceTypes: ["Towing"], rating: 4.0, reviewCount: 134, address: "7700 Airline Dr, Houston, TX 77037", phone: "(713) 555-0845", certifications: ["AAA Approved"], openNow: true, image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop", distance: 12.1 },
  { id: 9, name: "Mike's Mobile Mechanic", serviceTypes: ["Mobile Mechanic", "Oil Change"], rating: 4.6, reviewCount: 92, address: "Serves Greater Austin, TX", phone: "(512) 555-0912", certifications: ["ASE Certified"], openNow: true, image: "https://images.unsplash.com/photo-1530124566582-a45a7e3ff4e8?w=600&h=400&fit=crop", distance: 0 },
  { id: 10, name: "Bay Area Body & Paint", serviceTypes: ["Body Shop", "Detailing"], rating: 4.4, reviewCount: 167, address: "1200 Harrison St, San Francisco, CA 94103", phone: "(415) 555-1023", certifications: ["ASE Certified", "AAA Approved"], openNow: false, image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop", distance: 7.8 },
  { id: 11, name: "Jiffy Lube Express", serviceTypes: ["Oil Change", "General Repair"], rating: 3.8, reviewCount: 340, address: "2200 SE Hawthorne Blvd, Portland, OR 97214", phone: "(503) 555-1134", certifications: [], openNow: true, image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop", distance: 3.2 },
  { id: 12, name: "Summit Tire & Alignment", serviceTypes: ["Tires", "General Repair"], rating: 4.3, reviewCount: 221, address: "6600 E Colfax Ave, Denver, CO 80220", phone: "(720) 555-1245", certifications: ["ASE Certified"], openNow: true, image: "https://images.unsplash.com/photo-1625231334168-25433bcc8830?w=600&h=400&fit=crop", distance: 9.5 },
];