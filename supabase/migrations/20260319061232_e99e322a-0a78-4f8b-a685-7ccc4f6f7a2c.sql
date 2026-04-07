
-- Replace overly permissive INSERT policies with ones that require a valid promoter_id
DROP POLICY "Anyone can create referral clicks" ON public.referral_clicks;
CREATE POLICY "Can create referral clicks for valid promoters" ON public.referral_clicks
  FOR INSERT WITH CHECK (promoter_id IN (SELECT id FROM public.promoter_profiles));

DROP POLICY "Anyone can create commissions" ON public.commissions;
CREATE POLICY "Can create commissions for valid promoters" ON public.commissions
  FOR INSERT WITH CHECK (promoter_id IN (SELECT id FROM public.promoter_profiles));
