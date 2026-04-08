import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, FileText } from "lucide-react";

const CashDealHero = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-[hsl(var(--background))] overflow-hidden py-16 md:py-24">
      {/* Diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            hsl(var(--foreground)) 10px,
            hsl(var(--foreground)) 11px
          )`,
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <p className="font-heading text-xs uppercase tracking-[0.3em] text-primary mb-4">
          No Credit. No Banks. No Drama.
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-black text-foreground leading-[1.1] mb-6">
          Ca$h Deals.<br />Your Money.<br />Your Rules.
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-[540px] mx-auto mb-8 leading-relaxed">
          Find vehicles from sellers who accept cash, Venmo, and CashApp — verified listings,
          real prices, zero financing hoops. Plus: everything you need to know to buy smart,
          inspect right, and close safe.
        </p>
        <div className="flex items-center justify-center gap-3 mb-8">
          <Button size="lg" onClick={() => scrollTo("browse-section")}>
            Browse Ca$h Deals ↓
          </Button>
          <Button size="lg" variant="outline" onClick={() => scrollTo("guide-section")}>
            Learn to Buy Smart ↓
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: CheckCircle, text: "Seller accepts cash verified" },
            { icon: Shield, text: "No credit check required" },
            { icon: FileText, text: "Paperwork guides included" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[11px] text-muted-foreground">
              <b.icon className="h-3.5 w-3.5 text-primary" />
              {b.text}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {[
            { value: "847", label: "Active cash listings" },
            { value: "$4,200", label: "Avg. below market price" },
            { value: "2.1 days", label: "Avg. time to close" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-2xl md:text-3xl font-black text-primary">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CashDealHero;
