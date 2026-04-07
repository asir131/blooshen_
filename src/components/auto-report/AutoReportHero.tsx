import VinPlateForm from "@/components/sell/VinPlateForm";

const trustBadges = [
  "Backed by NMVTIS Gov. Data",
  "96% of U.S. Vehicles Covered",
  "Instant Results",
];

const stats = [
  { value: "96%", label: "U.S. vehicles covered" },
  { value: "70+", label: "Title brand checks" },
  { value: "Free", label: "No signup needed" },
];

const AutoReportHero = () => (
  <section
    className="relative w-full py-16 md:py-24 overflow-hidden"
    style={{
      background: `
        repeating-linear-gradient(
          135deg,
          transparent,
          transparent 10px,
          rgba(255,255,255,0.015) 10px,
          rgba(255,255,255,0.015) 11px
        ),
        hsl(0 0% 10%)
      `,
    }}
  >
    <div className="container max-w-3xl mx-auto text-center">
      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {trustBadges.map((b) => (
          <span
            key={b}
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary border border-primary bg-card"
          >
            {b}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
        Know Before You Buy.
      </h1>
      <p className="text-muted-foreground max-w-[520px] mx-auto mb-8 text-sm md:text-base leading-relaxed">
        Run a free AutoWurx vehicle history report in seconds. Uncover accident
        history, title brands, odometer records, theft flags, and more — backed
        by official government data.
      </p>

      {/* VIN Input Card */}
      <div id="vin-input-hero" className="mb-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
          Enter VIN or License Plate
        </p>
        <VinPlateForm
          onSubmit={(d) => console.log("Auto Report lookup:", d)}
        />
        <p className="text-[11px] text-muted-foreground mt-3 max-w-md mx-auto">
          Free reports powered by NMVTIS government data. No signup required for
          basic reports.
        </p>
        <a
          href="#sample-report"
          className="inline-block mt-2 text-xs text-primary underline hover:text-primary/80"
        >
          View Sample Report →
        </a>
      </div>

      {/* Stats strip */}
      <div className="flex justify-center gap-10 md:gap-16 flex-wrap">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary font-heading">
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AutoReportHero;
