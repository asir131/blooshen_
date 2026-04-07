import { Search, Car, Gavel, FileSearch, DollarSign } from "lucide-react";
import autowurxLogo from "@/assets/autowurx-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

const categories = [
  "All Categories",
  "Cars for Sale",
  "Parts & Accessories",
  "Service Providers",
  "Rentals",
  "Reviews & Ratings",
  "Events & Meetups",
];

const shortcuts = [
  { label: "Sell Your Car", icon: Car, href: "/sell" },
  { label: "Auctions", icon: Gavel, href: "/auctions" },
  { label: "Auto Report", icon: FileSearch, href: "/auto-report" },
  { label: "Ca$h Deals", icon: DollarSign, href: "/cash-deals" },
];

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center py-24 md:py-36 text-center">
        {/* Logo */}
        <img src={autowurxLogo} alt="Autowurx" className="h-12 md:h-16 mb-4" />

        {/* Tagline */}
        <p className="font-heading text-lg md:text-2xl tracking-[0.2em] text-muted-foreground mb-10">
          DRIVING TRAFFIC FORWARD
        </p>

        {/* Search bar with category */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row gap-2 mb-6">
          <select className="h-12 rounded-md border border-input bg-secondary px-3 text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring sm:w-48 shrink-0">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search make, model, part, or service..." className="pl-10 h-12" />
          </div>
        </div>

        <Button size="lg" className="text-base mb-8" asChild>
          <Link to="/cars-for-sale">Browse All Listings</Link>
        </Button>

        {/* Quick Shortcut Tiles */}
        <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-lg justify-center">
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                to={s.href}
                className="group flex flex-col items-center justify-center gap-1.5 w-[90px] h-[72px] shrink-0 rounded-xl border border-border/50 bg-background/40 backdrop-blur-sm transition-all duration-200 hover:border-cta hover:bg-background/60 hover:scale-105"
              >
                <Icon className="h-6 w-6 text-foreground transition-colors group-hover:text-cta" />
                <span className="text-[11px] font-heading font-bold text-foreground leading-tight text-center">
                  {s.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
