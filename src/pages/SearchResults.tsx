import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartSearchBar from "@/components/SmartSearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Car, Wrench, Store, Key, Users, CalendarDays, Star, MapPin,
  ArrowRight, SearchX, ChevronDown, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { mockListings, type CarListing } from "@/data/mockListings";
import { mockParts, type PartListing } from "@/data/mockParts";
import { mockProviders, type ServiceProvider } from "@/data/mockProviders";
import { mockRentals as rentalListings, type RentalListing } from "@/data/mockRentals";
import { mockExperts, mockReviews, type Expert, type Review } from "@/data/mockExperts";
import { mockEvents, type AutoEvent } from "@/data/mockEvents";

type CategoryKey = "cars" | "parts" | "services" | "rentals" | "experts" | "events";

interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: React.ElementType;
  color: string;
  link: string;
}

const categories: CategoryDef[] = [
  { key: "cars", label: "Cars for Sale", icon: Car, color: "bg-primary/15 text-primary", link: "/cars-for-sale" },
  { key: "parts", label: "Parts & Accessories", icon: Wrench, color: "bg-cta/15 text-cta", link: "/parts-accessories" },
  { key: "services", label: "Service Providers", icon: Store, color: "bg-success/15 text-success", link: "/service-providers" },
  { key: "rentals", label: "Rentals", icon: Key, color: "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]", link: "/rentals" },
  { key: "experts", label: "Experts & Reviews", icon: Users, color: "bg-[hsl(270_60%_60%)]/15 text-[hsl(270_60%_60%)]", link: "/reviews" },
  { key: "events", label: "Events & Meetups", icon: CalendarDays, color: "bg-destructive/15 text-destructive", link: "/events" },
];

