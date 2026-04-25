-- Create special_orders table for special vehicle order requests
CREATE TABLE public.special_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  make_model TEXT NOT NULL,
  year_range TEXT,
  color TEXT,
  budget TEXT,
  mileage_range TEXT,
  body_styles TEXT[] NOT NULL DEFAULT '{}',
  body_style_other TEXT,
  payment_method TEXT NOT NULL,
  comments TEXT,
  deposit_status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.special_orders ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated) can submit a special order
CREATE POLICY "Anyone can submit a special order"
ON public.special_orders FOR INSERT
WITH CHECK (true);

-- Users can view their own orders (by user_id when logged in)
CREATE POLICY "Users can view their own special orders"
ON public.special_orders FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admins can view all special orders
CREATE POLICY "Admins can view all special orders"
ON public.special_orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update special orders
CREATE POLICY "Admins can update special orders"
ON public.special_orders FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_special_orders_updated_at
BEFORE UPDATE ON public.special_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_special_orders_user_id ON public.special_orders(user_id);
CREATE INDEX idx_special_orders_email ON public.special_orders(email);
CREATE INDEX idx_special_orders_status ON public.special_orders(status);