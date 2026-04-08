import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SellerCTA = () => (
  <section className="bg-primary py-12 md:py-16">
    <div className="max-w-3xl mx-auto px-4 text-center">
      <h2 className="font-heading text-xl md:text-2xl font-black text-primary-foreground mb-2">
        Selling Your Vehicle for Cash?
      </h2>
      <p className="text-xs text-primary-foreground/80 mb-8 max-w-lg mx-auto">
        List your cash-friendly vehicle on AutoWurx for free. Reach buyers who are ready to pay today —
        no financing delays, no bank approvals, no waiting.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
        {[
          { value: "$0", label: "To list your cash deal" },
          { value: "847", label: "Active cash buyers near you" },
          { value: "2.1 days", label: "Avg. time to close" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-2xl font-black text-primary-foreground">{s.value}</p>
            <p className="text-[10px] text-primary-foreground/70">{s.label}</p>
          </div>
        ))}
      </div>
      <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
        <Link to="/sell?type=cash">Post My Ca$h Deal →</Link>
      </Button>
    </div>
  </section>
);

export default SellerCTA;
