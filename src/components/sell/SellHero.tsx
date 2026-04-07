import VinPlateForm from "./VinPlateForm";

const SellHero = () => (
  <section
    className="relative w-full py-16 md:py-24 overflow-hidden"
    style={{
      background: `
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(255,255,255,0.015) 10px,
          rgba(255,255,255,0.015) 11px
        ),
        repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 10px,
          rgba(255,255,255,0.015) 10px,
          rgba(255,255,255,0.015) 11px
        ),
        hsl(0 0% 10%)
      `,
    }}
  >
    <div className="container max-w-3xl text-center">
      {/* Trust badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["100% Free to List", "No Hidden Fees", "Cash-Friendly"].map((badge) => (
          <span
            key={badge}
            className="px-3 py-1 rounded-full text-xs font-bold border border-primary text-primary bg-card/60"
          >
            {badge}
          </span>
        ))}
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-heading uppercase tracking-wide">
        Sell Your Car Fast on AutoWurx
      </h1>
      <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-xl mx-auto">
        Get a cash offer in minutes. No dealers. No drama. Just a fast, honest sale — on your terms.
      </p>

      <VinPlateForm />
    </div>
  </section>
);

export default SellHero;
