
-- Watchlist
CREATE TABLE public.watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id text NOT NULL,
  listing_category listing_category_enum NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id, listing_category)
);

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own watchlist"
ON public.watchlist FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own watchlist"
ON public.watchlist FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own watchlist"
ON public.watchlist FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_watchlist_user ON public.watchlist(user_id);
CREATE INDEX idx_watchlist_listing ON public.watchlist(listing_id, listing_category);

-- Listing reviews
CREATE TABLE public.listing_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id text NOT NULL,
  listing_category listing_category_enum NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id, listing_category)
);

ALTER TABLE public.listing_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listing reviews"
ON public.listing_reviews FOR SELECT
USING (true);

CREATE POLICY "Signed-in users can create reviews"
ON public.listing_reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors can update own reviews"
ON public.listing_reviews FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authors can delete own reviews"
ON public.listing_reviews FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_listing_reviews_listing ON public.listing_reviews(listing_id, listing_category);
CREATE INDEX idx_listing_reviews_user ON public.listing_reviews(user_id);

CREATE TRIGGER update_listing_reviews_updated_at
BEFORE UPDATE ON public.listing_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
