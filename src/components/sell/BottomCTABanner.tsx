import { Shield, Lock, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: Shield, label: "No fees" },
  { icon: Lock, label: "Private & secure" },
  { icon: Clock, label: "Live in 3 minutes" },
  { icon: Star, label: "Rated 4.8/5 by sellers" },
];

const BottomCTABanner = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <section className="relative w-full py-16 md:py-24 bg-[hsl(0,0%,10%)] overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
        <span className="text-[12rem] md:text-[20rem] font-heading font-bold uppercase text-foreground tracking-widest">
          AW
        </span>
      </div>

      <div className="container relative text-center max-w-xl">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-heading uppercase">
          Ready to Sell?
        </h2>
        <p className="text-muted-foreground mb-8">
          Join thousands of AutoWurx sellers who got a fast, fair deal without the dealership runaround.
        </p>
        <Button
          onClick={scrollToTop}
          className="h-14 px-10 bg-primary text-primary-foreground font-bold text-lg rounded-lg hover:scale-[1.03] transition-transform"
        >
          List My Car Free →
        </Button>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {trustItems.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-muted-foreground text-xs">
              <t.icon className="w-4 h-4 text-primary" />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BottomCTABanner;
