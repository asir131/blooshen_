import { Star } from "lucide-react";
import { testimonials } from "@/data/mockBrokers";

const BrokerTestimonials = () => {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="bg-background py-16 px-4 overflow-hidden">
      <div className="max-w-[900px] mx-auto text-center mb-8">
        <p className="text-primary text-xs font-heading uppercase tracking-[0.2em] mb-2">WHAT BUYERS ARE SAYING</p>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-1">Real People. Real Deals.</h2>
        <div className="w-12 h-0.5 bg-primary mx-auto" />
      </div>

      {/* Scrolling carousel */}
      <div className="relative group">
        <div
          className="flex gap-4 motion-safe:animate-[scroll-left_40s_linear_infinite] group-hover:[animation-play-state:paused] w-max"
        >
          {doubled.map((t, i) => (
            <div
              key={i}
              className="min-w-[280px] max-w-[320px] bg-card border border-border rounded-xl p-5 shrink-0"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground text-[13px] italic leading-[1.7] mb-3">"{t.quote}"</p>
              <p className="text-muted-foreground text-xs">
                — {t.name}, {t.city}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center mt-6 text-sm text-muted-foreground">
        Have a great broker story?{" "}
        <button className="text-primary hover:underline">Share Your Experience →</button>
      </p>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BrokerTestimonials;
