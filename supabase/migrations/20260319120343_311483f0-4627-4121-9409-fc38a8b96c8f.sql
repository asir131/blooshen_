
-- Promotion gigs: listings sellers boost into the marketplace
CREATE TABLE public.promotion_gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id text NOT NULL,
  listing_category public.listing_category_enum NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  commission_amount numeric NOT NULL DEFAULT 0,
  commission_type text NOT NULL DEFAULT 'fixed' CHECK (commission_type IN ('fixed', 'percentage')),
  seller_name text,
  seller_rating numeric DEFAULT 5.0,
  location text,
  vehicle_type text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  max_promoters integer,
  claimed_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.promotion_gigs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gigs"
  ON public.promotion_gigs FOR SELECT TO public
  USING (true);

-- Claimed promotions: gigs a promoter has claimed
CREATE TABLE public.claimed_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id uuid NOT NULL REFERENCES public.promotion_gigs(id) ON DELETE CASCADE,
  promoter_id uuid NOT NULL REFERENCES public.promoter_profiles(id) ON DELETE CASCADE,
  referral_url text NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  earned numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
  claimed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gig_id, promoter_id)
);

ALTER TABLE public.claimed_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promoters can view own claimed promotions"
  ON public.claimed_promotions FOR SELECT TO authenticated
  USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Promoters can claim promotions"
  ON public.claimed_promotions FOR INSERT TO authenticated
  WITH CHECK (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Promoters can update own claimed promotions"
  ON public.claimed_promotions FOR UPDATE TO authenticated
  USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

-- Payout settings
CREATE TABLE public.payout_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id uuid NOT NULL REFERENCES public.promoter_profiles(id) ON DELETE CASCADE UNIQUE,
  payout_method text NOT NULL DEFAULT 'paypal' CHECK (payout_method IN ('venmo', 'paypal', 'ach', 'check')),
  payout_details jsonb DEFAULT '{}'::jsonb,
  payout_threshold numeric NOT NULL DEFAULT 25.00,
  payout_schedule text NOT NULL DEFAULT 'monthly' CHECK (payout_schedule IN ('weekly', 'monthly')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payout_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promoters can view own payout settings"
  ON public.payout_settings FOR SELECT TO authenticated
  USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Promoters can insert own payout settings"
  ON public.payout_settings FOR INSERT TO authenticated
  WITH CHECK (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Promoters can update own payout settings"
  ON public.payout_settings FOR UPDATE TO authenticated
  USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

-- Payout history
CREATE TABLE public.payout_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promoter_id uuid NOT NULL REFERENCES public.promoter_profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payout_method text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  reference_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payout_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promoters can view own payout history"
  ON public.payout_history FOR SELECT TO authenticated
  USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

-- Triggers
CREATE TRIGGER update_promotion_gigs_updated_at
  BEFORE UPDATE ON public.promotion_gigs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_claimed_promotions_updated_at
  BEFORE UPDATE ON public.claimed_promotions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payout_settings_updated_at
  BEFORE UPDATE ON public.payout_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
