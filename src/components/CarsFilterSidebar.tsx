import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";

const makes = ["All", "Audi", "BMW", "Chevrolet", "Ford", "Honda", "Jeep", "Mazda", "Mercedes-Benz", "Porsche", "Ram", "Tesla", "Toyota"];
const bodyStyles = ["Sedan", "SUV", "Truck", "Coupe", "Convertible", "Van"];
const conditions = ["New", "Used", "Certified"];

export interface Filters {
  make: string;
  yearRange: [number, number];
  priceRange: [number, number];
  mileageRange: [number, number];
  bodyStyles: string[];
  conditions: string[];
  zip: string;
}

export const defaultFilters: Filters = {
  make: "All",
  yearRange: [2018, 2024],
  priceRange: [0, 150000],
  mileageRange: [0, 100000],
  bodyStyles: [],
  conditions: [],
  zip: "",
};

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const CarsFilterSidebar = ({ filters, onChange, onClose, isMobile }: Props) => {
  const update = (partial: Partial<Filters>) => onChange({ ...filters, ...partial });

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <aside className={`space-y-6 ${isMobile ? "" : "sticky top-20"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="font-heading text-lg font-bold text-foreground">FILTERS</h3>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        )}
      </div>

      {/* Make */}
      <div className="space-y-2">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">MAKE</Label>
        <select
          value={filters.make}
          onChange={(e) => update({ make: e.target.value })}
          className="w-full h-10 rounded-md border border-input bg-secondary px-3 text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Year */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">
          YEAR: {filters.yearRange[0]} – {filters.yearRange[1]}
        </Label>
        <Slider
          min={2010}
          max={2024}
          step={1}
          value={filters.yearRange}
          onValueChange={(v) => update({ yearRange: v as [number, number] })}
          className="mt-1"
        />
      </div>

      {/* Price */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">
          PRICE: ${filters.priceRange[0].toLocaleString()} – ${filters.priceRange[1].toLocaleString()}
        </Label>
        <Slider
          min={0}
          max={150000}
          step={5000}
          value={filters.priceRange}
          onValueChange={(v) => update({ priceRange: v as [number, number] })}
        />
      </div>

      {/* Mileage */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">
          MILEAGE: {filters.mileageRange[0].toLocaleString()} – {filters.mileageRange[1].toLocaleString()} mi
        </Label>
        <Slider
          min={0}
          max={100000}
          step={5000}
          value={filters.mileageRange}
          onValueChange={(v) => update({ mileageRange: v as [number, number] })}
        />
      </div>

      {/* Body Style */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">BODY STYLE</Label>
        <div className="space-y-2">
          {bodyStyles.map((bs) => (
            <label key={bs} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.bodyStyles.includes(bs)}
                onCheckedChange={() => update({ bodyStyles: toggleArray(filters.bodyStyles, bs) })}
              />
              <span className="text-sm font-body text-foreground">{bs}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">CONDITION</Label>
        <div className="space-y-2">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.conditions.includes(c)}
                onCheckedChange={() => update({ conditions: toggleArray(filters.conditions, c) })}
              />
              <span className="text-sm font-body text-foreground">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Zip */}
      <div className="space-y-2">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">ZIP CODE</Label>
        <Input
          placeholder="Enter zip code"
          value={filters.zip}
          onChange={(e) => update({ zip: e.target.value })}
          maxLength={5}
        />
      </div>

      {/* Reset */}
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => onChange(defaultFilters)}
      >
        Reset Filters
      </Button>
    </aside>
  );
};

export default CarsFilterSidebar;