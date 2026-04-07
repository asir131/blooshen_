import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import ProviderFilterSidebar, { type ProviderFilters, defaultProviderFilters } from "@/components/ProviderFilterSidebar";
import ProviderCard from "@/components/ProviderCard";
import { mockProviders } from "@/data/mockProviders";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Map, SlidersHorizontal, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

type SortOption = "rating" | "distance" | "reviews" | "name";
type ViewMode = "grid" | "list" | "map";
const ITEMS_PER_PAGE = 9;

const ServiceProviders = () => {
  const [filters, setFilters] = useState<ProviderFilters>(defaultProviderFilters);
  const [sort, setSort] = useState<SortOption>("rating");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = [...mockProviders];
    if (filters.serviceTypes.length > 0) items = items.filter((p) => p.serviceTypes.some((s) => filters.serviceTypes.includes(s)));
    if (filters.minRating > 0) items = items.filter((p) => p.rating >= filters.minRating);
    if (filters.certifications.length > 0) items = items.filter((p) => filters.certifications.some((c) => p.certifications.includes(c)));
    if (filters.openNow) items = items.filter((p) => p.openNow);
    items = items.filter((p) => p.distance <= filters.radius);

    switch (sort) {
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      case "distance": items.sort((a, b) => a.distance - b.distance); break;
      case "reviews": items.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "name": items.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return items;
  }, [filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const isMapView = viewMode === "map";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Service <span className="text-primary">Providers</span>
          </h1>
          <p className="text-muted-foreground font-body mt-1">Local mechanics, shops, and specialists near you.</p>
        </div>
      </div>

      <div className="container flex-1 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <ProviderFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
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
                  <span className="font-bold text-foreground">{filtered.length}</span> providers found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="h-9 rounded-md border border-input bg-secondary px-3 text-xs text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="rating">Top Rated</option>
                  <option value="distance">Nearest</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name A–Z</option>
                </select>
                <div className="hidden md:flex border border-border rounded-md overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <List className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("map")} className={`p-2 transition-colors ${viewMode === "map" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <Map className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {isMapView ? (
              /* Map view — hide compact list on mobile */
              <div className="flex gap-4 min-h-[500px]">
                <div className="flex-1 rounded-lg border border-border bg-card flex flex-col items-center justify-center text-center p-8">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">MAP VIEW</h3>
                  <p className="text-sm text-muted-foreground font-body max-w-xs">
                    Interactive map coming soon. Provider pins will appear here based on your search location.
                  </p>
                </div>
                <div className="hidden md:block w-80 shrink-0 space-y-2 overflow-y-auto max-h-[600px]">
                  {filtered.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} compact />
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground font-body text-center py-8">No providers found.</p>
                  )}
                </div>
              </div>
            ) : (
              /* Grid / List view */
              <>
                {paged.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-muted-foreground font-body">No providers match your filters.</div>
                ) : (
                  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
                    {paged.map((provider) => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="secondary" size="icon" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button key={p} variant={p === currentPage ? "default" : "secondary"} size="sm" onClick={() => setPage(p)} className="w-9">{p}</Button>
                    ))}
                    <Button variant="secondary" size="icon" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile floating map toggle */}
      {!isMapView && (
        <button
          onClick={() => setViewMode("map")}
          className="fixed bottom-20 right-4 z-40 md:hidden h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <Map className="h-5 w-5" />
        </button>
      )}
      {isMapView && (
        <button
          onClick={() => setViewMode("grid")}
          className="fixed bottom-20 right-4 z-40 md:hidden h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
      )}

      <MobileFilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <ProviderFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
      </MobileFilterSheet>

      <Footer />
    </div>
  );
};

export default ServiceProviders;