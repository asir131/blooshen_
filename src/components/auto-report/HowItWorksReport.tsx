import { Keyboard, Search, FileCheck } from "lucide-react";

const steps = [
  { num: 1, icon: Keyboard, title: "Enter Your VIN or Plate", desc: "Find your VIN on the dashboard near the windshield, inside the driver door jamb, or on your registration. Or just type in the license plate and select your state." },
  { num: 2, icon: Search, title: "We Search the Database", desc: "We instantly cross-reference the NMVTIS national database plus AutoWurx's own listing history — over 70 title checks run simultaneously in the background." },
  { num: 3, icon: FileCheck, title: "Get Your Full Report", desc: "Your complete vehicle history report appears on screen immediately. Review it, save it as a PDF, or share it with your mechanic before your pre-purchase inspection." },
];

const HowItWorksReport = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,14%)]">
    <div className="container max-w-[900px]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary text-center mb-2">How It Works</p>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
        Your Report in 3 Seconds Flat
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />

      <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
        {steps.map((s, i) => (
          <div key={s.num} className="flex-1 flex flex-col items-center relative">
            {/* Connector */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] border-t-2 border-dashed border-primary" />
            )}
            <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading font-bold text-lg mb-4 z-10">
              {s.num}
            </div>
            <div className="bg-card border border-border rounded-xl p-5 text-center w-full">
              <s.icon className="text-primary mx-auto mb-3" size={24} />
              <h3 className="text-sm font-bold text-foreground mb-2 normal-case">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Callout */}
      <div className="mt-12 max-w-[600px] mx-auto border-l-2 border-primary pl-4">
        <p className="text-[13px] text-muted-foreground italic leading-relaxed">
          A vehicle history report is a powerful tool — but it's not a substitute for a professional
          inspection. Always have a trusted mechanic inspect any used vehicle before purchase.
        </p>
      </div>
    </div>
  </section>
);

export default HowItWorksReport;
