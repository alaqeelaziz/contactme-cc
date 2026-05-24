-- =====================================================
-- contactme.cc — Supabase Database Schema
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES
-- =====================================================
create table if not exists public.profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  username    text not null unique,
  full_name   text not null,
  bio         text,
  avatar_url  text,
  account_type text not null default 'personal' check (account_type in ('personal', 'company')),
  is_pro      boolean not null default false,
  plan        text not null default 'free' check (plan in ('free', 'pro_individual', 'pro_company')),
  whatsapp    text,
  created_at  timestamptz not null default now()
);

-- Index for fast username lookups
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists profiles_user_id_idx on public.profiles (user_id);

-- Row-Level Security
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- =====================================================
-- LINKS
-- =====================================================
create table if not exists public.links (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  url           text not null,
  icon          text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists links_user_id_idx on public.links (user_id, display_order);

alter table public.links enable row level security;

create policy "Active links are viewable by everyone"
  on public.links for select using (is_active = true or auth.uid() = user_id);

create policy "Users can manage their own links"
  on public.links for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =====================================================
-- SERVICES
-- =====================================================
create table if not exists public.services (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists services_user_id_idx on public.services (user_id);

alter table public.services enable row level security;

create policy "Active services are viewable by everyone"
  on public.services for select using (is_active = true or auth.uid() = user_id);

create policy "Users can manage their own services"
  on public.services for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =====================================================
-- PROFILE VIEWS
-- =====================================================
create table if not exists public.profile_views (
  id         uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  viewed_at  timestamptz not null default now()
);

create index if not exists profile_views_profile_id_idx on public.profile_views (profile_id);
create index if not exists profile_views_viewed_at_idx on public.profile_views (viewed_at);

alter table public.profile_views enable row level security;

create policy "Anyone can insert a profile view"
  on public.profile_views for insert with check (true);

create policy "Profile owners can view their analytics"
  on public.profile_views for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

-- =====================================================
-- STORAGE BUCKET
-- =====================================================
insert into storage.buckets (id, name, public)
values ('public', 'public', true)
on conflict (id) do nothing;

create policy "Public storage is readable by everyone"
  on storage.objects for select
  using (bucket_id = 'public');

create policy "Authenticated users can upload files"
  on storage.objects for insert
  with check (bucket_id = 'public' and auth.role() = 'authenticated');

create policy "Users can update their own files"
  on storage.objects for update
  using (bucket_id = 'public' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own files"
  on storage.objects for delete
  using (bucket_id = 'public' and auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- AUTO-CREATE PROFILE ON SIGN UP (optional trigger)
-- =====================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  -- Profile is created by the client after signup
  -- This trigger is a fallback
  return new;
end;
$$;
