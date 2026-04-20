import { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsWatched, useToggleWatch } from "@/hooks/useWatchlist";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ListingCategory = Database["public"]["Enums"]["listing_category_enum"];

interface Props {
  listingId: string;
  category: ListingCategory;
  className?: string;
  size?: "sm" | "md";
}

const WatchlistToggle = ({ listingId, category, className, size = "sm" }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const watched = useIsWatched(listingId, category);
  const { mutate, isPending } = useToggleWatch();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in to save listings to your watchlist." });
      navigate("/auth");
      return;
    }
    mutate({ listingId, category, watched });
  };

  const iconSize = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={watched}
      aria-label={watched ? "Remove from watchlist" : "Save to watchlist"}
      className={cn(
        "p-1.5 rounded-md transition-colors disabled:opacity-60",
        watched ? "text-primary" : "text-muted-foreground hover:text-primary",
        className,
      )}
    >
      <Heart className={cn(iconSize, watched && "fill-primary")} />
    </button>
  );
};

export default WatchlistToggle;
