import { useState, useMemo } from "react";
import CashDealCard from "./CashDealCard";
import { cashDealListings } from "@/data/mockCashDeals";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const filterPills = ["All", "Cars", "Trucks", "SUVs", "Vans", "Under $5K", "Under $10K"];

const BrowseDeals = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState("score");

  const filtered = useMemo(() => {
    let list = [...cashDealListings];
    if (activeFilter === "Cars") list = list.filter((l) => l.bodyType === "Car");
    else if (activeFilter === "Trucks") list = list.filter((l) => l.bodyType === "Truck");
    else if (activeFilter === "SUVs") list = list.filter((l) => l.bodyType === "SUV");
    else if (activeFilter === "Vans") list = list.filter((l) => l.bodyType === "Van");
    else if (activeFilter === "Under $5K") list = list.filter((l) => l.askingPrice < 5000);
    else if (activeFilter === "Under $10K") list = list.filter((l) => l.askingPrice < 10000);

    if (sort === "price-asc") list.sort((a, b) => a.askingPrice - b.askingPrice);
    else if (sort === "price-desc") list.sort((a, b) => b.askingPrice - a.askingPrice);
    else if (sort === "score") list.sort((a, b) => b.dealScore - a.dealScore);
    else if (sort === "distance") list.sort((a, b) => a.distance - b.distance);

    return list;
  }, [activeFilter, sort]);

  return (
    <section id="browse-section" className="bg-[hsl(var(--background))] py-12 md:py-16">
      <div className="max-w-[1100px] mx-auto px-4">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filterPills.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{filtered.length} listings</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Best Deal Score</SelectItem>
                <SelectItem value="price-asc">Price: Low-High</SelectItem>
                <SelectItem value="price-desc">Price: High-Low</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((l) => (
            <CashDealCard key={l.id} listing={l} />
          ))}
        </div>

        <div className="text-center mt-10 space-y-3">
          <Button variant="outline" size="lg">Load More Listings</Button>
          <p className="text-xs text-muted-foreground">Showing {filtered.length} of 847 cash listings near you</p>
          <a href="/sell?type=cash" className="text-xs text-primary hover:underline">List Your Ca$h Deal Free →</a>
        </div>
      </div>
    </section>
  );
};

export default BrowseDeals;
