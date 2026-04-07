import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";

const serviceTypes = [
  "General Repair", "Transmission", "Body Shop", "Tag & Title", "Detailing",
  "Tires", "Oil Change", "Custom/Performance", "Towing", "Mobile Mechanic",
];
const certOptions = ["ASE Certified", "AAA Approved"];
const ratingOptions = [
  { label: "4+ Stars", value: 4 },
  { label: "3+ Stars", value: 3 },
];

export interface ProviderFilters {
  serviceTypes: string[];
  zip: string;
  radius: number;
  minRating: number;
  certifications: string[];
  openNow: boolean;
}

export const defaultProviderFilters: ProviderFilters = {
  serviceTypes: [],
  zip: "",
  radius: 25,
  minRating: 0,
  certifications: [],
  openNow: false,
};

interface Props {
  filters: ProviderFilters;
  onChange: (f: ProviderFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const toggleArr = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const ProviderFilterSidebar = ({ filters, onChange, onClose, isMobile }: Props) => {
  const update = (partial: Partial<ProviderFilters>) => onChange({ ...filters, ...partial });

  return (
    <aside className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">FILTERS</h3>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        )}
      </div>

      {/* Service Type */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">SERVICE TYPE</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {serviceTypes.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.serviceTypes.includes(s)} onCheckedChange={() => update({ serviceTypes: toggleArr(filters.serviceTypes, s) })} />
              <span className="text-sm font-body text-foreground">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">NEAR ME</Label>
        <Input placeholder="Enter zip code" value={filters.zip} onChange={(e) => update({ zip: e.target.value })} maxLength={5} />
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">
          RADIUS: {filters.radius} mi
        </Label>
        <Slider min={5} max={50} step={5} value={[filters.radius]} onValueChange={(v) => update({ radius: v[0] })} />
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">MINIMUM RATING</Label>
        <div className="space-y-2">
          {ratingOptions.map((r) => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.minRating === r.value}
                onCheckedChange={(checked) => update({ minRating: checked ? r.value : 0 })}
              />
              <span className="text-sm font-body text-foreground">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">CERTIFICATIONS</Label>
        <div className="space-y-2">
          {certOptions.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.certifications.includes(c)} onCheckedChange={() => update({ certifications: toggleArr(filters.certifications, c) })} />
              <span className="text-sm font-body text-foreground">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Open Now */}
      <div className="flex items-center justify-between">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">OPEN NOW</Label>
        <Switch checked={filters.openNow} onCheckedChange={(v) => update({ openNow: v })} />
      </div>

      <Button variant="secondary" className="w-full" onClick={() => onChange(defaultProviderFilters)}>
        Reset Filters
      </Button>
    </aside>
  );
};

export default ProviderFilterSidebar;