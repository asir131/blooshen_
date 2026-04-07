
-- Create enum types for the affiliate system
CREATE TYPE public.conversion_type AS ENUM ('lead', 'booking', 'signup', 'sale', 'rsvp', 'ticket');
CREATE TYPE public.commission_status AS ENUM ('pending', 'approved', 'paid');
CREATE TYPE public.listing_category_enum AS ENUM ('cars_for_sale', 'parts_accessories', 'service_providers', 'rentals', 'neighborhood_experts', 'events_meetups');

-- Promoter profiles: every registered user gets a unique promoter ID
CREATE TABLE public.promoter_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  promoter_code TEXT NOT NULL UNIQUE,
  total_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  pending_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Referral clicks: tracks when someone clicks a shared link
CREATE TABLE public.referral_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promoter_id UUID NOT NULL REFERENCES public.promoter_profiles(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL,
  listing_category public.listing_category_enum NOT NULL,
  visitor_fingerprint TEXT,
  referral_url TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Commissions: tracks conversion events and commission amounts
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promoter_id UUID NOT NULL REFERENCES public.promoter_profiles(id) ON DELETE CASCADE,
  listing_id TEXT NOT NULL,
  listing_category public.listing_category_enum NOT NULL,
  conversion_type public.conversion_type NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  sale_amount NUMERIC(10,2),
  status public.commission_status NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  converted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_promoter_profiles_code ON public.promoter_profiles(promoter_code);
CREATE INDEX idx_promoter_profiles_user ON public.promoter_profiles(user_id);
CREATE INDEX idx_referral_clicks_promoter ON public.referral_clicks(promoter_id);
CREATE INDEX idx_referral_clicks_listing ON public.referral_clicks(listing_id);
CREATE INDEX idx_commissions_promoter ON public.commissions(promoter_id);
CREATE INDEX idx_commissions_status ON public.commissions(status);
CREATE INDEX idx_commissions_listing ON public.commissions(listing_id);

-- Enable RLS
ALTER TABLE public.promoter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- RLS: promoter_profiles - public read for code lookups, own-user write
CREATE POLICY "Anyone can look up promoters" ON public.promoter_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own promoter profile" ON public.promoter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own promoter profile" ON public.promoter_profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS: referral_clicks - anyone can insert, promoter owner can read
CREATE POLICY "Anyone can create referral clicks" ON public.referral_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Promoters can view own clicks" ON public.referral_clicks FOR SELECT USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

-- RLS: commissions - anyone can insert, promoter owner can read
CREATE POLICY "Anyone can create commissions" ON public.commissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Promoters can view own commissions" ON public.commissions FOR SELECT USING (promoter_id IN (SELECT id FROM public.promoter_profiles WHERE user_id = auth.uid()));

-- Function to generate unique promoter code
CREATE OR REPLACE FUNCTION public.generate_promoter_code()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE new_code TEXT; code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'WURX-' || upper(substr(md5(random()::text), 1, 6));
    SELECT EXISTS(SELECT 1 FROM public.promoter_profiles WHERE promoter_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END; $$;

-- Auto-create promoter profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_promoter()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.promoter_profiles (user_id, promoter_code)
  VALUES (NEW.id, public.generate_promoter_code());
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created_promoter
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_promoter();

-- Commission calculator function
CREATE OR REPLACE FUNCTION public.calculate_commission(
  p_category public.listing_category_enum, p_conversion_type public.conversion_type, p_sale_amount NUMERIC DEFAULT NULL
) RETURNS NUMERIC LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
BEGIN
  RETURN CASE
    WHEN p_category = 'cars_for_sale' AND p_conversion_type = 'lead' THEN 25.00
    WHEN p_category = 'cars_for_sale' AND p_conversion_type = 'sale' THEN 150.00
    WHEN p_category = 'parts_accessories' AND p_sale_amount IS NOT NULL THEN ROUND(p_sale_amount * 0.08, 2)
    WHEN p_category = 'service_providers' AND p_conversion_type = 'lead' THEN 10.00
    WHEN p_category = 'service_providers' AND p_conversion_type = 'booking' THEN 35.00
    WHEN p_category = 'rentals' AND p_sale_amount IS NOT NULL THEN ROUND(p_sale_amount * 0.12, 2)
    WHEN p_category = 'neighborhood_experts' AND p_conversion_type = 'lead' THEN 8.00
    WHEN p_category = 'events_meetups' AND p_conversion_type = 'rsvp' THEN 5.00
    WHEN p_category = 'events_meetups' AND p_conversion_type = 'ticket' THEN 20.00
    ELSE 0.00
  END;
END; $$;

-- Auto-calc commission on insert
CREATE OR REPLACE FUNCTION public.auto_calculate_commission()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.commission_amount = 0 THEN
    NEW.commission_amount := public.calculate_commission(NEW.listing_category, NEW.conversion_type, NEW.sale_amount);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER before_commission_insert BEFORE INSERT ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_calculate_commission();

-- Update promoter earnings on commission status changes
CREATE OR REPLACE FUNCTION public.update_promoter_earnings()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'pending' THEN
    UPDATE public.promoter_profiles SET pending_earnings = pending_earnings + NEW.commission_amount, updated_at = now() WHERE id = NEW.promoter_id;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'approved' THEN
    UPDATE public.promoter_profiles SET pending_earnings = pending_earnings - NEW.commission_amount, updated_at = now() WHERE id = NEW.promoter_id;
    NEW.approved_at := now();
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status = 'paid' THEN
    UPDATE public.promoter_profiles SET total_earnings = total_earnings + NEW.commission_amount, updated_at = now() WHERE id = NEW.promoter_id;
    NEW.paid_at := now();
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_commission_change BEFORE INSERT OR UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_promoter_earnings();

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_promoter_profiles_updated_at BEFORE UPDATE ON public.promoter_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
