import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { Heart, MapPin, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Auction } from "@/data/mockAuctions";

interface Props {
  auction: Auction;
  onDetails: (a: Auction) => void;
}

const AuctionCard = ({ auction: a, onDetails }: Props) => {
  const timer = useCountdown(a.timeLeftMs);
  const [bidOpen, setBidOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(a.currentBid + a.minIncrement);
  const [watched, setWatched] = useState(false);

  const statusBadge = a.status === "live"
    ? <span className="flex items-center gap-1 bg-destructive/90 text-destructive-foreground text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm motion-safe:animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground" />LIVE</span>
    : a.status === "upcoming"
    ? <span className="bg-muted text-muted-foreground text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">🔜 Upcoming</span>
    : <span className="bg-primary/20 text-primary text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">⏱ Timed</span>;

  const conditionColor = a.condition === "Clean Title" ? "bg-green-600" : a.condition === "Salvage" ? "bg-destructive" : "bg-primary";

  const handleBid = () => {
    // TODO: Replace with real WebSocket bid submission via Supabase Realtime channel
    toast.success(`✓ Bid placed! You're currently the highest bidder at $${bidAmount.toLocaleString()}.`);
    setBidOpen(false);
  };

  return (
    <div className={cn("bg-card border border-border rounded-[14px] overflow-hidden transition-all hover:border-primary hover:-translate-y-0.5 group")}>
      {/* Photo */}
      <div className="relative aspect-[16/9]">
        <img src={a.image} alt={`${a.year} ${a.make} ${a.model}`} className="w-full h-full object-cover" />
        <div className="absolute top-2.5 left-2.5">{statusBadge}</div>
        <button
          onClick={() => setWatched(!watched)}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-background/60 backdrop-blur transition-colors"
        >
          <Heart className={cn("w-4 h-4", watched ? "fill-primary text-primary" : "text-foreground")} />
        </button>
        <span className={cn("absolute bottom-2.5 left-2.5 text-[9px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm text-foreground", conditionColor)}>
          {a.condition}
        </span>
        {a.noReserve && (
          <span className="absolute bottom-2.5 right-2.5 bg-primary text-primary-foreground text-[9px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
            No Reserve
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-3 pb-2">
        <p className="font-heading text-sm font-bold text-foreground truncate">{a.year} {a.make} {a.model} {a.trim}</p>
        <p className="text-[11px] text-muted-foreground truncate">{a.mileage.toLocaleString()} mi | {a.engine} | {a.transmission} | {a.color}</p>
        <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
          <MapPin className="w-3 h-3" /> {a.location}
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
          <div className="w-5 h-5 rounded-full bg-muted" />
          {a.sellerName} · <span className="text-primary">★{a.sellerRating}</span>
        </div>
      </div>

      {/* Bid section */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[9px] text-muted-foreground uppercase font-heading tracking-wider">Current Bid</span>
            <p className="font-heading text-[22px] font-bold text-primary leading-tight">${a.currentBid.toLocaleString()}</p>
            <span className="text-[10px] text-muted-foreground">+${a.minIncrement} min</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-muted-foreground uppercase font-heading tracking-wider">Time Left</span>
            <p className={cn(
              "font-mono text-base font-bold leading-tight",
              timer.ended ? "text-destructive" : timer.isUrgent ? "text-destructive motion-safe:animate-pulse" : timer.isWarning ? "text-orange-400" : "text-primary"
            )}>
              {timer.ended ? "ENDED" : timer.formatted}
            </p>
            <span className="text-[10px] text-muted-foreground">{a.bids} bids</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-3">
        <Button size="sm" className="flex-[2]" onClick={() => setBidOpen(!bidOpen)}>Place Bid</Button>
        <Button size="sm" variant="secondary" className="flex-1" onClick={() => onDetails(a)}>Details</Button>
        <button
          onClick={() => { setWatched(!watched); toast.info(watched ? "Removed from watchlist" : "Added to watchlist"); }}
          className={cn("w-10 h-9 flex items-center justify-center rounded-md border border-border transition-colors", watched ? "border-primary text-primary" : "text-muted-foreground hover:text-foreground")}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Bid input slide-down */}
      <div className={cn("overflow-hidden transition-all duration-300", bidOpen ? "max-h-40" : "max-h-0")}>
        <div className="px-4 pb-4 space-y-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="w-full bg-secondary border border-primary rounded px-3 py-2 font-mono text-foreground text-sm"
            min={a.currentBid + a.minIncrement}
            step={a.minIncrement}
          />
          <Button className="w-full" onClick={handleBid}>Confirm Bid: ${bidAmount.toLocaleString()}</Button>
          <button onClick={() => setBidOpen(false)} className="text-xs text-muted-foreground hover:text-foreground w-full text-center">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
