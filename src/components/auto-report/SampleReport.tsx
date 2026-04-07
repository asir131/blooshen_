import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Placeholder sample report data — no real API calls */
const statusItems = [
  { label: "Title Status", value: "Clean Title", color: "#22C55E" },
  { label: "Theft Record", value: "No theft reported", color: "#22C55E" },
  { label: "Salvage Record", value: "No salvage history", color: "#22C55E" },
  { label: "Junk Record", value: "Not junked", color: "#22C55E" },
  { label: "Accident Record", value: "1 reported incident", color: "#FFE000" },
  { label: "Odometer", value: "Consistent — 42,311 miles", color: "#22C55E" },
  { label: "Flood Damage", value: "No flood damage", color: "#22C55E" },
  { label: "Fire Damage", value: "No fire damage", color: "#22C55E" },
  { label: "Open Recalls", value: "0 open recalls", color: "#22C55E" },
  { label: "Number of Owners", value: "3 previous owners", color: "#FFE000" },
];

const odometerHistory = [
  { date: "2019-04-12", mileage: "11 mi", source: "Title transfer" },
  { date: "2021-08-30", mileage: "18,440 mi", source: "Title transfer" },
  { date: "2023-11-15", mileage: "42,311 mi", source: "Title transfer" },
];

const vehicleSpecs = [
  { label: "Year", value: "2019" },
  { label: "Make", value: "Honda" },
  { label: "Model", value: "Accord" },
  { label: "Trim", value: "Sport" },
  { label: "Body", value: "Sedan" },
  { label: "Engine", value: "1.5L Turbo" },
  { label: "Trans", value: "CVT" },
  { label: "Fuel", value: "Gasoline" },
];

const SampleReport = () => (
  <section id="sample-report" className="w-full py-16 md:py-20 bg-background">
    <div className="container max-w-[860px]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary text-center mb-2">
        Sample Report
      </p>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
        See What a Full Report Looks Like
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-10" />

      {/* Mock report card */}
      <div className="relative bg-[hsl(0,0%,14%)] border border-primary rounded-xl overflow-hidden">
        <div className="p-5 md:p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-heading font-bold text-primary-foreground text-lg">A</div>
              <span className="text-sm font-bold text-foreground">AutoWurx Auto Report</span>
            </div>
            <span className="font-mono text-primary text-sm tracking-widest">1HGBH41JXMN109186</span>
            <span className="text-xs text-muted-foreground">Report Generated: Today</span>
          </div>

          {/* Vehicle summary */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-6 pb-4 border-b border-border">
            {vehicleSpecs.map((s, i) => (
              <span key={s.label}>
                <span className="text-muted-foreground">{s.label}:</span>{" "}
                <span className="text-foreground font-medium">{s.value}</span>
                {i < vehicleSpecs.length - 1 && (
                  <span className="text-[hsl(0,0%,27%)] ml-3">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status indicators */}
            <div className="space-y-2">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-xs">
                  <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill={item.color} /></svg>
                  <span className="text-muted-foreground w-28 shrink-0">{item.label}</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Odometer history */}
            <div>
              <h4 className="text-sm font-bold text-foreground mb-3 normal-case">Odometer History</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-primary text-left">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Mileage</th>
                    <th className="pb-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {odometerHistory.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-[hsl(0,0%,14%)]"}>
                      <td className="py-1.5 px-1 text-foreground">{row.date}</td>
                      <td className="py-1.5 px-1 text-foreground">{row.mileage}</td>
                      <td className="py-1.5 px-1 text-foreground">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Blur overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-36 flex flex-col items-center justify-center"
          style={{ backdropFilter: "blur(6px)", background: "rgba(26,26,26,0.7)" }}
        >
          <Lock className="text-muted-foreground mb-2" size={20} />
          <p className="text-sm font-bold text-foreground mb-1">Full report details locked</p>
          <p className="text-xs text-muted-foreground mb-3">
            Sign in or run a real VIN to see complete history
          </p>
          <Button
            size="sm"
            onClick={() => document.getElementById("vin-input-hero")?.scrollIntoView({ behavior: "smooth" })}
          >
            Run a Real Report →
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default SampleReport;
