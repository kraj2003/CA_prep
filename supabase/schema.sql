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
