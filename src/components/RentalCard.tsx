import { Link } from "react-router-dom";
import type { RentalListing } from "@/data/mockRentals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, MessageSquare } from "lucide-react";
import ShareEarnButton from "@/components/ShareEarnButton";
import WatchlistToggle from "@/components/WatchlistToggle";

interface Props {
  listing: RentalListing;
  viewMode: "grid" | "list";
}

const RentalCard = ({ listing, viewMode }: Props) => {
  const title = `${listing.year} ${listing.make} ${listing.model}`;
  const cashOk = listing.features.includes("Cash Accepted");
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(listing.rating));

  const heartBtn = <WatchlistToggle listingId={String(listing.id)} category="rentals" />;

  const availBadge = listing.availableNow ? (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-heading font-bold tracking-wider">
      <span className="h-2 w-2 rounded-full bg-success" />
      <span className="text-foreground">AVAILABLE NOW</span>
    </span>
  ) : (
    <span className="text-[11px] font-heading tracking-wider text-muted-foreground">
      Next: {listing.nextAvailable}
    </span>
  );

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
        <div className="relative sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
          <img src={listing.image} alt={title} className="h-full w-full object-cover" loading="lazy" />
          {cashOk && <Badge className="absolute top-3 left-3">Cash OK</Badge>}
          <ShareEarnButton listingId={String(listing.id)} listingPath={`/rentals/${listing.id}`} category="rentals" variant="card" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{listing.vehicleType}</Badge>
                {availBadge}
              </div>
              {heartBtn}
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-heading text-2xl font-black text-primary">${listing.dailyRate}/day</span>
              <span className="text-xs text-muted-foreground font-body">${listing.weeklyRate}/week</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {stars.map((f, i) => <Star key={i} className={`h-3.5 w-3.5 ${f ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}
              <span className="text-xs text-muted-foreground font-body ml-1">({listing.reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={listing.ownerAvatar} alt={listing.ownerName} className="h-7 w-7 rounded-full object-cover" />
              <div className="text-xs text-muted-foreground font-body">
                <span className="text-foreground font-medium">{listing.ownerName}</span> · Since {listing.memberSince}
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-body"><MapPin className="h-3 w-3" />{listing.distance} mi</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="gap-1"><MessageSquare className="h-3.5 w-3.5" /> Contact</Button>
              <Button size="sm" asChild><Link to={`/rentals/${listing.id}`}>View Details</Link></Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
      <div className="relative h-44 overflow-hidden">
        <img src={listing.image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        {cashOk && <Badge className="absolute top-3 left-3">Cash OK</Badge>}
        <div className="absolute top-3 right-12">{heartBtn}</div>
        <ShareEarnButton listingId={String(listing.id)} listingPath={`/rentals/${listing.id}`} category="rentals" variant="card" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px]">{listing.vehicleType}</Badge>
          {availBadge}
        </div>
        <h3 className="font-heading text-sm font-bold text-foreground leading-tight">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-xl font-black text-primary">${listing.dailyRate}/day</span>
          <span className="text-[11px] text-muted-foreground font-body">${listing.weeklyRate}/wk</span>
        </div>
        <div className="flex items-center gap-1">
          {stars.map((f, i) => <Star key={i} className={`h-3 w-3 ${f ? "fill-primary text-primary" : "text-muted-foreground"}`} />)}
          <span className="text-[10px] text-muted-foreground font-body ml-1">({listing.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={listing.ownerAvatar} alt={listing.ownerName} className="h-6 w-6 rounded-full object-cover" />
          <span className="text-xs text-muted-foreground font-body">{listing.ownerName}</span>
          <span className="text-xs text-muted-foreground font-body ml-auto flex items-center gap-0.5"><MapPin className="h-3 w-3" />{listing.distance} mi</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1 gap-1 text-xs"><MessageSquare className="h-3.5 w-3.5" /> Contact</Button>
          <Button size="sm" className="flex-1 text-xs" asChild><Link to={`/rentals/${listing.id}`}>View Details</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
