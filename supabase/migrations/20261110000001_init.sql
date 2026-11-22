-- =====================================================================
-- Portfolio schema: profiles, projects, services, inquiries,
-- testimonials, faqs + RLS + storage bucket.
--
-- Access model
--   * Public (anon) : SELECT published portfolio content only.
--   * Inquiries     : written by the backend with the service-role key
--                     (so rate limiting / spam checks cannot be bypassed).
--                     Only admins can read them.
--   * Admins        : profiles.role = 'admin' -> full content management.
--
-- chatbot_conversations is intentionally NOT created: conversations are not
-- persisted, which avoids storing visitor data that isn't needed.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (char_length(full_name) <= 120),
  role        text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Every new auth user gets a non-privileged profile. Admins are promoted manually.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Security-definer check so RLS policies can ask "is the caller an admin?"
-- without recursive policy evaluation on profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- services
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (char_length(title) between 2 and 120),
  description   text not null check (char_length(description) <= 1000),
  icon          text check (char_length(icon) <= 60),
  features      text[] not null default '{}',
  project_type  text check (char_length(project_type) <= 80),
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists services_published_order_idx on public.services (is_published, sort_order);
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null check (char_length(title) between 2 and 160),
  category        text not null check (char_length(category) <= 120),
  summary         text not null check (char_length(summary) <= 1500),
  features        text[] not null default '{}',
  business_value  text[] not null default '{}',
  architecture    text[] not null default '{}',
  preview_key     text check (preview_key in ('gym', 'consultancy', 'shop', 'generic')),
  image_url       text check (image_url is null or image_url ~ '^https://'),
  demo_url        text check (demo_url is null or demo_url ~ '^https://'),
  github_url      text check (github_url is null or github_url ~ '^https://'),
  sort_order      integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists projects_published_order_idx on public.projects (is_published, sort_order);
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- testimonials (verified client feedback only)
-- ---------------------------------------------------------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  client_name   text not null check (char_length(client_name) between 2 and 120),
  client_role   text check (char_length(client_role) <= 120),
  company       text check (char_length(company) <= 160),
  quote         text not null check (char_length(quote) between 10 and 1500),
  rating        smallint check (rating between 1 and 5),
  project_id    uuid references public.projects (id) on delete set null,
  is_verified   boolean not null default false,
  is_published  boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists testimonials_public_idx on public.testimonials (is_published, is_verified, sort_order);
create index if not exists testimonials_project_idx on public.testimonials (project_id);
create trigger testimonials_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- faqs
-- ---------------------------------------------------------------------
create table if not exists public.faqs (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  question      text not null check (char_length(question) between 5 and 300),
  answer        text not null check (char_length(answer) between 5 and 3000),
  sort_order    integer not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists faqs_published_order_idx on public.faqs (is_published, sort_order);
create trigger faqs_updated_at before update on public.faqs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- inquiries (private)
-- No IP addresses or payment data are stored.
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id                 uuid primary key default gen_random_uuid(),
  full_name          text not null check (char_length(full_name) between 2 and 120),
  email              text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone              text check (char_length(phone) <= 32),
  company            text check (char_length(company) <= 160),
  business_type      text check (char_length(business_type) <= 120),
  project_type       text not null check (project_type in (
                       'Business Website', 'E-commerce Website', 'Full-Stack Web Application',
                       'AI Chatbot Integration', 'Business Management System', 'API Integration',
                       'Existing Website Improvement', 'Other')),
  description        text not null check (char_length(description) between 20 and 5000),
  required_features  text check (char_length(required_features) <= 3000),
  budget             text check (char_length(budget) <= 60),
  timeline           text check (char_length(timeline) <= 60),
  preferred_contact  text not null default 'Email' check (preferred_contact in ('Email', 'Phone', 'WhatsApp')),
  status             text not null default 'new' check (status in (
                       'new', 'contacted', 'in_discussion', 'proposal_sent', 'converted', 'rejected')),
  admin_notes        text check (char_length(admin_notes) <= 5000),
  source             text not null default 'website' check (source in ('website', 'chatbot')),
  dedupe_hash        text not null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);
create index if not exists inquiries_dedupe_idx on public.inquiries (dedupe_hash, created_at desc);
create trigger inquiries_updated_at before update on public.inquiries
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles     enable row level security;
alter table public.services     enable row level security;
alter table public.projects     enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs         enable row level security;
alter table public.inquiries    enable row level security;

-- profiles: users read their own; admins read all. Nobody can self-promote
-- (no update policy for non-admins; role changes happen via SQL editor).
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_update" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Published content is public.
create policy "services_public_read" on public.services
  for select to anon, authenticated using (is_published or public.is_admin());
create policy "projects_public_read" on public.projects
  for select to anon, authenticated using (is_published or public.is_admin());
create policy "faqs_public_read" on public.faqs
  for select to anon, authenticated using (is_published or public.is_admin());
-- Testimonials must be BOTH published and verified to be public.
create policy "testimonials_public_read" on public.testimonials
  for select to anon, authenticated using ((is_published and is_verified) or public.is_admin());

-- Admin write access to content.
create policy "services_admin_write" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "projects_admin_write" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "faqs_admin_write" on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "testimonials_admin_write" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Inquiries: admin read/update/delete only. No anon policy -> anon cannot read
-- or insert directly; inserts go through the backend (service role).
create policy "inquiries_admin_select" on public.inquiries
  for select to authenticated using (public.is_admin());
create policy "inquiries_admin_update" on public.inquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "inquiries_admin_delete" on public.inquiries
  for delete to authenticated using (public.is_admin());

-- =====================================================================
-- Storage: public-read bucket for project screenshots.
-- Uploads are performed by the backend after admin authorization.
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 5242880,
        array['image/png', 'image/jpeg', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "project_images_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'project-images');
create policy "project_images_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());
