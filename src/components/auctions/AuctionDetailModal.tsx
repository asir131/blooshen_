import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/useCountdown";
import { mockBidHistory } from "@/data/mockAuctions";
import { X, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Auction } from "@/data/mockAuctions";

// TODO: Subscribe to Supabase Realtime channel
// channel: `auction:${auction.id}`
// Events: bid_placed, auction_ended, reserve_met, outbid_notification
// Update: current_bid, bid_count, time_remaining, bid_history

interface Props {
  auction: Auction;
  onClose: () => void;
}

const AuctionDetailModal = ({ auction: a, onClose }: Props) => {
  const timer = useCountdown(a.timeLeftMs);
  const [bidAmount, setBidAmount] = useState(a.currentBid + a.minIncrement);
  const [autoBidOpen, setAutoBidOpen] = useState(false);
  const [question, setQuestion] = useState("");

  const handleBid = () => {
    toast.success(`✓ Bid placed! $${bidAmount.toLocaleString()}`);
  };

  const specs = [
    ["Mileage", `${a.mileage.toLocaleString()} mi`],
    ["Engine", a.engine],
    ["Transmission", a.transmission],
    ["Ext Color", a.color],
    ["Condition", a.condition],
    ["VIN", a.vin],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-primary rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end p-3 bg-[#1a1a1a]/90 backdrop-blur">
          <button onClick={onClose} className="text-primary hover:text-foreground p-1"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 px-6 pb-8">
          {/* Left */}
          <div className="md:w-[55%] space-y-4">
            <div className="aspect-[16/9] rounded-lg overflow-hidden">
              <img src={a.image} alt={`${a.year} ${a.make} ${a.model}`} className="w-full h-full object-cover" />
            </div>
            <a href={`/auto-report?vin=${a.vin}`} className="text-primary text-xs font-heading font-bold hover:underline">Run Auto Report →</a>

            <h2 className="font-heading text-xl font-bold text-foreground">{a.year} {a.make} {a.model} {a.trim}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{a.vin}</span>
              <button onClick={() => { navigator.clipboard.writeText(a.vin); toast.info("VIN copied"); }}><Copy className="w-3 h-3" /></button>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border rounded overflow-hidden text-xs">
              {specs.map(([k, v], i) => (
                <div key={k} className={cn("px-3 py-2", i % 2 === 0 ? "bg-secondary" : "bg-card")}>
                  <span className="text-muted-foreground">{k}</span>
                  <p className="text-foreground font-bold">{v}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>

            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div>
                <p className="text-sm font-bold text-foreground">{a.sellerName}</p>
                <p className="text-[10px] text-muted-foreground">★{a.sellerRating} · <a href="#" className="text-primary hover:underline">View Profile</a></p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="md:w-[45%] space-y-4">
            <div className="bg-card border border-primary rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                {a.status === "live" ? (
                  <span className="flex items-center gap-1 text-destructive text-xs font-heading font-bold uppercase motion-safe:animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-destructive" /> Live Auction
                  </span>
                ) : (
                  <span className="text-primary text-xs font-heading font-bold uppercase">⏱ Timed Auction</span>
                )}
              </div>

              <div>
                <span className="font-heading text-[32px] font-bold text-primary">${a.currentBid.toLocaleString()}</span>
                <p className="text-xs text-muted-foreground">Minimum next bid: ${(a.currentBid + a.minIncrement).toLocaleString()}</p>
              </div>

              <div className={cn(
                "font-mono text-4xl font-bold text-center",
                timer.ended ? "text-destructive" : timer.isUrgent ? "text-destructive motion-safe:animate-pulse" : timer.isWarning ? "text-orange-400" : "text-primary"
              )}>
                {timer.formatted}
              </div>

              {/* Bid history */}
              <div className="text-xs">
                <p className="text-muted-foreground font-heading uppercase tracking-wider mb-2">Recent Bids</p>
                <div className="space-y-1">
                  {mockBidHistory.map((b, i) => (
                    <div key={i} className={cn("flex justify-between px-2 py-1 rounded", i === 0 ? "bg-primary/10 text-primary" : "text-muted-foreground")}>
                      <span className="font-mono">{b.bidder}</span>
                      <span className="font-bold">${b.amount.toLocaleString()}</span>
                      <span>{b.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bid input */}
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full bg-secondary border border-primary rounded px-3 py-3 font-mono text-foreground text-lg"
                min={a.currentBid + a.minIncrement}
                step={a.minIncrement}
              />
              <div className="flex gap-2">
                {[250, 500, 1000].map((inc) => (
                  <button key={inc} onClick={() => setBidAmount((p) => p + inc)} className="flex-1 py-1 rounded bg-secondary text-xs font-heading text-foreground hover:bg-muted border border-border">
                    +${inc}
                  </button>
                ))}
              </div>
              <Button className="w-full text-base" size="lg" onClick={handleBid}>Place Bid →</Button>

              {/* Auto-bid */}
              <button onClick={() => setAutoBidOpen(!autoBidOpen)} className="text-xs text-muted-foreground hover:text-primary w-full text-left font-heading">
                {autoBidOpen ? "▴" : "▾"} Set Auto-Bid Maximum
              </button>
              {autoBidOpen && (
                <div className="space-y-2 pl-2">
                  <input type="number" placeholder="Your max bid" className="w-full bg-secondary border border-border rounded px-3 py-2 font-mono text-foreground text-sm" />
                  <Button variant="outline" className="w-full border-primary text-primary text-xs">Enable Auto-Bid</Button>
                  <p className="text-[10px] text-muted-foreground">AutoWurx will automatically outbid competitors up to your maximum.</p>
                </div>
              )}

              {/* Reserve */}
              {a.noReserve ? (
                <span className="inline-block bg-primary/20 text-primary text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded">No Reserve — Sells to Highest Bidder</span>
              ) : a.reserveMet ? (
                <span className="inline-block bg-green-600/20 text-green-400 text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded">✓ Reserve Met</span>
              ) : (
                <span className="inline-block bg-muted text-muted-foreground text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded">Reserve Not Yet Met</span>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1 text-xs"><Heart className="w-3 h-3 mr-1" /> Watchlist</Button>
                <Button variant="secondary" className="flex-1 text-xs"><Share2 className="w-3 h-3 mr-1" /> Share & Earn $25</Button>
              </div>
            </div>

            {/* Q&A */}
            <div className="space-y-3">
              <p className="font-heading text-sm font-bold text-foreground">Ask the Seller a Question</p>
              <div className="flex gap-2">
                <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Type your question..." className="flex-1 bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground" />
                <Button size="sm" onClick={() => { toast.info("Question submitted"); setQuestion(""); }}>Submit</Button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-card rounded border border-border">
                  <p className="text-foreground font-bold">Q: Has this vehicle had any accidents?</p>
                  <p className="text-muted-foreground mt-1">A: No accidents, clean Carfax. Happy to share the report.</p>
                </div>
                <div className="p-3 bg-card rounded border border-border">
                  <p className="text-foreground font-bold">Q: Can I arrange a pre-bid inspection?</p>
                  <p className="text-muted-foreground mt-1">A: Absolutely, message me to schedule a time.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailModal;

import { Heart } from "lucide-react";
