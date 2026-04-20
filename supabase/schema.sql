create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text unique not null,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  razorpay_payment_id text,
  razorpay_order_id text,
  status text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists plan text not null default 'free';

create table if not exists public.revisions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  topic text not null,
  source_text text,
  package_json jsonb not null,
  is_revised boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.revisions add column if not exists is_revised boolean not null default false;

create index if not exists revisions_user_created_idx on public.revisions (user_id, created_at desc);

alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.revisions enable row level security;

create policy "service role full access users" on public.users
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role full access subs" on public.subscriptions
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role full access revisions" on public.revisions
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Referral codes table for premium unlock
create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  plan_type text not null default 'pro', -- 'pro' or 'lifetime'
  max_uses integer, -- null for unlimited
  uses_count integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz, -- null for no expiration
  created_at timestamptz not null default now()
);

-- Track which users have used which codes
create table if not exists public.referral_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  code_id uuid references public.referral_codes(id),
  redeemed_at timestamptz not null default now()
);

alter table public.referral_codes enable row level security;
alter table public.referral_redemptions enable row level security;

create policy "service role full access referral_codes" on public.referral_codes
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "service role full access referral_redemptions" on public.referral_redemptions
for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Insert some default referral codes (these can be changed later)
insert into public.referral_codes (code, description, plan_type, max_uses) values
  ('REVISE2026', 'Launch special - unlimited pro access', 'pro', null),
  ('ICAIFREE', 'ICAI student special - unlimited pro access', 'pro', null),
  ('LAUNCH50', 'Early bird - 50 free codes', 'pro', 50)
on conflict (code) do nothing;
