
-- Chat sessions table
CREATE TABLE public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id text NOT NULL,
  listing_category public.listing_category_enum NOT NULL,
  listing_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  visitor_id text,
  user_id uuid,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create chat sessions"
  ON public.chat_sessions FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Users can view own chat sessions"
  ON public.chat_sessions FOR SELECT TO public
  USING (true);

CREATE POLICY "Users can update own chat sessions"
  ON public.chat_sessions FOR UPDATE TO public
  USING (true);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert chat messages"
  ON public.chat_messages FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view chat messages"
  ON public.chat_messages FOR SELECT TO public
  USING (true);

-- Leads table
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  listing_id text NOT NULL,
  listing_category public.listing_category_enum NOT NULL,
  name text,
  email text,
  phone text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  promoter_id uuid REFERENCES public.promoter_profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view leads"
  ON public.leads FOR SELECT TO public
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
