-- Enums
CREATE TYPE public.application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'suspended', 'waitlisted');
CREATE TYPE public.application_source AS ENUM ('Organic', 'Referral', 'Social');
CREATE TYPE public.badge_tier AS ENUM ('Starter', 'Pro', 'Elite', 'Legend');

-- Table
CREATE TABLE public.broker_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  distance_mi NUMERIC,
  source public.application_source NOT NULL DEFAULT 'Organic',
  status public.application_status NOT NULL DEFAULT 'pending',
  step_reached INTEGER NOT NULL DEFAULT 1,
  score INTEGER NOT NULL DEFAULT 0,
  score_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  username TEXT,
  tagline TEXT,
  bio TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}'::text[],
  self_description TEXT,
  heard_from TEXT,
  prior_referral TEXT,
  phone_verified BOOLEAN NOT NULL DEFAULT false,
  phone_verified_at TIMESTAMPTZ,
  id_verified BOOLEAN NOT NULL DEFAULT false,
  id_method TEXT,
  id_verified_at TIMESTAMPTZ,
  id_confidence NUMERIC,
  connected_socials TEXT[] NOT NULL DEFAULT '{}'::text[],
  payout_method TEXT,
  payout_schedule TEXT NOT NULL DEFAULT 'monthly',
  featured_vehicles INTEGER NOT NULL DEFAULT 0,
  avatar_url TEXT,
  banner_url TEXT,
  badge_tier public.badge_tier NOT NULL DEFAULT 'Starter',
  admin_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  activity_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_broker_applications_user_id ON public.broker_applications(user_id);
CREATE INDEX idx_broker_applications_status ON public.broker_applications(status);
CREATE INDEX idx_broker_applications_applied_at ON public.broker_applications(applied_at DESC);

-- RLS
ALTER TABLE public.broker_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own application"
ON public.broker_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
ON public.broker_applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can submit own application"
ON public.broker_applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own application"
ON public.broker_applications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any application"
ON public.broker_applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications"
ON public.broker_applications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER update_broker_applications_updated_at
BEFORE UPDATE ON public.broker_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();