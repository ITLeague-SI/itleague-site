-- ITLeague initial schema: content tables for admin panel.
-- Public can read only rows where published = true. Writes gated via service-role key.

create extension if not exists pgcrypto;

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  photo_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null,
  alt text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists faqs_touch on public.faqs;
create trigger faqs_touch before update on public.faqs
  for each row execute function public.touch_updated_at();

drop trigger if exists testimonials_touch on public.testimonials;
create trigger testimonials_touch before update on public.testimonials
  for each row execute function public.touch_updated_at();

drop trigger if exists hero_slides_touch on public.hero_slides;
create trigger hero_slides_touch before update on public.hero_slides
  for each row execute function public.touch_updated_at();

drop trigger if exists experts_touch on public.experts;
create trigger experts_touch before update on public.experts
  for each row execute function public.touch_updated_at();

alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.hero_slides enable row level security;
alter table public.experts enable row level security;

drop policy if exists "public read published faqs" on public.faqs;
create policy "public read published faqs" on public.faqs
  for select using (published = true);

drop policy if exists "public read published testimonials" on public.testimonials;
create policy "public read published testimonials" on public.testimonials
  for select using (published = true);

drop policy if exists "public read published hero_slides" on public.hero_slides;
create policy "public read published hero_slides" on public.hero_slides
  for select using (published = true);

drop policy if exists "public read published experts" on public.experts;
create policy "public read published experts" on public.experts
  for select using (published = true);

create index if not exists faqs_sort_idx on public.faqs (sort_order);
create index if not exists testimonials_sort_idx on public.testimonials (sort_order);
create index if not exists hero_slides_sort_idx on public.hero_slides (sort_order);
create index if not exists experts_sort_idx on public.experts (sort_order);
