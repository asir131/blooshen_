import { Car, Wrench, MapPin, KeyRound, Star, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryItem {
  name: string;
  description: string;
  icon: LucideIcon;
  count: number;
  href: string;
}

const categories: CategoryItem[] = [
  { name: "Cars for Sale", description: "Buy and sell new or used vehicles", icon: Car, count: 12480, href: "/cars-for-sale" },
  { name: "Parts & Accessories", description: "OEM, aftermarket, and used parts", icon: Wrench, count: 8340, href: "/parts-accessories" },
  { name: "Service Providers", description: "Local mechanics, shops, and specialists", icon: MapPin, count: 3120, href: "/service-providers" },
  { name: "Rentals", description: "Fast, easy, and cash car rentals near you", icon: KeyRound, count: 1850, href: "/rentals" },
  { name: "Neighborhood Experts, Reviews & Ratings", description: "Local automotive experts and honest reviews", icon: Star, count: 5670, href: "/reviews" },
  { name: "Events & Meetups", description: "Car shows, track days, and cruise nights", icon: CalendarDays, count: 940, href: "/events" },
];

const CategoryGrid = () => {
  return (
    <section className="container py-16">
      <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
        Explore <span className="text-primary">MARKETPLACE</span>
      </h2>
      <p className="text-muted-foreground font-body mb-10">
        Find exactly what you need across our marketplace.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              to={cat.href}
              className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-6 text-left transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{cat.name}</h3>
                <p className="text-sm text-muted-foreground font-body mt-1">{cat.description}</p>
              </div>
              <span className="font-heading text-xs font-bold tracking-wider text-primary">
                {cat.count.toLocaleString()} LISTINGS
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
