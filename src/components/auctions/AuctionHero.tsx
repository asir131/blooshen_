import { Button } from "@/components/ui/button";
import { mockAuctions } from "@/data/mockAuctions";
import { useCountdown } from "@/hooks/useCountdown";
import { Eye } from "lucide-react";

const featured = mockAuctions[0];

const AuctionHero = () => {
  const timer = useCountdown(featured.timeLeftMs);

  return (
    <section className="relative w-full bg-[#1A1A1A] overflow-hidden">
      {/* Diagonal texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)"
      }} />

      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
        {/* Left text */}
        <div className="flex-1 text-center md:text-left">
          <p className="font-heading text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Live &amp; Timed Auctions
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-4">
            Bid Smart.<br />Drive Away Winning.
          </h1>
          <p className="text-muted-foreground text-sm max-w-[460px] mx-auto md:mx-0 mb-8 leading-relaxed">
            AutoWurx Auctions puts you in the driver's seat. Bid on cars, trucks, rentals, and parts from real local sellers — no dealers, no markups, just competitive live bidding from your phone.
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-10">
            <Button onClick={() => document.getElementById("auction-grid")?.scrollIntoView({ behavior: "smooth" })}>
              Browse Live Auctions ↓
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              List My Vehicle for Auction →
            </Button>
          </div>

          {/* Stats strip */}
          {/* // TODO: Fetch live stats from /api/auctions/stats — Poll every 30s or subscribe via Supabase Realtime */}
          <div className="flex gap-8 justify-center md:justify-start">
            {[
              ["34", "Live auctions right now"],
              ["1,240", "Registered bidders"],
              ["$2.8M", "Total bids placed this month"],
            ].map(([num, label]) => (
              <div key={label} className="text-center md:text-left">
                <span className="font-heading text-2xl font-bold text-primary">{num}</span>
                <p className="text-[11px] text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — featured live auction card */}
        <div className="w-full max-w-[340px] shrink-0 rounded-[14px] border-2 border-primary bg-card overflow-hidden">
          <div className="relative aspect-[16/9]">
            <img src={featured.image} alt={`${featured.year} ${featured.make} ${featured.model}`} className="w-full h-full object-cover" />
            <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-destructive/90 text-destructive-foreground text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1 rounded-sm motion-safe:animate-pulse">
              <span className="w-2 h-2 rounded-full bg-destructive-foreground" /> LIVE
            </span>
            <span className="absolute top-3 right-3 flex items-center gap-1 bg-background/70 backdrop-blur text-primary text-[10px] font-heading font-bold px-2 py-1 rounded-full">
              <Eye className="w-3 h-3" /> {featured.watchers} watchers
            </span>
          </div>
          <div className="p-4">
            <h3 className="font-heading text-base font-bold text-foreground mb-2">
              {featured.year} {featured.make} {featured.model} {featured.trim}
            </h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[10px] text-muted-foreground uppercase">Current Bid</span>
              <span className="font-heading text-2xl font-bold text-primary">${featured.currentBid.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">+${featured.minIncrement} minimum increment</p>
            <div className={`font-mono text-[28px] font-bold mb-1 ${timer.isUrgent ? "text-destructive motion-safe:animate-pulse" : timer.isWarning ? "text-orange-400" : "text-primary"}`}>
              {timer.formatted}
            </div>
            {timer.remaining < 3600_000 && !timer.ended && (
              <p className="text-[11px] text-destructive font-bold motion-safe:animate-pulse mb-2">Ending soon</p>
            )}
            <p className="text-[11px] text-muted-foreground mb-4">{featured.bids} bids · {featured.watchers} watching</p>
            <Button className="w-full mb-2">Place Bid</Button>
            <Button variant="secondary" className="w-full">Watch Auction</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuctionHero;