function matchQuery(text: string, q: string): boolean {
  const lower = q.toLowerCase();
  return text.toLowerCase().includes(lower);
}

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [sort, setSort] = useState("relevance");

  // Filter across all data
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return { cars: [], parts: [], services: [], rentals: [], experts: [], events: [], reviews: [] };

    const cars = mockListings.filter((c) => matchQuery(`${c.year} ${c.make} ${c.model} ${c.trim || ""} ${c.bodyStyle} ${c.location}`, q));
    const parts = mockParts.filter((p) => matchQuery(`${p.name} ${p.category} ${p.compatibleVehicles.join(" ")}`, q));
    const services = mockProviders.filter((s) => matchQuery(`${s.name} ${s.serviceTypes.join(" ")} ${s.address}`, q));
    const rentals = rentalListings.filter((r) => matchQuery(`${r.year} ${r.make} ${r.model} ${r.vehicleType} ${r.ownerName}`, q));
    const experts = mockExperts.filter((e) => matchQuery(`${e.name} ${e.specialties.join(" ")} ${e.location}`, q));
    const events = mockEvents.filter((e) => matchQuery(`${e.title} ${e.eventType} ${e.location} ${e.organizer}`, q));
    const reviews = mockReviews.filter((r) => matchQuery(`${r.entityName} ${r.text}`, q));

    return { cars, parts, services, rentals, experts: [...experts, ...reviews.map(r => r)], events };
  }, [query]);

  const totalCount = results.cars.length + results.parts.length + results.services.length + results.rentals.length + results.experts.length + results.events.length;

  const sectionCounts: Record<CategoryKey, number> = {
    cars: results.cars.length,
    parts: results.parts.length,
    services: results.services.length,
    rentals: results.rentals.length,
    experts: results.experts.length,
    events: results.events.length,
  };

  const isEmpty = totalCount === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Top bar */}
      <section className="border-b border-border bg-card py-6">
        <div className="container space-y-4">
          <SmartSearchBar defaultValue={query} autoFocus />
          {query && (
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-bold">{totalCount}</span> results for "<span className="text-foreground">{query}</span>"
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-secondary text-foreground text-xs rounded px-3 py-1.5 border border-border font-heading uppercase tracking-wider"
              >
                <option value="relevance">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          )}
        </div>
      </section>

      <div className="container flex-1 py-8">
        {!query ? (
          <div className="text-center py-20 space-y-4">
            <SearchX className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Enter a search term</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Search across cars, parts, services, rentals, experts, and events on AutoWurx.</p>
          </div>
        ) : isEmpty ? (
          <EmptyState query={query} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile horizontal category pills */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn("shrink-0 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-colors min-h-[44px]", activeCategory === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}
              >
                All ({totalCount})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn("shrink-0 px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-colors min-h-[44px]", activeCategory === cat.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}
                >
                  {cat.label} ({sectionCounts[cat.key]})
                </button>
              ))}
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <Card className="border-border bg-card">
                <CardContent className="p-4 space-y-1">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={cn("w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors", activeCategory === "all" ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}
                  >
                    All Categories <span className="text-xs">{totalCount}</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={cn("w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors", activeCategory === cat.key ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}
                    >
                      <span className="flex items-center gap-2"><cat.icon className="h-3.5 w-3.5" /> {cat.label}</span>
                      <span className="text-xs">{sectionCounts[cat.key]}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </aside>


            {/* Results */}
            <div className="flex-1 space-y-8">
              {(activeCategory === "all" || activeCategory === "cars") && results.cars.length > 0 && (
                <ResultSection
                  cat={categories[0]}
                  count={results.cars.length}
                  showAll={activeCategory === "cars"}
                >
                  {(activeCategory === "cars" ? results.cars : results.cars.slice(0, 3)).map((c) => (
                    <CarResultCard key={c.id} car={c} />
                  ))}
                </ResultSection>
              )}

              {(activeCategory === "all" || activeCategory === "parts") && results.parts.length > 0 && (
                <ResultSection cat={categories[1]} count={results.parts.length} showAll={activeCategory === "parts"}>
                  {(activeCategory === "parts" ? results.parts : results.parts.slice(0, 3)).map((p) => (
                    <PartResultCard key={p.id} part={p} />
                  ))}
                </ResultSection>
              )}

              {(activeCategory === "all" || activeCategory === "services") && results.services.length > 0 && (
                <ResultSection cat={categories[2]} count={results.services.length} showAll={activeCategory === "services"}>
                  {(activeCategory === "services" ? results.services : results.services.slice(0, 3)).map((s) => (
                    <ServiceResultCard key={s.id} provider={s} />
                  ))}
                </ResultSection>
              )}

              {(activeCategory === "all" || activeCategory === "rentals") && results.rentals.length > 0 && (
                <ResultSection cat={categories[3]} count={results.rentals.length} showAll={activeCategory === "rentals"}>
                  {(activeCategory === "rentals" ? results.rentals : results.rentals.slice(0, 3)).map((r) => (
                    <RentalResultCard key={r.id} rental={r} />
                  ))}
                </ResultSection>
              )}

              {(activeCategory === "all" || activeCategory === "experts") && results.experts.length > 0 && (
                <ResultSection cat={categories[4]} count={results.experts.length} showAll={activeCategory === "experts"}>
                  {(activeCategory === "experts" ? results.experts : results.experts.slice(0, 3)).map((e, i) => (
                    "specialties" in e
                      ? <ExpertResultCard key={(e as Expert).id} expert={e as Expert} />
                      : <ReviewResultCard key={(e as Review).id} review={e as Review} />
                  ))}
                </ResultSection>
              )}

              {(activeCategory === "all" || activeCategory === "events") && results.events.length > 0 && (
                <ResultSection cat={categories[5]} count={results.events.length} showAll={activeCategory === "events"}>
                  {(activeCategory === "events" ? results.events : results.events.slice(0, 3)).map((e) => (
                    <EventResultCard key={e.id} event={e} />
                  ))}
                </ResultSection>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

/* ─── Section Wrapper ─── */
const ResultSection = ({ cat, count, showAll, children }: { cat: CategoryDef; count: number; showAll: boolean; children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge className={cn("text-[10px]", cat.color)}>{cat.label}</Badge>
        <span className="text-xs text-muted-foreground">{count} results</span>
      </div>
      {!showAll && count > 3 && (
        <Link to={cat.link} className="flex items-center gap-1 text-xs text-primary hover:underline font-heading font-bold uppercase tracking-wider">
          See all {count} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

/* ─── Result Cards ─── */
const CarResultCard = ({ car }: { car: CarListing }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <img src={car.image} alt="" className="h-16 w-24 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">{car.year} {car.make} {car.model} {car.trim}</h3>
        <p className="text-xs text-muted-foreground">{car.mileage.toLocaleString()} mi · {car.condition} · {car.location}</p>
      </div>
      <span className="font-heading font-bold text-primary text-lg shrink-0">${car.price.toLocaleString()}</span>
    </CardContent>
  </Card>
);

const PartResultCard = ({ part }: { part: PartListing }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <img src={part.image} alt="" className="h-16 w-24 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">{part.name}</h3>
        <p className="text-xs text-muted-foreground">{part.condition} · {part.category} · {part.sellerName}</p>
      </div>
      <span className="font-heading font-bold text-primary text-lg shrink-0">${part.price.toLocaleString()}</span>
    </CardContent>
  </Card>
);

const ServiceResultCard = ({ provider }: { provider: ServiceProvider }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <img src={provider.image} alt="" className="h-16 w-24 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">{provider.name}</h3>
        <p className="text-xs text-muted-foreground">{provider.serviceTypes.join(", ")} · {provider.address}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs text-foreground font-bold">{provider.rating}</span>
          <span className="text-xs text-muted-foreground">({provider.reviewCount})</span>
          {provider.openNow && <Badge className="bg-success/15 text-success text-[9px] ml-2">Open Now</Badge>}
        </div>
      </div>
    </CardContent>
  </Card>
);

const RentalResultCard = ({ rental }: { rental: RentalListing }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <div className="relative shrink-0">
        <img src={rental.image} alt="" className="h-16 w-24 rounded object-cover" />
        {rental.features.includes("Cash Accepted") && (
          <Badge className="absolute -top-1 -right-1 bg-success text-[8px] px-1 py-0 text-white">Cash OK</Badge>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">{rental.year} {rental.make} {rental.model}</h3>
        <p className="text-xs text-muted-foreground">{rental.vehicleType} · {rental.distance} mi away · {rental.ownerName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-bold text-foreground">{rental.rating}</span>
          {rental.availableNow && <Badge className="bg-success/15 text-success text-[9px]">Available Now</Badge>}
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="font-heading font-bold text-primary text-lg">${rental.dailyRate}</span>
        <span className="text-xs text-muted-foreground">/day</span>
      </div>
    </CardContent>
  </Card>
);

const ExpertResultCard = ({ expert }: { expert: Expert }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <Avatar className="h-12 w-12 shrink-0">
        <AvatarImage src={expert.photo} alt={expert.name} />
        <AvatarFallback className="bg-secondary text-foreground text-xs">{expert.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">{expert.name}</h3>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {expert.specialties.map((s) => <Badge key={s} variant="accent" className="text-[9px]">{s}</Badge>)}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{expert.location} · {expert.distance} mi</p>
      </div>
      <div className="text-right shrink-0">
        {expert.hourlyRate ? (
          <span className="font-heading font-bold text-foreground">${expert.hourlyRate}/hr</span>
        ) : (
          <span className="font-heading font-bold text-success text-sm">Free Consult</span>
        )}
      </div>
    </CardContent>
  </Card>
);

const ReviewResultCard = ({ review }: { review: Review }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
        <AvatarFallback className="bg-secondary text-xs">{review.reviewerName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{review.reviewerName} reviewed</span>
          <span className="font-heading font-bold text-primary text-sm">{review.entityName}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />)}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{review.text}</p>
      </div>
    </CardContent>
  </Card>
);

const EventResultCard = ({ event }: { event: AutoEvent }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors">
    <CardContent className="p-3 flex items-center gap-4">
      <img src={event.photo} alt="" className="h-16 w-24 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-bold text-foreground text-sm">{event.title}</h3>
        <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {event.time} · {event.location}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge className="text-[9px] bg-destructive/15 text-destructive">{event.eventType}</Badge>
          <span className="text-xs text-muted-foreground">{event.attending} attending</span>
          {event.isFree ? <span className="text-xs text-success font-bold">Free</span> : <span className="text-xs font-bold text-foreground">${event.price}</span>}
        </div>
      </div>
    </CardContent>
  </Card>
);

/* ─── Empty State ─── */
const EmptyState = ({ query }: { query: string }) => (
  <div className="text-center py-20 space-y-6 max-w-md mx-auto">
    <SearchX className="h-16 w-16 text-muted-foreground/30 mx-auto" />
    <div className="space-y-2">
      <h2 className="font-heading text-2xl font-bold text-foreground">No results for "{query}"</h2>
      <p className="text-muted-foreground">We couldn't find anything matching your search. Try these suggestions:</p>
    </div>
    <div className="space-y-3 text-left">
      <Card className="border-border bg-card">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-foreground font-medium">💡 Broaden your search</p>
          <p className="text-xs text-muted-foreground">Use fewer or more general keywords, like "sedan" instead of a specific model.</p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-foreground font-medium">🔧 Adjust your filters</p>
          <p className="text-xs text-muted-foreground">If you've narrowed to a specific category, try searching across all categories.</p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-foreground font-medium">📋 Post a "Wanted" listing</p>
          <p className="text-xs text-muted-foreground">Can't find what you need? Let the community know what you're looking for.</p>
        </CardContent>
      </Card>
    </div>
    <Button asChild className="bg-cta hover:bg-cta/85 text-cta-foreground">
      <Link to="/dashboard/new-listing"><Plus className="h-4 w-4 mr-1" /> Post a Wanted Listing</Link>
    </Button>
  </div>
);

export default SearchResults;
