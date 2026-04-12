import { Shield, Clock, DollarSign } from "lucide-react";
import ZipSearchInput from "./ZipSearchInput";

interface FindBrokerHeroProps {
  onZipSubmit: (zip: string) => void;
}

const FindBrokerHero = ({ onZipSubmit }: FindBrokerHeroProps) => {
  return (
    <section className="relative bg-background py-20 md:py-28 overflow-hidden">
      {/* Diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <p className="text-primary text-xs font-heading uppercase tracking-[0.25em] mb-4">
          YOUR PERSONAL CAR BUYING CHAMPION
        </p>

        <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-[1.1] mb-5">
          GET THE DEAL,
          <br />
          NONE OF THE HASSLE.
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed max-w-[520px] mx-auto mb-8">
          Meet your AutoWurx Neighborhood Broker — a real person in your area who finds your next car, negotiates on
          your behalf, and guides you from search to keys. No pushy tactics. No wasted weekends. Just results.
        </p>

        {/* Zip search card */}
        <div className="bg-secondary border border-primary rounded-[14px] max-w-[480px] mx-auto p-5 mb-6">
          <p className="text-primary text-[10px] font-heading uppercase tracking-[0.2em] mb-3">
            FIND BROKERS NEAR YOU
          </p>
          <ZipSearchInput onSubmit={onZipSubmit} />
          <p className="text-muted-foreground text-[11px] mt-3 leading-relaxed">
            Showing brokers within 25 miles of your location. Free to connect — brokers earn referral fees, not
            commissions from you.
          </p>
        </div>

        {/* Benefit strip */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-primary" />
            Your advocate, not the dealer's
          </span>
          <span className="hidden md:inline text-border">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            Save 10+ hours of negotiation
          </span>
          <span className="hidden md:inline text-border">·</span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-primary" />
            Free to you — brokers earn referral fees
          </span>
        </div>
      </div>
    </section>
  );
};

export default FindBrokerHero;
