import { useState } from "react";
import { z } from "zod";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useSubmitReview } from "@/hooks/useListingReviews";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  comment: z.string().trim().max(1000, "Comment must be under 1000 characters"),
});

interface Props {
  listingId: string;
  category: ListingCategory;
}

const ReviewForm = ({ listingId, category }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate, isPending } = useSubmitReview();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to leave a review." });
      navigate("/auth");
      return;
    }
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) {
      toast({
        title: "Invalid review",
        description: parsed.error.issues[0]?.message ?? "Please check your input.",
        variant: "destructive",
      });
      return;
    }
    mutate(
      { listingId, category, rating: parsed.data.rating, comment: parsed.data.comment },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="font-heading text-sm font-bold text-foreground">WRITE A REVIEW</h3>

      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = (hover || rating) >= n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="p-1"
            >
              <Star className={cn("h-6 w-6 transition-colors", active ? "fill-primary text-primary" : "text-muted-foreground")} />
            </button>
          );
        })}
        {rating > 0 && <span className="ml-2 text-xs text-muted-foreground font-body">{rating}/5</span>}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 1000))}
        placeholder="Share your experience (optional)"
        rows={4}
        maxLength={1000}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-body">{comment.length}/1000</span>
        <Button type="submit" disabled={isPending || rating === 0} size="sm">
          {isPending && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}
          Submit Review
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
