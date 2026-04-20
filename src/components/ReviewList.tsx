import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useListingReviews } from "@/hooks/useListingReviews";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

interface Props {
  listingId: string;
  category: ListingCategory;
}

const ReviewList = ({ listingId, category }: Props) => {
  const { data: reviews, isLoading } = useListingReviews(listingId, category);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground font-body">Loading reviews…</p>;
  }
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground font-body">No reviews yet — be the first!</p>;
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => {
        const stars = Array.from({ length: 5 }, (_, i) => i < r.rating);
        const name = r.author?.display_name ?? "Anonymous";
        return (
          <div key={r.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              {r.author?.avatar_url ? (
                <img src={r.author.avatar_url} alt={name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center font-heading text-sm text-foreground">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-heading text-sm font-bold text-foreground">{name}</p>
                <div className="flex items-center gap-1">
                  {stars.map((f, i) => (
                    <Star key={i} className={cn("h-3 w-3", f ? "fill-primary text-primary" : "text-muted-foreground")} />
                  ))}
                  <span className="text-[10px] text-muted-foreground font-body ml-1">
                    {format(new Date(r.created_at), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            {r.comment && <p className="text-sm text-muted-foreground font-body">{r.comment}</p>}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
