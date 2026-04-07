import type { ServiceProvider } from "@/data/mockProviders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Navigation } from "lucide-react";
import ShareEarnButton from "@/components/ShareEarnButton";

interface Props {
  provider: ServiceProvider;
  compact?: boolean;
}

const ProviderCard = ({ provider, compact }: Props) => {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(provider.rating));

  if (compact) {
    return (
      <div className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50">
        <img src={provider.image} alt={provider.name} className="h-16 w-16 rounded-md object-cover shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-sm font-bold text-foreground truncate">{provider.name}</h3>
          <div className="flex items-center gap-1 mt-0.5">
            {stars.map((filled, i) => (
              <Star key={i} className={`h-3 w-3 ${filled ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            ))}
            <span className="text-[10px] text-muted-foreground font-body ml-1">({provider.reviewCount})</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-body truncate mt-0.5">{provider.address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-[0_0_24px_hsl(50_100%_50%/0.06)]">
      <div className="relative h-44 overflow-hidden">
        <img src={provider.image} alt={provider.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        {provider.openNow && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-sm bg-background/90 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-heading text-[10px] font-bold tracking-wider text-foreground">OPEN</span>
          </div>
        )}
        <ShareEarnButton listingId={String(provider.id)} listingPath={`/service-providers/${provider.id}`} category="service_providers" variant="card" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {provider.serviceTypes.map((s) => (
            <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
          ))}
          {provider.certifications.map((c) => (
            <Badge key={c} variant="accent" className="text-[10px]">{c}</Badge>
          ))}
        </div>
        <h3 className="font-heading text-base font-bold text-foreground">{provider.name}</h3>
        <div className="flex items-center gap-1">
          {stars.map((filled, i) => (
            <Star key={i} className={`h-4 w-4 ${filled ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          ))}
          <span className="text-sm font-heading font-bold text-foreground ml-1">{provider.rating}</span>
          <span className="text-xs text-muted-foreground font-body">({provider.reviewCount} reviews)</span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground font-body">
          <p className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{provider.address}</p>
          <p className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" />{provider.phone}</p>
        </div>
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="secondary" className="flex-1 gap-1">
            <Navigation className="h-3.5 w-3.5" /> Get Directions
          </Button>
          <Button size="sm" className="flex-1">View Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;
