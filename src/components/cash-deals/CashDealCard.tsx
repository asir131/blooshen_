import { Heart, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShareEarnButton from "@/components/ShareEarnButton";
import type { CashDealListing } from "@/data/mockCashDeals";

const scoreColor = (score: number) => {
  if (score >= 80) return "hsl(142 71% 45%)";
  if (score >= 60) return "hsl(var(--primary))";
  return "hsl(0 72% 51%)";
};

const scoreLabel = (score: number) => {
  if (score >= 80) return "Great Deal";
  if (score >= 60) return "Good Deal";
  if (score >= 40) return "Fair Deal";
  return "Below Avg";
};

const conditionColor = (c: string) => {
  if (c === "Clean Title") return "bg-[hsl(142_71%_45%)] text-foreground";
  if (c === "Salvage") return "bg-destructive text-foreground";
  return "bg-primary text-primary-foreground";
};

const CashDealCard = ({ listing }: { listing: CashDealListing }) => {
  const title = `${listing.year} ${listing.make} ${listing.model}${listing.trim ? " " + listing.trim : ""}`;
  const savings = listing.marketAvg - listing.askingPrice;

  return (
    <div className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
      {/* Photo */}
      <div className="relative aspect-video overflow-hidden">
        <img src={listing.image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100" loading="lazy" />

        {/* Badges */}
        <span className="absolute top-2.5 left-2.5 rounded-full bg-[hsl(142_71%_45%)] px-2.5 py-0.5 text-[10px] font-heading font-bold uppercase text-foreground">CA$H</span>

        {listing.isBestDeal && (
          <span className="absolute top-2.5 right-10 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-heading font-bold uppercase text-primary-foreground">🔥 Best Deal</span>
        )}

        <button className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-background/60 flex items-center justify-center hover:bg-background/80 transition-colors">
          <Heart className="h-3.5 w-3.5 text-foreground" />
        </button>

        <span className={`absolute bottom-2.5 left-2.5 rounded-full px-2 py-0.5 text-[9px] font-heading font-bold uppercase ${conditionColor(listing.condition)}`}>
          {listing.condition}
        </span>

        <div className="absolute bottom-2.5 right-2.5 flex gap-1">
          {listing.paymentMethods.includes("Cash") && <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[9px] font-bold text-foreground">$</span>}
          {listing.paymentMethods.includes("Venmo") && <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[9px] font-bold text-foreground">V</span>}
          {listing.paymentMethods.includes("CashApp") && <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[9px] font-bold text-foreground">C</span>}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <p className="font-heading text-sm font-bold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{listing.trim ? `${listing.trim} · ` : ""}{listing.mileage.toLocaleString()} mi · {listing.color}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3" />{listing.location} · {listing.distance} mi
          </p>
        </div>

        {/* Price */}
        <div>
          <p className="font-heading text-xl font-black text-primary">${listing.askingPrice.toLocaleString()}</p>
          {savings > 0 && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground line-through">${listing.marketAvg.toLocaleString()}</span>
              <span className="text-[11px] font-bold text-[hsl(142_71%_45%)]">Save ~${savings.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Deal Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Deal Score</span>
            <span className="text-[10px] font-bold" style={{ color: scoreColor(listing.dealScore) }}>
              {listing.dealScore}/100 — {scoreLabel(listing.dealScore)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${listing.dealScore}%`, backgroundColor: scoreColor(listing.dealScore) }}
            />
          </div>
        </div>

        {/* Payment pills */}
        <div className="flex flex-wrap gap-1">
          {listing.paymentMethods.map((m) => (
            <span key={m} className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${m === "Financing" ? "bg-secondary text-muted-foreground" : "bg-[hsl(142_71%_45%/0.15)] text-[hsl(142_71%_45%)]"}`}>
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
            {listing.sellerName[0]}
          </div>
          <div>
            <p className="text-[11px] text-foreground font-medium">{listing.sellerName}</p>
            <p className="text-[10px] text-primary">{"★".repeat(Math.round(listing.sellerRating))} <span className="text-muted-foreground">{listing.sellerRating}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" className="text-[10px] h-7 px-2.5">View Details</Button>
          <Button size="sm" className="text-[10px] h-7 px-2.5">Contact Seller</Button>
        </div>
      </div>
    </div>
  );
};

export default CashDealCard;
