import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: 1,
    title: "Find It.",
    description:
      "Browse thousands of new and used vehicles at your own pace. Filter by make, model, price, and location to uncover the exact ride you've been looking for — no pressure, no pushy salespeople, just the right options laid out clearly for you.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="20" width="28" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="34" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="30" cy="34" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 20l4-8h14l4 8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="38" cy="14" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="M43 19l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: 2,
    title: "Buy It.",
    description:
      "Connect with trusted sellers and neighborhood experts who know their stuff. Dig into detailed specs, compare financing options, and get straight answers — so you can make a confident decision on your terms, on your timeline.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M10 38V14a2 2 0 012-2h24a2 2 0 012 2v24" stroke="currentColor" strokeWidth="2" />
        <path d="M14 22h20M14 28h20M14 34h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 30l4 4 8-8" stroke="hsl(var(--cta))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: 3,
    title: "Drive It.",
    description:
      "The keys are yours — now make the most of them. Discover maintenance tips, performance upgrades, and a community of enthusiasts who are just as obsessed with their vehicles as you are.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="4" fill="currentColor" />
        <path d="M24 8v6M24 34v6M8 24h6M34 24h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* Mechanic character 1 - left side, leaning with wrench */
const MechanicLeft = () => (
  <svg
    viewBox="0 0 200 400"
    className="absolute left-0 bottom-0 h-[80%] w-auto opacity-[0.07] md:opacity-[0.15] animate-float pointer-events-none select-none"
    fill="none"
  >
    {/* Body */}
    <circle cx="100" cy="60" r="30" fill="hsl(var(--cta))" opacity="0.6" />
    <rect x="75" y="90" width="50" height="120" rx="10" fill="hsl(var(--cta))" opacity="0.4" />
    {/* Legs */}
    <rect x="78" y="200" width="18" height="100" rx="8" fill="hsl(var(--cta))" opacity="0.3" />
    <rect x="104" y="200" width="18" height="100" rx="8" fill="hsl(var(--cta))" opacity="0.3" />
    {/* Arm with wrench */}
    <rect x="125" y="100" width="50" height="14" rx="7" fill="hsl(var(--cta))" opacity="0.5" transform="rotate(-30 125 100)" />
    <rect x="155" y="70" width="8" height="30" rx="4" fill="hsl(var(--cta))" opacity="0.6" transform="rotate(-30 155 70)" />
  </svg>
);

/* Mechanic character 2 - right side, thumbs up */
const MechanicRight = () => (
  <svg
    viewBox="0 0 200 400"
    className="absolute right-0 bottom-0 h-[80%] w-auto opacity-[0.07] md:opacity-[0.15] animate-float-delayed pointer-events-none select-none"
    fill="none"
  >
    {/* Cap */}
    <rect x="75" y="30" width="55" height="12" rx="4" fill="hsl(var(--cta))" opacity="0.5" />
    {/* Head */}
    <circle cx="100" cy="60" r="28" fill="hsl(var(--cta))" opacity="0.6" />
    {/* Body */}
    <rect x="78" y="88" width="44" height="115" rx="10" fill="hsl(var(--cta))" opacity="0.4" />
    {/* Legs */}
    <rect x="80" y="195" width="16" height="105" rx="8" fill="hsl(var(--cta))" opacity="0.3" />
    <rect x="104" y="195" width="16" height="105" rx="8" fill="hsl(var(--cta))" opacity="0.3" />
    {/* Arm pointing / thumbs up */}
    <rect x="30" y="105" width="48" height="12" rx="6" fill="hsl(var(--cta))" opacity="0.5" />
    <rect x="20" y="85" width="10" height="24" rx="5" fill="hsl(var(--cta))" opacity="0.6" />
  </svg>
);

const HowItWorks = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
      <MechanicLeft />
      <MechanicRight />

      <div className="container relative z-10 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            How <span className="text-cta">AutoWurx</span> Works
          </h2>
          <div className="w-16 h-0.5 bg-cta mx-auto mb-4" />
          <p className="text-muted-foreground font-body text-base md:text-lg">
            Your journey from search to ownership, made simple.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-0 max-w-4xl mx-auto mb-12">
          {steps.map((step, i) => (
            <div key={step.num} className="flex flex-col md:flex-row items-center flex-1">
              {/* Step card */}
              <div className="flex flex-col items-center text-center px-4 md:px-6">
                {/* Number badge */}
                <div className="w-10 h-10 rounded-full bg-cta flex items-center justify-center text-cta-foreground font-heading font-black text-lg mb-4">
                  {step.num}
                </div>
                {/* Icon */}
                <div className="text-foreground mb-3">{step.icon}</div>
                {/* Title */}
                <h3 className="font-heading text-xl font-black text-foreground mb-2">
                  {step.title}
                </h3>
                {/* Description */}
                <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
              {/* Connector arrow (desktop only, not after last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center px-2 text-border shrink-0">
                  <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                    <path d="M0 6h28m0 0l-5-5m5 5l-5 5" stroke="hsl(var(--border))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-cta text-cta-foreground hover:bg-cta/90 text-base font-bold px-10 py-6 rounded-lg transition-transform hover:scale-105"
            asChild
          >
            <Link to="/find-my-broker">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
