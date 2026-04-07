import { Link } from "react-router-dom";
import type { CarListing } from "@/data/mockListings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, MapPin } from "lucide-react";
import ShareEarnButton from "@/components/ShareEarnButton";

interface Props {
  listing: CarListing;
  viewMode: "grid" | "list";
}

const CarListingCard = ({ listing, viewMode }: Props) => {
  const title = `${listing.year} ${listing.make} ${listing.model}`;

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
        <div className="relative sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
          <img src={listing.image} alt={title} className="h-full w-full object-cover" loading="lazy" />
          <ShareEarnButton listingId={String(listing.id)} listingPath={`/cars-for-sale/${listing.id}`} category="cars_for_sale" variant="card" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={listing.condition === "New" ? "default" : listing.condition === "Certified" ? "accent" : "secondary"}>
                {listing.condition}
              </Badge>
              <Badge variant="outline">{listing.bodyStyle}</Badge>
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
            <p className="font-heading text-2xl font-black text-primary mt-1">${listing.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
              <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{listing.mileage.toLocaleString()} mi</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>
            </div>
            <Button size="sm" asChild><Link to={`/cars-for-sale/${listing.id}`}>View Details</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
      <div className="relative h-48 overflow-hidden">
        <img src={listing.image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        <Badge className="absolute top-3 left-3" variant={listing.condition === "New" ? "default" : listing.condition === "Certified" ? "accent" : "secondary"}>
          {listing.condition}
        </Badge>
        <ShareEarnButton listingId={String(listing.id)} listingPath={`/cars-for-sale/${listing.id}`} category="cars_for_sale" variant="card" />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
          <p className="font-heading text-xl font-black text-primary mt-0.5">${listing.price.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
          <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{listing.mileage.toLocaleString()} mi</span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.location}</span>
        </div>
        <Button size="sm" className="w-full" asChild><Link to={`/cars-for-sale/${listing.id}`}>View Details</Link></Button>
      </div>
    </div>
  );
};

export default CarListingCard;
