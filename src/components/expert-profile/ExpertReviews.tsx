import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExpertReview, ExpertProfile } from "@/data/mockExpertProfile";

interface ExpertReviewsProps {
  reviews: ExpertReview[];
  expert: ExpertProfile;
}

export default function ExpertReviews({ reviews, expert }: ExpertReviewsProps) {
  const [shown, setShown] = useState(4);
  const { rating } = expert;
  const total = Object.values(rating.breakdown).reduce((a, b) => a + b, 0);

  return (
    <section className="bg-[#242424] py-16 px-4">
      <div className="max-w-[900px] mx-auto">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.2em] text-primary mb-2">Client Reviews</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">What People Are Saying</h2>
        <div className="w-12 h-1 bg-primary rounded mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
          {/* Summary */}
          <div>
            <div className="text-5xl font-heading font-bold text-primary">{rating.average}</div>
            <div className="text-sm text-muted-foreground mb-1">out of 5</div>
            <div className="flex gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <div className="text-xs text-muted-foreground mb-4">({rating.count} reviews)</div>

            {([5, 4, 3, 2, 1] as const).map((stars) => {
              const pct = total > 0 ? Math.round((rating.breakdown[stars] / total) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-muted-foreground w-8">{stars} ★</span>
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.slice(0, shown).map((review) => (
              <div key={review.id} className="bg-background border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                    {review.reviewer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{review.reviewer_name}</p>
                    <p className="text-[10px] text-muted-foreground">{review.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                  ))}
                  {review.is_verified && (
                    <span className="flex items-center gap-0.5 text-[10px] text-green-500 ml-2">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-foreground leading-relaxed line-clamp-4 mb-2">{review.text}</p>
                <p className="text-[10px] text-muted-foreground">{review.vehicle_helped}</p>
              </div>
            ))}
          </div>
        </div>

        {shown < reviews.length && (
          <div className="text-center mt-6">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => setShown((s) => s + 4)}>
              Load More Reviews
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
