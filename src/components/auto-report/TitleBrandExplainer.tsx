const brands = [
  { title: "Clean Title", color: "#22C55E", desc: "The vehicle has not been declared a total loss and has no liens or major damage disclosures. This is what you want to see." },
  { title: "Salvage Title", color: "#EF4444", desc: "The vehicle was damaged beyond 75% of its original value — typically by a collision or natural disaster. It can be rebuilt, but will never return to clean title status." },
  { title: "Rebuilt / Reconstructed", color: "#FFE000", desc: "A salvaged vehicle that has been repaired and passed a state inspection. Driveable, but the salvage history remains on record and affects resale value." },
  { title: "Flood Damage", color: "#EF4444", desc: "Water damage — especially from flooding — can cause long-term electrical and structural issues that are extremely difficult to detect visually. Approach with serious caution." },
  { title: "Lemon / Warranty Return", color: "#FFE000", desc: "The vehicle was returned to the manufacturer under a lemon law or warranty agreement due to recurring defects. Repairs may have been made, but the brand stays on the title." },
  { title: "Odometer Rollback", color: "#EF4444", desc: "The reported mileage is inconsistent with previous records — a major red flag for fraud. Always verify odometer history against service records and CarFax/AutoCheck independently." },
];

const TitleBrandExplainer = () => (
  <section className="w-full py-16 md:py-20 bg-background">
    <div className="container max-w-[860px]">
      <p className="text-[11px] font-bold uppercase tracking-widest text-primary text-center mb-2">
        Understanding Your Report
      </p>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-2">
        What Do These Title Brands Mean?
      </h2>
      <div className="w-16 h-0.5 bg-primary mx-auto mb-4" />
      <p className="text-muted-foreground text-sm text-center max-w-[520px] mx-auto mb-10">
        Vehicle title brands can be confusing. Here's a plain-English breakdown of the most common
        ones you'll encounter in your report.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => (
          <div
            key={b.title}
            className="bg-card rounded-r-[10px] p-5 flex flex-col"
            style={{ borderLeft: `4px solid ${b.color}` }}
          >
            <h3 className="text-sm font-bold text-foreground mb-2 normal-case">{b.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TitleBrandExplainer;
