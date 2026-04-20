-- Listings table
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  category public.listing_category_enum NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  location TEXT,
  city TEXT,
  state TEXT,
  image TEXT,
  images TEXT[] NOT NULL DEFAULT '{}'::text[],
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_category ON public.listings(category) WHERE is_active = true;
CREATE INDEX idx_listings_user_id ON public.listings(user_id);
CREATE INDEX idx_listings_created_at ON public.listings(created_at DESC);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active listings"
ON public.listings FOR SELECT
USING (is_active = true);

CREATE POLICY "Owners and admins can view own listings"
ON public.listings FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own listings"
ON public.listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own listings"
ON public.listings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any listing"
ON public.listings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners can delete own listings"
ON public.listings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any listing"
ON public.listings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();