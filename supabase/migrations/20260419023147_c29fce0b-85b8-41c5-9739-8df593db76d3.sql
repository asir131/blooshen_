-- =========================================
-- EXPERTS / BROKERS DIRECTORY
-- =========================================
create table public.experts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  username text unique,
  photo_url text,
  tagline text,
  bio text,
  specialties text[] default '{}',
  city text,
  state text,
  zip text,
  rating numeric(3,2) default 5.0,
  review_count integer default 0,
  response_time_hours integer default 1,
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.experts enable row level security;

create policy "Anyone can view active experts"
  on public.experts for select
  using (is_active = true);

create policy "Admins manage experts"
  on public.experts for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger trg_experts_updated
  before update on public.experts
  for each row execute function public.update_updated_at_column();

-- =========================================
-- OTTO CONVERSATIONS (chat log)
-- =========================================
create table public.otto_conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  page_context text,
  listing_context_id text,
  listing_context_type text,
  intent_signal boolean default false,
  broker_handoff_triggered boolean default false,
  voice_used boolean default false,
  created_at timestamptz not null default now()
);

create index idx_otto_conv_session on public.otto_conversations(session_id);
create index idx_otto_conv_user on public.otto_conversations(user_id);
create index idx_otto_conv_id on public.otto_conversations(conversation_id);

alter table public.otto_conversations enable row level security;

create policy "Anyone can insert otto messages"
  on public.otto_conversations for insert
  with check (true);

create policy "Users view own otto messages by user_id"
  on public.otto_conversations for select
  using (auth.uid() is not null and user_id = auth.uid());

create policy "Anyone view otto messages by session"
  on public.otto_conversations for select
  using (true);

create policy "Admins view all otto messages"
  on public.otto_conversations for select
  using (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- OTTO PREFERENCES (Pro tier memory)
-- =========================================
create table public.otto_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  preferred_makes text[] default '{}',
  preferred_body_styles text[] default '{}',
  budget_min numeric,
  budget_max numeric,
  preferred_payment text[] default '{}',
  preferred_location text,
  deal_type_preference text,
  saved_topics text[] default '{}',
  updated_at timestamptz not null default now()
);

alter table public.otto_preferences enable row level security;

create policy "Users manage own otto preferences"
  on public.otto_preferences for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create trigger trg_otto_prefs_updated
  before update on public.otto_preferences
  for each row execute function public.update_updated_at_column();

-- =========================================
-- OTTO SUBSCRIPTIONS
-- =========================================
create table public.otto_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('free','pro','session')),
  status text not null default 'active' check (status in ('active','cancelled','expired')),
  stripe_subscription_id text,
  stripe_session_id text,
  started_at timestamptz default now(),
  expires_at timestamptz,
  trial_ends_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_otto_subs_user on public.otto_subscriptions(user_id);

alter table public.otto_subscriptions enable row level security;

create policy "Users view own otto subscriptions"
  on public.otto_subscriptions for select
  using (user_id = auth.uid());

create policy "Admins manage otto subscriptions"
  on public.otto_subscriptions for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- OTTO FEEDBACK
-- =========================================
create table public.otto_feedback (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  message_id uuid,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.otto_feedback enable row level security;

create policy "Anyone can insert otto feedback"
  on public.otto_feedback for insert
  with check (true);

create policy "Users view own otto feedback"
  on public.otto_feedback for select
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- =========================================
-- SEED: one demo expert so handoff card renders
-- =========================================
insert into public.experts (name, username, tagline, specialties, city, state, zip, rating, review_count, response_time_hours, is_verified, is_active)
values
  ('Marcus Bell', 'marcus-b', 'Cash deal specialist · East Atlanta', array['cash_deals','trucks','first_time_buyer'], 'Atlanta', 'GA', '30316', 4.9, 87, 1, true, true),
  ('Devon Owens', 'devon-o', 'Truck & SUV expert · Stone Mountain', array['trucks','suvs','financing'], 'Stone Mountain', 'GA', '30083', 4.8, 54, 2, true, true),
  ('Tanya Ford', 'tanya-f', 'First-time buyer guide · College Park', array['first_time_buyer','sedans','budget_friendly'], 'College Park', 'GA', '30337', 5.0, 42, 1, true, true);