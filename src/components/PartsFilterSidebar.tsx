import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, X } from "lucide-react";

const categories = ["Engine", "Suspension", "Brakes", "Electrical", "Body/Exterior", "Interior", "Wheels/Tires", "Tools"];
const conditions = ["New", "Used", "Refurbished", "OEM", "Aftermarket"];
const sellerTypes = ["Individual", "Shop", "Dealer"];

const vehicleMakes = ["Any", "Audi", "BMW", "Chevrolet", "Ford", "Honda", "Jeep", "Mercedes-Benz", "Porsche", "Ram", "Tesla", "Toyota"];
const modelsByMake: Record<string, string[]> = {
  Audi: ["RS5", "A4", "Q5"], BMW: ["M3", "M4", "X5"], Chevrolet: ["Corvette", "Camaro", "Silverado"],
  Ford: ["Mustang", "F-150", "Bronco"], Honda: ["Civic", "Accord", "Odyssey"], Jeep: ["Wrangler", "Grand Cherokee"],
  "Mercedes-Benz": ["C63 AMG", "E-Class", "GLE"], Porsche: ["911", "Cayenne", "Macan"], Ram: ["1500", "2500"],
  Tesla: ["Model 3", "Model Y", "Model S"], Toyota: ["4Runner", "Tacoma", "Supra"],
};
const years = Array.from({ length: 16 }, (_, i) => 2024 - i);

export interface PartsFilters {
  categories: string[];
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  conditions: string[];
  priceRange: [number, number];
  sellerTypes: string[];
}

export const defaultPartsFilters: PartsFilters = {
  categories: [],
  vehicleMake: "Any",
  vehicleModel: "",
  vehicleYear: "",
  conditions: [],
  priceRange: [0, 10000],
  sellerTypes: [],
};

interface Props {
  filters: PartsFilters;
  onChange: (f: PartsFilters) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const toggleArr = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const PartsFilterSidebar = ({ filters, onChange, onClose, isMobile }: Props) => {
  const update = (partial: Partial<PartsFilters>) => onChange({ ...filters, ...partial });
  const models = filters.vehicleMake !== "Any" ? modelsByMake[filters.vehicleMake] ?? [] : [];

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

      {/* Category */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">CATEGORY</Label>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.categories.includes(c)} onCheckedChange={() => update({ categories: toggleArr(filters.categories, c) })} />
              <span className="text-sm font-body text-foreground">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Compatible Vehicle */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">COMPATIBLE VEHICLE</Label>
        <select value={filters.vehicleMake} onChange={(e) => update({ vehicleMake: e.target.value, vehicleModel: "", vehicleYear: "" })} className="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring">
          {vehicleMakes.map((m) => <option key={m}>{m}</option>)}
        </select>
        {models.length > 0 && (
          <select value={filters.vehicleModel} onChange={(e) => update({ vehicleModel: e.target.value, vehicleYear: "" })} className="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">All Models</option>
            {models.map((m) => <option key={m}>{m}</option>)}
          </select>
        )}
        {filters.vehicleModel && (
          <select value={filters.vehicleYear} onChange={(e) => update({ vehicleYear: e.target.value })} className="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">All Years</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        )}
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">CONDITION</Label>
        <div className="space-y-2">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.conditions.includes(c)} onCheckedChange={() => update({ conditions: toggleArr(filters.conditions, c) })} />
              <span className="text-sm font-body text-foreground">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">
          PRICE: ${filters.priceRange[0].toLocaleString()} – ${filters.priceRange[1].toLocaleString()}
        </Label>
        <Slider min={0} max={10000} step={100} value={filters.priceRange} onValueChange={(v) => update({ priceRange: v as [number, number] })} />
      </div>

      {/* Seller Type */}
      <div className="space-y-3">
        <Label className="font-heading text-xs tracking-wider text-muted-foreground">SELLER TYPE</Label>
        <div className="space-y-2">
          {sellerTypes.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={filters.sellerTypes.includes(s)} onCheckedChange={() => update({ sellerTypes: toggleArr(filters.sellerTypes, s) })} />
              <span className="text-sm font-body text-foreground">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <Button variant="secondary" className="w-full" onClick={() => onChange(defaultPartsFilters)}>
        Reset Filters
      </Button>
    </aside>
  );
};

export default PartsFilterSidebar;