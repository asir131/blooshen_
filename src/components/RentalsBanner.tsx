import { ShieldCheck, Banknote, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import rentalsBg from "@/assets/rentals-bg.jpg";

const benefits = [
  { icon: ShieldCheck, label: "No Hidden Fees" },
  { icon: Banknote, label: "Cash-Friendly" },
  { icon: MapPin, label: "Vehicles Near You" },
];

const RentalsBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={rentalsBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
      </div>

      <div className="container relative z-10 py-16 md:py-20">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Rent Local. <span className="text-primary">Skip the Counter.</span>
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            Peer-to-peer car rentals from real people in your neighborhood. No corporate hassle.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-heading text-sm font-bold tracking-wider text-foreground">
                    {b.label}
                  </span>
                </div>
              );
            })}
          </div>

          <Button size="lg" asChild>
            <Link to="/rentals">Browse Rentals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RentalsBanner;
