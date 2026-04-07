import { useState } from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SlidersHorizontal, X, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const vehicleTypes = ["Car", "Truck", "Van", "SUV", "Convertible", "Luxury", "Electric/Hybrid", "Cargo Van", "Moving Truck"];
const ownerTypes = ["Individual Owner", "Small Business", "Fleet Operator"];
const featureOptions = ["Cash Accepted", "Pet Friendly", "Long-Term OK", "Delivery Available", "Airport Pickup"];
const ratingOptions = [
  { label: "4+ Stars", value: 4 },
  { label: "3+ Stars", value: 3 },
  { label: "Any", value: 0 },
];

export interface RentalFilters {
  vehicleTypes: string[];
  priceRange: [number, number];
  pickupDate: Date | undefined;
  returnDate: Date | undefined;
  zip: string;
  radius: number;
  ownerTypes: string[];
  features: string[];
  minRating: number;
}

export const defaultRentalFilters: RentalFilters = {
  vehicleTypes: [],
  priceRange: [0, 200],
  pickupDate: undefined,
  returnDate: undefined,
  zip: "",
  radius: 25,
  ownerTypes: [],
  features: [],
  minRating: 0,
};

interface Props {
  filters: RentalFilters;
  onChange: (f: RentalFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const toggle = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const RentalFilterSidebar = ({ filters, onChange, onClose, isMobile }: Props) => {
  const update = (partial: Partial<RentalFilters>) => onChange({ ...filters, ...partial });

  const DateButton = ({ date, label, onSelect }: { date: Date | undefined; label: string; onSelect: (d: Date | undefined) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className={cn("w-full justify-start text-left text-sm font-body", !date && "text-muted-foreground")}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          {date ? format(date, "MMM d, yyyy") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onSelect} initialFocus className={cn("p-3 pointer-events-auto")} disabled={(d) => d < new Date()} />
      </PopoverContent>
    </Popover>
  );

  return (
    <aside className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">FILTERS</h3>
        </div>
        {isMobile && onClose && <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>}
      </div>

      {/* Vehicle Type */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">VEHICLE TYPE</Label>
        <div className="space-y-2 max-h-52 overflow-y-auto">
          {vehicleTypes.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.vehicleTypes.includes(t)} onCheckedChange={() => update({ vehicleTypes: toggle(filters.vehicleTypes, t) })} />
              <span className="text-sm font-body text-foreground">{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price per day */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">
          PRICE / DAY: ${filters.priceRange[0]} – ${filters.priceRange[1]}
        </Label>
        <Slider min={0} max={200} step={5} value={filters.priceRange} onValueChange={(v) => update({ priceRange: v as [number, number] })} />
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">AVAILABILITY</Label>
        <DateButton date={filters.pickupDate} label="Pick-up date" onSelect={(d) => update({ pickupDate: d })} />
        <DateButton date={filters.returnDate} label="Return date" onSelect={(d) => update({ returnDate: d })} />
      </div>

      {/* Distance */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">NEAR ME</Label>
        <Input placeholder="Zip code" value={filters.zip} onChange={(e) => update({ zip: e.target.value })} maxLength={5} />
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">RADIUS: {filters.radius} mi</Label>
        <Slider min={5} max={50} step={5} value={[filters.radius]} onValueChange={(v) => update({ radius: v[0] })} />
      </div>

      {/* Owner Type */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">OWNER TYPE</Label>
        <div className="space-y-2">
          {ownerTypes.map((o) => (
            <label key={o} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.ownerTypes.includes(o)} onCheckedChange={() => update({ ownerTypes: toggle(filters.ownerTypes, o) })} />
              <span className="text-sm font-body text-foreground">{o}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">FEATURES</Label>
        <div className="space-y-2">
          {featureOptions.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.features.includes(f)} onCheckedChange={() => update({ features: toggle(filters.features, f) })} />
              <span className="text-sm font-body text-foreground">{f}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">MIN RATING</Label>
        <div className="space-y-2">
          {ratingOptions.map((r) => (
            <label key={r.value} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.minRating === r.value} onCheckedChange={(checked) => update({ minRating: checked ? r.value : 0 })} />
              <span className="text-sm font-body text-foreground">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="secondary" className="w-full" onClick={() => onChange(defaultRentalFilters)}>Reset Filters</Button>
    </aside>
  );
};

export default RentalFilterSidebar;