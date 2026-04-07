import { Badge } from "@/components/ui/badge";
import { MapPin, Gauge, Fuel } from "lucide-react";

interface Listing {
  title: string;
  price: string;
  year: number;
  miles: string;
  fuel: string;
  location: string;
  badge?: string;
  image: string;
}

const listings: Listing[] = [
  {
    title: "BMW M4 Competition",
    price: "$72,500",
    year: 2024,
    miles: "3,200 mi",
    fuel: "Gas",
    location: "Los Angeles, CA",
    badge: "Featured",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=260&fit=crop",
  },
  {
    title: "Porsche 911 Carrera",
    price: "$98,900",
    year: 2023,
    miles: "8,400 mi",
    fuel: "Gas",
    location: "Miami, FL",
    badge: "New",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=260&fit=crop",
  },
  {
    title: "Tesla Model 3 LR",
    price: "$38,750",
    year: 2024,
    miles: "1,100 mi",
    fuel: "Electric",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=260&fit=crop",
  },
  {
    title: "Ford Mustang GT",
    price: "$45,200",
    year: 2023,
    miles: "12,600 mi",
    fuel: "Gas",
    location: "Chicago, IL",
    badge: "Price Drop",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5f82d661f?w=400&h=260&fit=crop",
  },
  {
    title: "Mercedes-AMG C63",
    price: "$68,300",
    year: 2024,
    miles: "5,800 mi",
    fuel: "Hybrid",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=260&fit=crop",
  },
];

const FeaturedListings = () => {
  return (
    <section className="py-16">
      <div className="container mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
          Featured <span className="text-primary">Listings</span>
        </h2>
        <p className="text-muted-foreground font-body">Hand-picked vehicles trending this week.</p>
      </div>

      <div className="container overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {listings.map((car) => (
            <div
              key={car.title}
              className="group w-72 shrink-0 rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.08)]"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {car.badge && (
                  <Badge className="absolute top-3 left-3" variant="default">
                    {car.badge}
                  </Badge>
                )}
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">{car.year} {car.title}</h3>
                  <p className="font-heading text-xl font-black text-primary">{car.price}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.miles}</span>
                  <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                  <MapPin className="h-3 w-3" />
                  {car.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;