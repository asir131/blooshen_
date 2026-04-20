import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import CarsFilterSidebar, { type Filters, defaultFilters } from "@/components/CarsFilterSidebar";
import CarListingCard from "@/components/CarListingCard";
import { useListings } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

type SortOption = "price-asc" | "price-desc" | "newest" | "mileage";

const ITEMS_PER_PAGE = 6;

const CarsForSale = () => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: listings = [], isLoading } = useListings("cars_for_sale");

  const filtered = useMemo(() => {
    let items = [...listings];

    if (filters.make !== "All") items = items.filter((c) => c.make === filters.make);
    items = items.filter((c) => c.year >= filters.yearRange[0] && c.year <= filters.yearRange[1]);
    items = items.filter((c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]);
    items = items.filter((c) => c.mileage >= filters.mileageRange[0] && c.mileage <= filters.mileageRange[1]);
    if (filters.bodyStyles.length > 0) items = items.filter((c) => filters.bodyStyles.includes(c.bodyStyle));
    if (filters.conditions.length > 0) items = items.filter((c) => filters.conditions.includes(c.condition));

    switch (sort) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "newest": items.sort((a, b) => b.year - a.year); break;
      case "mileage": items.sort((a, b) => a.mileage - b.mileage); break;
    }
    return items;
  }, [listings, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-3xl md:text-4xl font-black text-foreground">
            Cars for <span className="text-primary">Sale</span>
          </h1>
          <p className="text-muted-foreground font-body mt-1">Browse new, used, and certified vehicles.</p>
        </div>
      </div>

      <div className="container flex-1 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <CarsFilterSidebar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                </Button>
                <span className="text-sm text-muted-foreground font-body">
                  <span className="font-bold text-foreground">{filtered.length}</span> results
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-9 rounded-md border border-input bg-secondary px-3 text-xs text-foreground font-body focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="mileage">Mileage</option>
                </select>

                <div className="flex border border-border rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Listings */}
            {paged.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground font-body">
                No listings match your filters.
              </div>
            ) : (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "flex flex-col gap-4"
              }>
                {paged.map((listing) => (
                  <CarListingCard key={listing.id} listing={listing} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="w-9"
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="secondary"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileFilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <CarsFilterSidebar
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
        />
      </MobileFilterSheet>

      <Footer />
    </div>
  );
};

export default CarsForSale;