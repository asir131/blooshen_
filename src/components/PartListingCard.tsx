import { useState } from "react";
import type { PartListing } from "@/data/mockParts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart } from "lucide-react";
import ShareEarnButton from "@/components/ShareEarnButton";

interface Props {
  listing: PartListing;
  viewMode: "grid" | "list";
}

const PartListingCard = ({ listing, viewMode }: Props) => {
  const [wishlisted, setWishlisted] = useState(false);

  const conditionVariant = (() => {
    switch (listing.condition) {
      case "New": case "OEM": return "default" as const;
      case "Aftermarket": return "accent" as const;
      default: return "secondary" as const;
    }
  })();

  const heartBtn = (
    <button
      onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
      className={`p-1.5 rounded-md transition-colors ${wishlisted ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
      aria-label="Add to Watchlist"
    >
      <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary" : ""}`} />
    </button>
  );

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
        <div className="relative sm:w-56 h-44 sm:h-auto shrink-0 overflow-hidden">
          <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" loading="lazy" />
          <ShareEarnButton listingId={String(listing.id)} listingPath={`/parts-accessories/${listing.id}`} category="parts_accessories" variant="card" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 gap-3">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={conditionVariant}>{listing.condition}</Badge>
                <Badge variant="outline">{listing.category}</Badge>
              </div>
              {heartBtn}
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">{listing.name}</h3>
            <p className="text-xs text-muted-foreground font-body mt-1">Fits: {listing.compatibleVehicles.join(", ")}</p>
            <p className="font-heading text-2xl font-black text-primary mt-1">${listing.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
            <span>{listing.sellerName}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
      <div className="relative h-44 overflow-hidden">
        <img src={listing.image} alt={listing.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        <Badge className="absolute top-3 left-3" variant={conditionVariant}>{listing.condition}</Badge>
        <ShareEarnButton listingId={String(listing.id)} listingPath={`/parts-accessories/${listing.id}`} category="parts_accessories" variant="card" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{listing.category}</Badge>
          {heartBtn}
        </div>
        <h3 className="font-heading text-sm font-bold text-foreground leading-tight">{listing.name}</h3>
        <p className="text-[11px] text-muted-foreground font-body truncate">Fits: {listing.compatibleVehicles.join(", ")}</p>
        <p className="font-heading text-xl font-black text-primary">${listing.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <span>{listing.sellerName}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{listing.location}</span>
        </div>
      </div>
    </div>
  );
};

export default PartListingCard;
