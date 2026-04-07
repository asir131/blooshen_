import {
  CarFront, FileCheck, Gauge, ShieldAlert,
  Recycle, Droplets, AlertTriangle, TrendingUp,
} from "lucide-react";

const features = [
  { icon: CarFront, title: "Accident History", desc: "See reported collision events, damage disclosures, and insurance claim records that could affect the car's value and safety." },
  { icon: FileCheck, title: "Title & Ownership Records", desc: "Full chain of ownership, title issue dates, number of previous owners, and any title transfer anomalies." },
  { icon: Gauge, title: "Odometer Verification", desc: "Catch odometer rollbacks before they catch you. We cross-reference mileage records across every reported title transaction." },
  { icon: ShieldAlert, title: "Theft & Fraud Check", desc: "Instantly check if a vehicle has been reported stolen, has a replaced VIN, or carries any fraud flags in the national database." },
  { icon: Recycle, title: "Salvage & Junk Records", desc: "Know if a vehicle was ever declared a total loss, issued a salvage title, or sent to a junkyard — even if it was later rebuilt." },
  { icon: Droplets, title: "Flood & Fire Damage", desc: "Flood and fire damage can be cosmetically hidden but structurally devastating. Our report flags any disclosed environmental damage events." },
  { icon: AlertTriangle, title: "Recall & Safety Alerts", desc: "See all open and resolved manufacturer safety recalls. Never drive a car with an unfixed recall you didn't know about." },
  { icon: TrendingUp, title: "Price & Listing History", desc: "AutoWurx-exclusive: see historical listing prices, how long the vehicle sat on the market, and photos from previous seller listings." },
];

const WhatInReport = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,14%)]">
    <div className="container max-w-[920px]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary text-center mb-2">
        What You'll Uncover
      </p>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
        Everything Hidden. Now Visible.
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
      <p className="text-muted-foreground text-sm text-center max-w-[480px] mx-auto mb-10">
        Every AutoWurx Auto Report combines official NMVTIS government title
        data with AutoWurx listing history to give you the most complete picture
        of any vehicle.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card border border-border rounded-[10px] p-5 hover:border-t-[3px] hover:border-t-primary hover:bg-card/80 transition-all group flex flex-col"
          >
            <f.icon className="text-primary mb-3" size={24} />
            <h3 className="text-sm font-bold text-foreground mb-1 normal-case">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatInReport;
