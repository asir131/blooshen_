import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, ThumbsUp, MessageCircle, Search, Filter, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import ShareEarnButton from "@/components/ShareEarnButton";
import { mockExperts, mockReviews, allSpecialties, type Expert, type Review } from "@/data/mockExperts";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

const RatingStars = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
  const cls = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${cls} ${s <= Math.round(rating) ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
};

/* ─── Aggregate Rating Widget ─── */
const AggregateRating = ({ reviews }: { reviews: Review[] }) => {
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const max = Math.max(...dist.map((d) => d.count), 1);

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
        <div className="text-center shrink-0">
          <p className="text-5xl font-heading font-bold text-foreground">{avg.toFixed(1)}</p>
          <RatingStars rating={avg} size="lg" />
          <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 w-full space-y-1.5">
          {dist.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-muted-foreground">{d.star}</span>
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(d.count / max) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-muted-foreground">{d.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── Expert Card ─── */
const ExpertCard = ({ expert }: { expert: Expert }) => (
  <Card className="border-border bg-card hover:border-primary/40 transition-colors relative overflow-hidden">
    <ShareEarnButton listingId={expert.id} listingPath={`/reviews/experts/${expert.id}`} category="neighborhood_experts" variant="card" />
    <CardContent className="p-5 flex flex-col items-center text-center gap-3">
      <Avatar className="h-20 w-20">
        <AvatarImage src={expert.photo} alt={expert.name} />
        <AvatarFallback className="bg-secondary text-foreground font-heading">
          {expert.name.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-heading text-lg font-bold text-foreground">{expert.name}</h3>
        <div className="flex items-center justify-center gap-1 mt-1">
          <RatingStars rating={expert.rating} />
          <span className="text-xs text-muted-foreground">({expert.reviewCount})</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {expert.specialties.map((s) => (
          <Badge key={s} variant="accent" className="text-[10px]">
            {s}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{expert.bio}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        {expert.location} · {expert.distance} mi
      </div>
      <p className="font-heading font-bold text-foreground">
        {expert.hourlyRate ? `$${expert.hourlyRate}/hr` : (
          <span className="text-success">Free Consultation</span>
        )}
      </p>
      <Button size="sm" className="w-full mt-1">
        <MessageCircle className="h-4 w-4 mr-1" /> Contact Expert
      </Button>
    </CardContent>
  </Card>
);

/* ─── Review Card ─── */
const ReviewCard = ({ review }: { review: Review }) => (
  <Card className="border-border bg-card">
    <CardContent className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
            <AvatarFallback className="bg-secondary text-foreground text-xs">{review.reviewerName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-heading font-bold text-sm text-foreground">{review.reviewerName}</p>
            <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] shrink-0">{review.entityType}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <RatingStars rating={review.rating} />
        <Link to={review.entityLink} className="text-sm font-heading font-bold text-primary hover:underline">
          {review.entityName}
        </Link>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ThumbsUp className="h-3.5 w-3.5" /> Helpful ({review.helpfulVotes})
      </button>
    </CardContent>
  </Card>
);

/* ─── Page ─── */
const ExpertsAndReviews = () => {
  const [activeTab, setActiveTab] = useState<"experts" | "reviews">("experts");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Expert filters
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [maxRate, setMaxRate] = useState(100);
  const [minExpertRating, setMinExpertRating] = useState(0);
  const [expertPage, setExpertPage] = useState(1);

  // Review filters
  const [reviewCategory, setReviewCategory] = useState<string>("All");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewPage, setReviewPage] = useState(1);

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
    setExpertPage(1);
  };

  const filteredExperts = useMemo(() => {
    return mockExperts.filter((e) => {
      if (selectedSpecialties.length && !e.specialties.some((s) => selectedSpecialties.includes(s))) return false;
      if (e.distance > maxDistance) return false;
      if (e.hourlyRate !== null && e.hourlyRate > maxRate) return false;
      if (minExpertRating > 0 && e.rating < minExpertRating) return false;
      return true;
    });
  }, [selectedSpecialties, maxDistance, maxRate, minExpertRating]);

  const filteredReviews = useMemo(() => {
    return mockReviews.filter((r) => {
      if (reviewCategory !== "All" && r.entityType !== reviewCategory) return false;
      if (reviewSearch && !r.text.toLowerCase().includes(reviewSearch.toLowerCase()) && !r.entityName.toLowerCase().includes(reviewSearch.toLowerCase())) return false;
      return true;
    });
  }, [reviewCategory, reviewSearch]);

  const expertPages = Math.ceil(filteredExperts.length / ITEMS_PER_PAGE);
  const reviewPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const pagedExperts = filteredExperts.slice((expertPage - 1) * ITEMS_PER_PAGE, expertPage * ITEMS_PER_PAGE);
  const pagedReviews = filteredReviews.slice((reviewPage - 1) * ITEMS_PER_PAGE, reviewPage * ITEMS_PER_PAGE);

  const categories = ["All", "Shop", "Dealer", "Part", "Service"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-card py-10">
        <div className="container text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Neighborhood Experts, Reviews & Ratings
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find trusted local automotive experts or read honest reviews from your community.
          </p>
          {/* Tab Toggle */}
          <div className="inline-flex bg-secondary rounded-md p-1 gap-1">
            <button
              onClick={() => { setActiveTab("experts"); setExpertPage(1); }}
              className={`px-5 py-2 rounded font-heading font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === "experts" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Find an Expert
            </button>
            <button
              onClick={() => { setActiveTab("reviews"); setReviewPage(1); }}
              className={`px-5 py-2 rounded font-heading font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === "reviews" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Browse Reviews
            </button>
          </div>
        </div>
      </section>

      <div className="container flex-1 py-8">
        {activeTab === "experts" ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 shrink-0 space-y-6">
              <Card className="border-border bg-card">
                <CardContent className="p-5 space-y-5">
                  <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Filters
                  </h3>

                  {/* Specialty */}
                  <div className="space-y-2">
                    <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Specialty</p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {allSpecialties.map((s) => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
                          <Checkbox
                            checked={selectedSpecialties.includes(s)}
                            onCheckedChange={() => toggleSpecialty(s)}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="space-y-2">
                    <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">
                      Distance: {maxDistance} mi
                    </p>
                    <Slider value={[maxDistance]} onValueChange={([v]) => { setMaxDistance(v); setExpertPage(1); }} min={5} max={50} step={5} />
                  </div>

                  {/* Hourly Rate */}
                  <div className="space-y-2">
                    <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">
                      Max Rate: ${maxRate}/hr
                    </p>
                    <Slider value={[maxRate]} onValueChange={([v]) => { setMaxRate(v); setExpertPage(1); }} min={0} max={150} step={5} />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Min Rating</p>
                    <div className="flex gap-2">
                      {[0, 3, 4].map((r) => (
                        <button
                          key={r}
                          onClick={() => { setMinExpertRating(r); setExpertPage(1); }}
                          className={`px-3 py-1 text-xs rounded font-heading font-bold transition-colors ${minExpertRating === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                        >
                          {r === 0 ? "Any" : `${r}+`}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" className="lg:hidden min-h-[44px]" onClick={() => setMobileFiltersOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
                </Button>
                <p className="text-sm text-muted-foreground">{filteredExperts.length} experts found</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {pagedExperts.map((e) => (
                  <ExpertCard key={e.id} expert={e} />
                ))}
              </div>
              {pagedExperts.length === 0 && (
                <p className="text-center py-12 text-muted-foreground">No experts match your filters.</p>
              )}
              {expertPages > 1 && (
                <Pagination current={expertPage} total={expertPages} onChange={setExpertPage} />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Aggregate */}
            <AggregateRating reviews={filteredReviews} />

            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex gap-2 flex-wrap">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setReviewCategory(c); setReviewPage(1); }}
                    className={`px-4 py-1.5 rounded text-xs font-heading font-bold uppercase tracking-wider transition-colors ${reviewCategory === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={reviewSearch}
                  onChange={(e) => { setReviewSearch(e.target.value); setReviewPage(1); }}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm">
                Write a Review
              </Button>
            </div>

            {/* Review cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pagedReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
            {pagedReviews.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No reviews match your filters.</p>
            )}
            {reviewPages > 1 && (
              <Pagination current={reviewPage} total={reviewPages} onChange={setReviewPage} />
            )}
          </div>
        )}
      </div>

      {/* Mobile expert filter sheet */}
      <MobileFilterSheet open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Specialty</p>
            <div className="space-y-1.5">
              {allSpecialties.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-foreground min-h-[44px]">
                  <Checkbox checked={selectedSpecialties.includes(s)} onCheckedChange={() => toggleSpecialty(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Distance: {maxDistance} mi</p>
            <Slider value={[maxDistance]} onValueChange={([v]) => { setMaxDistance(v); setExpertPage(1); }} min={5} max={50} step={5} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Max Rate: ${maxRate}/hr</p>
            <Slider value={[maxRate]} onValueChange={([v]) => { setMaxRate(v); setExpertPage(1); }} min={0} max={150} step={5} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground">Min Rating</p>
            <div className="flex gap-2">
              {[0, 3, 4].map((r) => (
                <button key={r} onClick={() => { setMinExpertRating(r); setExpertPage(1); }}
                  className={`px-4 py-2 text-xs rounded font-heading font-bold min-h-[44px] transition-colors ${minExpertRating === r ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
                >{r === 0 ? "Any" : `${r}+`}</button>
              ))}
            </div>
          </div>
        </div>
      </MobileFilterSheet>

      <Footer />
    </div>
  );
};

/* ─── Pagination ─── */
const Pagination = ({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) => (
  <div className="flex items-center justify-center gap-2 pt-6">
    <Button variant="secondary" size="icon" disabled={current === 1} onClick={() => onChange(current - 1)}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
    {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
      <Button
        key={p}
        variant={p === current ? "default" : "secondary"}
        size="sm"
        onClick={() => onChange(p)}
        className="w-9"
      >
        {p}
      </Button>
    ))}
    <Button variant="secondary" size="icon" disabled={current === total} onClick={() => onChange(current + 1)}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

export default ExpertsAndReviews;
