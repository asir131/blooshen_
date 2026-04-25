
-- Platform settings (single-row config)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  min_description_length INTEGER NOT NULL DEFAULT 100,
  min_images_required INTEGER NOT NULL DEFAULT 3,
  max_price_threshold NUMERIC NOT NULL DEFAULT 500000,
  min_price_threshold NUMERIC NOT NULL DEFAULT 500,
  placeholder_words TEXT[] NOT NULL DEFAULT ARRAY[
    'test','demo','sample','lorem','ipsum','placeholder','fake','example','n/a','tbd','car name','vehicle'
  ],
  auto_block_on_critical BOOLEAN NOT NULL DEFAULT true,
  email_alerts_enabled BOOLEAN NOT NULL DEFAULT false,
  alert_email TEXT,
  auto_scan_on_submit BOOLEAN NOT NULL DEFAULT true,
  scan_frequency TEXT NOT NULL DEFAULT 'manual',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID,
  CONSTRAINT platform_settings_singleton CHECK (id = 1)
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Master admins read settings"
  ON public.platform_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Master admins insert settings"
  ON public.platform_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'master_admin'));

CREATE POLICY "Master admins update settings"
  ON public.platform_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'master_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'master_admin'));

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.platform_settings (id) VALUES (1)
  ON CONFLICT (id) DO NOTHING;

-- Realtime
ALTER TABLE public.system_alerts REPLICA IDENTITY FULL;
ALTER TABLE public.vehicle_listings REPLICA IDENTITY FULL;
ALTER TABLE public.audit_logs REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.system_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicle_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
