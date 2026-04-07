import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, TrendingUp, Car, Wrench, Store, Key, Users, CalendarDays, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const recentSearches = ["BMW M4", "oil change near me", "SUV rentals near 77002", "brake pads"];

const popularCategories = [
  { label: "Cars for Sale", icon: Car },
  { label: "Parts & Accessories", icon: Wrench },
  { label: "Service Providers", icon: Store },
  { label: "Rentals", icon: Key },
  { label: "Experts & Reviews", icon: Users },
  { label: "Events & Meetups", icon: CalendarDays },
];

const liveSuggestions = [
  { text: "SUV rentals near 20755", category: "Rentals" },
  { text: "Truck rentals in Houston", category: "Rentals" },
  { text: "BMW parts for sale", category: "Parts" },
  { text: "mechanic near me", category: "Service" },
  { text: "car show this weekend", category: "Events" },
  { text: "pre-purchase inspection", category: "Experts" },
  { text: "Ford Mustang for sale", category: "Cars" },
  { text: "ceramic coating service", category: "Service" },
  { text: "convertible rental weekend", category: "Rentals" },
  { text: "exhaust system install", category: "Parts" },
];

interface SmartSearchBarProps {
  className?: string;
  defaultValue?: string;
  autoFocus?: boolean;
}

const SmartSearchBar = ({ className, defaultValue = "", autoFocus = false }: SmartSearchBarProps) => {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return liveSuggestions.filter((s) => s.text.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query]);

  const submit = (q: string) => {
    if (!q.trim()) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const showDropdown = open && query.length === 0;
  const showSuggestions = open && query.length > 0 && filtered.length > 0;

  return (
    <div ref={ref} className={cn("relative w-full max-w-xl", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(query); }}
          placeholder="Search cars, parts, services, rentals..."
          className="pl-10 pr-9 h-11"
          autoFocus={autoFocus}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown — empty state */}
      {showDropdown && (
        <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
          {recentSearches.length > 0 && (
            <div className="p-3 border-b border-border">
              <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground mb-2">Recent Searches</p>
              {recentSearches.map((s) => (
                <button key={s} onClick={() => submit(s)} className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-sm text-foreground hover:bg-secondary rounded transition-colors">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {s}
                </button>
              ))}
            </div>
          )}
          <div className="p-3">
            <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-muted-foreground mb-2">Popular Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {popularCategories.map((c) => (
                <button key={c.label} onClick={() => submit(c.label)} className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:bg-secondary rounded transition-colors">
                  <c.icon className="h-3.5 w-3.5 text-primary" /> {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl overflow-hidden">
          {filtered.map((s) => (
            <button key={s.text} onClick={() => submit(s.text)} className="flex items-center justify-between gap-2 w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                {s.text}
              </span>
              <span className="text-[10px] text-muted-foreground font-heading uppercase">{s.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearchBar;
