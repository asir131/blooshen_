import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  text: string;
  included: boolean;
}

interface Tier {
  name: string;
  badge?: string;
  price: string;
  label: string;
  features: Feature[];
  cta: string;
  popular?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Basic Report",
    price: "$0",
    label: "Free Forever",
    cta: "Run Free Report",
    features: [
      { text: "Title status check", included: true },
      { text: "Theft & fraud flag", included: true },
      { text: "Salvage & junk history", included: true },
      { text: "Number of previous owners", included: true },
      { text: "NMVTIS government data", included: true },
      { text: "Odometer history detail", included: false },
      { text: "Accident detail", included: false },
      { text: "Price & listing history", included: false },
      { text: "PDF download", included: false },
    ],
  },
  {
    name: "Full Report",
    badge: "MOST POPULAR",
    price: "$9.99",
    label: "One-Time Purchase",
    cta: "Get Full Report",
    popular: true,
    features: [
      { text: "Everything in Basic", included: true },
      { text: "Full odometer history table", included: true },
      { text: "Accident & damage detail", included: true },
      { text: "AutoWurx price & listing history", included: true },
      { text: "Historical seller photos", included: true },
      { text: "PDF report download", included: true },
      { text: "Share link for mechanic/buyer", included: true },
    ],
  },
  {
    name: "Unlimited Monthly",
    price: "$19.99",
    label: "Per Month — Cancel Anytime",
    cta: "Start Unlimited",
    features: [
      { text: "Everything in Full Report", included: true },
      { text: "Unlimited VIN lookups", included: true },
      { text: "Batch VIN checking (up to 50)", included: true },
      { text: "Priority report generation", included: true },
      { text: "Dealer & fleet use OK", included: true },
    ],
  },
];

const PricingTiers = () => (
  <section className="w-full py-16 md:py-20 bg-background">
    <div className="container max-w-[800px]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary text-center mb-2">
        Report Options
      </p>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
        Choose Your Level of Detail
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />

      <div className="flex flex-col md:flex-row gap-5 items-stretch">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex-1 bg-card rounded-[14px] p-7 flex flex-col relative ${
              tier.popular
                ? "md:-mt-2 md:mb-0 shadow-[0_0_0_2px_hsl(50,100%,50%)] order-first md:order-none"
                : "border border-border"
            }`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {tier.badge}
              </span>
            )}
            <h3 className="text-base font-bold text-foreground text-center mb-2 normal-case mt-2">
              {tier.name}
            </h3>
            <div className={`text-3xl font-bold text-center mb-1 ${tier.popular ? "text-primary" : "text-foreground"}`}>
              {tier.price}
            </div>
            <p className="text-xs text-muted-foreground text-center mb-5">{tier.label}</p>

            <ul className="space-y-2 mb-6 flex-1">
              {tier.features.map((f) => (
                <li key={f.text} className={`flex items-center gap-2 text-xs ${f.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {f.included ? (
                    <Check size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <Lock size={14} className="shrink-0" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>

            <Button
              variant={tier.popular ? "default" : "outline"}
              className="w-full"
              onClick={() => document.getElementById("vin-input-hero")?.scrollIntoView({ behavior: "smooth" })}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingTiers;
