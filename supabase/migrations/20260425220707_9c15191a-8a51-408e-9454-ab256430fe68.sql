-- Profiles extensions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

DROP POLICY IF EXISTS "Master admins can view all profiles" ON public.profiles;
CREATE POLICY "Master admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'));

-- vehicle_listings
CREATE TABLE IF NOT EXISTS public.vehicle_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  vin TEXT NOT NULL UNIQUE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  price NUMERIC(12,2) NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  seller_type TEXT NOT NULL CHECK (seller_type IN ('dealer','private','broker')),
  body_style TEXT,
  color TEXT,
  condition TEXT CHECK (condition IN ('new','used','certified')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_review','approved','rejected','blocked')),
  validation_status TEXT NOT NULL DEFAULT 'unvalidated' CHECK (validation_status IN ('unvalidated','passed','failed','flagged')),
  validation_score INTEGER NOT NULL DEFAULT 0,
  fraud_score INTEGER NOT NULL DEFAULT 0,
  rejection_reason TEXT,
  flag_reasons JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicle_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view published approved listings"
  ON public.vehicle_listings FOR SELECT TO anon, authenticated
  USING (is_published = true AND validation_status = 'passed' AND status = 'approved');

CREATE POLICY "Master admins manage all vehicle listings"
  ON public.vehicle_listings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins view own vehicle listings"
  ON public.vehicle_listings FOR SELECT TO authenticated
  USING (created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins insert own vehicle listings"
  ON public.vehicle_listings FOR INSERT TO authenticated
  WITH CHECK (created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins update own vehicle listings"
  ON public.vehicle_listings FOR UPDATE TO authenticated
  USING (created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins delete own vehicle listings"
  ON public.vehicle_listings FOR DELETE TO authenticated
  USING (created_by IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE TRIGGER trg_vehicle_listings_updated_at
  BEFORE UPDATE ON public.vehicle_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_vehicle_listings_created_by ON public.vehicle_listings(created_by);
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_status ON public.vehicle_listings(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_published ON public.vehicle_listings(is_published) WHERE is_published = true;

-- listing_images
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.vehicle_listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  hash TEXT,
  quality_score INTEGER NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  flag_reason TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view images of public listings"
  ON public.listing_images FOR SELECT TO anon, authenticated
  USING (listing_id IN (
    SELECT id FROM public.vehicle_listings
    WHERE is_published = true AND validation_status = 'passed' AND status = 'approved'
  ));

CREATE POLICY "Master admins manage all listing images"
  ON public.listing_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins manage images of own listings"
  ON public.listing_images FOR ALL TO authenticated
  USING (listing_id IN (
    SELECT vl.id FROM public.vehicle_listings vl
    JOIN public.profiles p ON p.id = vl.created_by
    WHERE p.user_id = auth.uid()
  ))
  WITH CHECK (listing_id IN (
    SELECT vl.id FROM public.vehicle_listings vl
    JOIN public.profiles p ON p.id = vl.created_by
    WHERE p.user_id = auth.uid()
  ));

CREATE INDEX IF NOT EXISTS idx_listing_images_listing ON public.listing_images(listing_id);

-- audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master admins read audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Service role writes audit logs"
  ON public.audit_logs FOR INSERT TO service_role
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- system_alerts
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('error','warning','info','critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  listing_id UUID REFERENCES public.vehicle_listings(id) ON DELETE SET NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master admins read all alerts"
  ON public.system_alerts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Master admins update alerts"
  ON public.system_alerts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Master admins insert alerts"
  ON public.system_alerts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Admins read alerts on own listings"
  ON public.system_alerts FOR SELECT TO authenticated
  USING (listing_id IN (
    SELECT vl.id FROM public.vehicle_listings vl
    JOIN public.profiles p ON p.id = vl.created_by
    WHERE p.user_id = auth.uid()
  ));

-- vin_validation_cache
CREATE TABLE IF NOT EXISTS public.vin_validation_cache (
  vin TEXT PRIMARY KEY,
  is_valid BOOLEAN NOT NULL,
  decoded_data JSONB NOT NULL DEFAULT '{}',
  validated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vin_validation_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read VIN cache"
  ON public.vin_validation_cache FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated insert VIN cache"
  ON public.vin_validation_cache FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated update VIN cache"
  ON public.vin_validation_cache FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL);