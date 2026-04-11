import { mockAuctions, endingSoonIds } from "@/data/mockAuctions";
import { useCountdown } from "@/hooks/useCountdown";
import { Button } from "@/components/ui/button";
import type { Auction } from "@/data/mockAuctions";

const UrgentCard = ({ a }: { a: Auction }) => {
  const timer = useCountdown(a.timeLeftMs);
  return (
    <div className="min-w-[200px] max-w-[200px] bg-card border border-border rounded-[10px] overflow-hidden shrink-0">
      <div className="relative h-[110px]">
        <img src={a.image} alt={`${a.year} ${a.make} ${a.model}`} className="w-full h-full object-cover" />
        <span className="absolute bottom-0 left-0 right-0 bg-destructive/90 text-destructive-foreground text-[9px] font-heading font-bold uppercase tracking-wider text-center py-0.5">
          Ending Soon
        </span>
      </div>
      <div className="p-2.5">
        <p className="font-heading text-xs font-bold text-foreground truncate">{a.year} {a.make} {a.model}</p>
        <p className="font-heading text-sm font-bold text-primary">${a.currentBid.toLocaleString()}</p>
        <p className={`font-mono text-[13px] font-bold ${timer.isUrgent ? "text-destructive" : "text-orange-400"}`}>{timer.formatted}</p>
        <p className="text-[10px] text-muted-foreground mb-2">{a.bids} bids</p>
        <Button size="sm" className="w-full text-[10px] py-1">Bid Now →</Button>
      </div>
    </div>
  );
};

const EndingSoonStrip = () => {
  const urgent = mockAuctions.filter((a) => endingSoonIds.includes(a.id));
  return (
    <section className="bg-[#1A1A1A] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <p className="font-heading text-xs uppercase tracking-[0.2em] text-primary mb-1">Ending Soon</p>
        <div className="w-10 h-0.5 bg-primary mb-4" />
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {urgent.map((a) => <UrgentCard key={a.id} a={a} />)}
        </div>
      </div>
    </section>
  );
};

export default EndingSoonStrip;
