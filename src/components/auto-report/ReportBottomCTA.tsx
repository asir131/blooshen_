import { Shield, Lock, FileText, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: Shield, label: "NMVTIS Approved" },
  { icon: Lock, label: "256-bit Encrypted" },
  { icon: FileText, label: "Gov. Backed Data" },
  { icon: Clock, label: "Instant Results" },
  { icon: DollarSign, label: "Free Basic Reports" },
];

const ReportBottomCTA = () => (
  <section className="relative w-full py-16 md:py-24 bg-background overflow-hidden">
    {/* Watermark */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
      <span className="text-[200px] md:text-[300px] font-heading font-bold text-foreground">A</span>
    </div>

    <div className="container max-w-xl text-center relative z-10">
      <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-3">
        Ready to Run Your Report?
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        It's free, instant, and could save you from a very expensive mistake.
      </p>
      <Button
        size="lg"
        className="px-10 text-base hover:scale-105 transition-transform"
        onClick={() => document.getElementById("vin-input-hero")?.scrollIntoView({ behavior: "smooth" })}
      >
        Check a VIN Now →
      </Button>

      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {trustItems.map((t) => (
          <div key={t.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <t.icon size={14} className="text-primary" />
            {t.label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ReportBottomCTA;
