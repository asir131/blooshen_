import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Megaphone, TrendingUp, Flame, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ListingCategory } from "@/data/mockDashboard";

const standardRates: Record<ListingCategory, { amount: number; per: string }> = {
  "Cars for Sale": { amount: 25, per: "lead" },
  "Parts & Accessories": { amount: 8, per: "sale (8%)" },
  "Service Providers": { amount: 10, per: "lead" },
  "Rentals": { amount: 12, per: "booking (12%)" },
  "Neighborhood Experts": { amount: 8, per: "lead" },
  "Events & Meetups": { amount: 5, per: "RSVP" },
};

const maxBoost: Record<ListingCategory, number> = {
  "Cars for Sale": 200,
  "Parts & Accessories": 50,
  "Service Providers": 75,
  "Rentals": 100,
  "Neighborhood Experts": 50,
  "Events & Meetups": 50,
};

interface PromoterBoostFieldsProps {
  category: ListingCategory;
}

const PromoterBoostFields = ({ category }: PromoterBoostFieldsProps) => {
  const rate = standardRates[category];
  const [enabled, setEnabled] = useState(true);
  const [boostedAmount, setBoostedAmount] = useState(rate.amount);
  const [hasBudgetCap, setHasBudgetCap] = useState(false);
  const [budgetCap, setBudgetCap] = useState("");
  const [featured, setFeatured] = useState(false);

  const isBoosted = boostedAmount > rate.amount;
  const max = maxBoost[category];

  return (
    <div className="space-y-5 border-t border-border pt-5">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-cta" />
        <h4 className="font-heading font-bold text-foreground text-sm">Boost Your Listing with Promoters</h4>
      </div>

      {/* Main toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">Allow promoters to earn commissions on this listing</p>
          <p className="text-xs text-muted-foreground">Promoters will share your listing and drive traffic</p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      {enabled && (
        <div className="space-y-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Standard rate display */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-1">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Standard Commission</p>
            <p className="text-lg font-bold text-foreground">
              ${rate.amount} <span className="text-sm font-normal text-muted-foreground">per {rate.per}</span>
            </p>
          </div>

          {/* Boost slider */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cta" />
              <label className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">
                Increase commission to attract more promoters
              </label>
            </div>
            <Slider
              value={[boostedAmount]}
              onValueChange={([v]) => setBoostedAmount(v)}
              min={rate.amount}
              max={max}
              step={rate.amount < 15 ? 1 : 5}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">${rate.amount} (standard)</span>
              <span className={cn("text-sm font-bold", isBoosted ? "text-cta" : "text-foreground")}>
                ${boostedAmount}/{rate.per}
              </span>
              <span className="text-sm text-muted-foreground">${max} (max)</span>
            </div>

            {isBoosted && (
              <div className="rounded-md bg-cta/10 border border-cta/20 p-3 flex items-start gap-2">
                <Flame className="h-4 w-4 text-cta shrink-0 mt-0.5" />
                <p className="text-xs text-cta">
                  At ${boostedAmount}/{rate.per}, your listing will appear near the top of the promoter marketplace and attract more shares.
                </p>
              </div>
            )}
          </div>

          {/* Budget cap */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Set a max budget for commissions</span>
              </div>
              <Switch checked={hasBudgetCap} onCheckedChange={setHasBudgetCap} />
            </div>
            {hasBudgetCap && (
              <div className="flex gap-3 items-center animate-in fade-in-0 duration-150">
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">total budget — commissions pause when reached</span>
              </div>
            )}
          </div>

          {/* Featured marketplace toggle */}
          <div className="flex items-center justify-between rounded-lg border border-cta/30 bg-cta/5 p-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">Feature in Promoter Marketplace</p>
                <Badge className="bg-cta/15 text-cta text-[10px]">Hot Deal</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Get a "Hot Deal" badge and appear at the top of the promoter gig grid
              </p>
            </div>
            <Switch checked={featured} onCheckedChange={setFeatured} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoterBoostFields;
