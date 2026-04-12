import { Shield, Star, Clock, Map } from "lucide-react";
import ZipSearchInput from "./ZipSearchInput";

interface BottomCTAProps {
  onZipSubmit: (zip: string) => void;
}

const BottomCTA = ({ onZipSubmit }: BottomCTAProps) => {
  return (
    <section className="bg-background py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
          Your Broker is 2 Miles Away.
        </h2>
        <p className="text-muted-foreground text-sm mb-6">Enter your zip code and meet them in 30 seconds.</p>
        <ZipSearchInput onSubmit={onZipSubmit} className="max-w-[420px] mx-auto mb-8" />
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
          {[
            { icon: Shield, label: "Free for buyers" },
            { icon: Star, label: "Verified & rated brokers" },
            { icon: Clock, label: "Most respond within 2 hours" },
            { icon: Map, label: "25-mile coverage radius" },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1">
              <Icon className="w-3.5 h-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BottomCTA;
