import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FeaturedVehicle, ExpertProfile } from "@/data/mockExpertProfile";

interface FeaturedVehiclesProps {
  vehicles: FeaturedVehicle[];
  expert: ExpertProfile;
  onAskExpert: (vehicle: FeaturedVehicle) => void;
}

export default function FeaturedVehicles({ vehicles, expert, onAskExpert }: FeaturedVehiclesProps) {
  return (
    <section className="bg-[#242424] py-16 px-4">
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-primary mb-2">Featured Selections</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">
          Hand-Picked by {expert.display_name}
        </h2>
        <div className="w-12 h-1 bg-primary rounded mb-3" />
        <p className="text-sm text-muted-foreground max-w-[600px] mb-2">
          Every vehicle below has been personally reviewed and recommended by {expert.display_name}. 
          Inquire through their profile and they'll earn a referral fee — at no extra cost to you.
        </p>

        {/* Affiliate disclosure */}
        <div className="flex items-start gap-2 bg-background border-l-2 border-primary px-3 py-2 rounded-r-md mb-8 max-w-[520px]">
          <span className="text-primary text-xs mt-0.5">ℹ</span>
          <span className="text-[11px] text-muted-foreground">
            This expert earns a referral fee if you purchase through their recommendations.
          </span>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors group">
              {/* Image */}
              <div className="relative">
                <img src={v.image_url} alt={`${v.year} ${v.make} ${v.model}`} className="w-full aspect-video object-cover" />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary text-primary-foreground text-[10px]">
                    <Star className="w-3 h-3 mr-0.5" /> Expert Pick
                  </Badge>
                </div>
                {v.is_cash_deal && (
                  <div className="absolute top-2 right-10">
                    <Badge className="bg-green-600 text-white text-[10px]">CA$H DEAL</Badge>
                  </div>
                )}
                <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">
                  <Heart className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Body */}
              <div className="p-3.5">
                <h3 className="text-sm font-bold text-foreground">{v.year} {v.make} {v.model}</h3>
                <p className="text-xs text-muted-foreground">{v.trim} · {v.mileage}</p>
                <p className="text-lg font-heading font-bold text-primary mt-1">${v.price.toLocaleString()}</p>
                <p className="text-xs text-primary/70 italic mt-1">"{v.expert_note}"</p>
                <Badge variant="outline" className="mt-2 text-[10px]">{v.category}</Badge>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-3.5 py-2.5 flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">
                  {v.seller_name} · {v.seller_location}
                </div>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 border-primary text-primary hover:bg-primary/10">
                    View Listing
                  </Button>
                  {/* Each click fires affiliate attribution:
                    promoter_id: expert.affiliate_id
                    listing_id: v.listing_id
                    source: 'expert_profile_featured' */}
                  <Button size="sm" className="text-[10px] h-7 px-2" onClick={() => onAskExpert(v)}>
                    Ask {expert.display_name.split(" ")[0]}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
