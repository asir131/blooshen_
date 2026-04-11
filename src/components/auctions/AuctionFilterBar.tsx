import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";

const tabs = [
  "All", "Ending Soon", "No Reserve", "Under $5K",
  "Trucks & SUVs", "Classic Cars", "Parts & Accessories", "Rentals",
];

const sortOptions = [
  "Ending Soonest", "Highest Bid", "Most Bids", "Newly Listed", "No Reserve First",
];

interface Props {
  activeTab: string;
  setActiveTab: (t: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  count: number;
}

const AuctionFilterBar = ({ activeTab, setActiveTab, sortBy, setSortBy, viewMode, setViewMode, count }: Props) => (
  <div className="sticky top-16 z-30 bg-card border-b border-border">
    <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-colors",
              activeTab === t
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:border-primary border border-transparent"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sort + view */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-muted-foreground text-xs">{count} active auctions</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-secondary text-foreground text-xs font-heading border border-border rounded px-2 py-1"
        >
          {sortOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="flex gap-1">
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={cn("p-1.5 rounded", viewMode === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {v === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AuctionFilterBar;
