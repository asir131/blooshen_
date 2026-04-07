import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import RentalFilterSidebar, { type RentalFilters, defaultRentalFilters } from "@/components/RentalFilterSidebar";
import RentalCard from "@/components/RentalCard";
import { mockRentals } from "@/data/mockRentals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Map, SlidersHorizontal, ChevronLeft, ChevronRight, MapPin, Banknote, ShieldCheck, Users } from "lucide-react";

type SortOption = "price-asc" | "newest" | "top-rated" | "closest";
type ViewMode = "grid" | "list" | "map";
const PER_PAGE = 6;

const Rentals = () => {
  const [filters, setFilters] = useState<RentalFilters>(defaultRentalFilters);
  const [sort, setSort] = useState<SortOption>("top-rated");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = [...mockRentals];
    if (filters.vehicleTypes.length) items = items.filter((r) => filters.vehicleTypes.includes(r.vehicleType));
    items = items.filter((r) => r.dailyRate >= filters.priceRange[0] && r.dailyRate <= filters.priceRange[1]);
    if (filters.ownerTypes.length) items = items.filter((r) => filters.ownerTypes.includes(r.ownerType));
    if (filters.features.length) items = items.filter((r) => filters.features.every((f) => r.features.includes(f)));
    if (filters.minRating > 0) items = items.filter((r) => r.rating >= filters.minRating);
    items = items.filter((r) => r.distance <= filters.radius);

    switch (sort) {
      case "price-asc": items.sort((a, b) => a.dailyRate - b.dailyRate); break;
      case "newest": items.sort((a, b) => b.year - a.year); break;
      case "top-rated": items.sort((a, b) => b.rating - a.rating); break;
      case "closest": items.sort((a, b) => a.distance - b.distance); break;
    }
    return items;
  }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const isMap = viewMode === "map";

  const benefits = [
    { icon: Banknote, label: "Cash Accepted" },
    { icon: ShieldCheck, label: "No Hidden Fees" },
    { icon: Users, label: "Local Owners" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Rent Local. <span className="text-primary">Skip the Counter.</span>
          </h1>
          <p className="text-muted-foreground font-body mt-1 max-w-xl">
            Fast, easy, and cash car rentals from people and small businesses near you.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="inline-flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/10 px-3 py-1.5">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-heading text-xs font-bold tracking-wider text-primary">{b.label.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container flex-1 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <RentalFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                </Button>
                <span className="text-sm text-muted-foreground font-body">
                  <span className="font-bold text-foreground">{filtered.length}</span> rentals
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-cta hover:bg-cta/90 text-foreground font-heading font-bold tracking-wider">
                  List Your Vehicle
                </Button>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="h-9 rounded-md border border-input bg-secondary px-3 text-xs text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="top-rated">Top Rated</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="newest">Newest Listings</option>
                  <option value="closest">Closest First</option>
                </select>
                <div className="flex border border-border rounded-md overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="h-4 w-4" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}><List className="h-4 w-4" /></button>
                  <button onClick={() => setViewMode("map")} className={`p-2 transition-colors ${viewMode === "map" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}><Map className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {isMap ? (
              <div className="flex gap-4 min-h-[500px]">
                <div className="flex-1 rounded-lg border border-border bg-card flex flex-col items-center justify-center text-center p-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">MAP VIEW</h3>
                  <p className="text-sm text-muted-foreground font-body max-w-xs">Interactive map coming soon. Rental pins will appear here based on your search location.</p>
                </div>
                <div className="w-80 shrink-0 space-y-3 overflow-y-auto max-h-[600px]">
                  {filtered.map((r) => (
                    <div key={r.id} className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50">
                      <img src={r.image} alt={`${r.year} ${r.make} ${r.model}`} className="h-16 w-16 rounded-md object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-sm font-bold text-foreground truncate">{r.year} {r.make} {r.model}</h4>
                        <p className="font-heading text-base font-black text-primary">${r.dailyRate}/day</p>
                        <p className="text-[11px] text-muted-foreground font-body">{r.distance} mi away</p>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-8">No rentals found.</p>}
                </div>
              </div>
            ) : (
              <>
                {paged.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-muted-foreground font-body">No rentals match your filters.</div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
                    {paged.map((r) => <RentalCard key={r.id} listing={r} viewMode={viewMode} />)}
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="secondary" size="icon" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button key={p} variant={p === currentPage ? "default" : "secondary"} size="sm" onClick={() => setPage(p)} className="w-9">{p}</Button>
                    ))}
                    <Button variant="secondary" size="icon" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <MobileFilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <RentalFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
      </MobileFilterSheet>

      <Footer />
    </div>
  );
};

export default Rentals;