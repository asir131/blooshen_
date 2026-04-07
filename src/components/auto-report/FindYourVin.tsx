import { Monitor, DoorOpen, FileText, Wrench } from "lucide-react";

const locations = [
  { icon: Monitor, title: "Dashboard", desc: "Look through the windshield at the lower-left corner of the dashboard. This is the most visible and commonly checked spot.", badge: "Most Common" },
  { icon: DoorOpen, title: "Driver Door Jamb", desc: "Open the driver-side door and look at the door frame where the door latches. A white sticker contains the VIN." },
  { icon: FileText, title: "Title & Registration", desc: "Your VIN is printed on your title certificate, registration card, and proof of insurance documents." },
  { icon: Wrench, title: "Engine Bay", desc: "On many vehicles, the VIN is stamped directly onto the engine block or on a plate at the front of the engine bay." },
];

const vinSegments = [
  { chars: ["1", "H", "G"], label: "Country\nof Origin" },
  { chars: ["B", "H", "4"], label: "Make" },
  { chars: ["1", "J"], label: "Vehicle\nType" },
  { chars: ["X"], label: "Check\nDigit" },
  { chars: ["M"], label: "Model\nYear" },
  { chars: ["N", "1", "0", "9", "1", "8", "6"], label: "Production\nSequence" },
];

const FindYourVin = () => (
  <section className="w-full py-16 md:py-20 bg-[hsl(0,0%,14%)]">
    <div className="container max-w-[780px]">
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
        Where Is My VIN?
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
      <p className="text-muted-foreground text-sm text-center max-w-[500px] mx-auto mb-10">
        Your Vehicle Identification Number is a unique 17-character code. Here are the 4 most common
        places to find it.
      </p>

      {/* Location cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
        {locations.map((loc) => (
          <div
            key={loc.title}
            className="min-w-[200px] snap-start bg-card border border-border rounded-[10px] p-5 flex flex-col items-center text-center flex-shrink-0 md:flex-shrink"
          >
            <loc.icon className="text-primary mb-3" size={24} />
            <h3 className="text-sm font-bold text-foreground mb-1 normal-case">{loc.title}</h3>
            {loc.badge && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary-foreground bg-primary px-2 py-0.5 rounded-full mb-2">
                {loc.badge}
              </span>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed">{loc.desc}</p>
          </div>
        ))}
      </div>

      {/* VIN decoder strip */}
      <div className="mt-10 overflow-x-auto pb-2">
        <div className="flex justify-center gap-1 min-w-max mx-auto">
          {vinSegments.map((seg, si) => (
            <div key={si} className="flex flex-col items-center">
              <div className="flex gap-0.5 mb-2">
                {seg.chars.map((c, ci) => (
                  <div
                    key={ci}
                    className="w-8 h-9 flex items-center justify-center bg-background border border-primary rounded text-foreground font-mono text-sm font-bold"
                  >
                    {c}
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-muted-foreground text-center whitespace-pre-line leading-tight">
                {seg.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FindYourVin;
