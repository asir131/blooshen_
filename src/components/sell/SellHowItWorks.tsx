import { FileEdit, BellDot, Handshake } from "lucide-react";

const steps = [
  {
    num: 1,
    title: "List in Minutes",
    icon: FileEdit,
    desc: "Enter your VIN or license plate, add mileage and a few photos. Your listing goes live instantly — no waiting, no approval queue.",
  },
  {
    num: 2,
    title: "Get Real Offers",
    icon: BellDot,
    desc: "Serious buyers and local dealers see your listing and send you real cash offers — not vague estimates. Compare them side by side in your dashboard.",
  },
  {
    num: 3,
    title: "Pick, Meet, Get Paid",
    icon: Handshake,
    desc: "Choose the offer that works for you, schedule a meetup or pickup at your convenience, and get paid on your terms — cash, Venmo, or bank transfer.",
  },
];

const SellHowItWorks = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,10%)]">
    <div className="container max-w-[900px] text-center">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2 block">
        How It Works
      </span>
      <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 font-heading uppercase">
        Car to Cash in 3 Simple Steps
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-0 items-start">
        {steps.map((s, i) => (
          <div key={s.num} className="relative flex flex-col items-center">
            {/* Connector line (desktop only, between cards) */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] border-t-2 border-dashed border-primary/40" />
            )}
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4 z-10">
              {s.num}
            </div>
            <div className="bg-card rounded-xl p-5 w-full max-w-[260px]">
              <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-foreground font-bold text-base mb-2 font-heading uppercase">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Phone mockup */}
      <div className="mt-12 mx-auto max-w-[200px] motion-safe:animate-float">
        <svg viewBox="0 0 200 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <rect x="10" y="10" width="180" height="340" rx="24" fill="hsl(0,0%,14%)" stroke="hsl(0,0%,24%)" strokeWidth="2"/>
          <rect x="60" y="18" width="80" height="6" rx="3" fill="hsl(0,0%,20%)"/>
          {/* Offer cards */}
          {[0,1,2].map((i) => (
            <g key={i} transform={`translate(24, ${60 + i * 90})`}>
              <rect width="152" height="72" rx="8" fill="hsl(0,0%,18%)" stroke="hsl(50,100%,50%)" strokeWidth="1" opacity={1 - i * 0.15}/>
              <rect x="12" y="12" width="40" height="6" rx="3" fill="hsl(50,100%,50%)"/>
              <rect x="12" y="24" width="80" height="5" rx="2.5" fill="hsl(0,0%,40%)"/>
              <rect x="12" y="35" width="60" height="5" rx="2.5" fill="hsl(0,0%,30%)"/>
              <rect x="90" y="48" width="50" height="16" rx="4" fill="hsl(50,100%,50%)"/>
              <text x="115" y="60" textAnchor="middle" fontSize="8" fontWeight="bold" fill="hsl(0,0%,7%)">View</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  </section>
);

export default SellHowItWorks;
