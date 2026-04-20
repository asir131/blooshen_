import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import PartsFilterSidebar, { type PartsFilters, defaultPartsFilters } from "@/components/PartsFilterSidebar";
import PartListingCard from "@/components/PartListingCard";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

type SortOption = "price-asc" | "price-desc" | "newest" | "name";
const ITEMS_PER_PAGE = 9;

const PartsAndAccessories = () => {
  const [filters, setFilters] = useState<PartsFilters>(defaultPartsFilters);
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: parts = [] } = useListings("parts_accessories");

  const filtered = useMemo(() => {
    let items = [...parts];
    if (filters.categories.length > 0) items = items.filter((p) => filters.categories.includes(p.category));
    if (filters.conditions.length > 0) items = items.filter((p) => filters.conditions.includes(p.condition));
    if (filters.sellerTypes.length > 0) items = items.filter((p) => filters.sellerTypes.includes(p.sellerType));
    items = items.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "name": items.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return items;
  }, [parts, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Parts & <span className="text-primary">Accessories</span>
          </h1>
          <p className="text-muted-foreground font-body mt-1">OEM, aftermarket, and used parts for every build.</p>
        </div>
      </div>

      <div className="container flex-1 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <PartsFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
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
                  <span className="font-bold text-foreground">{filtered.length}</span> results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="h-9 rounded-md border border-input bg-secondary px-3 text-xs text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name">Name A–Z</option>
                </select>
                <div className="flex border border-border rounded-md overflow-hidden">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {paged.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground font-body">No parts match your filters.</div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
                {paged.map((part) => (
                  <PartListingCard key={part.id} listing={part} viewMode={viewMode} />
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
          </div>
        </div>
      </div>

      <MobileFilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <PartsFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
      </MobileFilterSheet>

      <Footer />
    </div>
  );
};

export default PartsAndAccessories;