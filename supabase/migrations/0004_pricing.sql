-- Pricing tiers (cards above the comparison table) and pricing features
-- (rows of the comparison table). Both are managed via the admin panel.

create table if not exists public.pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text not null,
  period text not null default '',
  description_top text not null default '',
  description_bottom text not null default '',
  cta_label text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_features (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value_free text not null default '',
  value_basic text not null default '',
  value_core text not null default '',
  value_pro text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists pricing_tiers_touch on public.pricing_tiers;
create trigger pricing_tiers_touch before update on public.pricing_tiers
  for each row execute function public.touch_updated_at();

drop trigger if exists pricing_features_touch on public.pricing_features;
create trigger pricing_features_touch before update on public.pricing_features
  for each row execute function public.touch_updated_at();

alter table public.pricing_tiers enable row level security;
alter table public.pricing_features enable row level security;

drop policy if exists "public read published pricing_tiers" on public.pricing_tiers;
create policy "public read published pricing_tiers" on public.pricing_tiers
  for select using (published = true);

drop policy if exists "public read published pricing_features" on public.pricing_features;
create policy "public read published pricing_features" on public.pricing_features
  for select using (published = true);

-- Explicit anon/authenticated deny for writes (defense-in-depth).
do $$
declare
  tbl text;
  op text;
  policy_name text;
  using_clause text;
begin
  foreach tbl in array array['pricing_tiers', 'pricing_features']
  loop
    foreach op in array array['insert', 'update', 'delete']
    loop
      policy_name := format('deny anon %s on %s', op, tbl);
      using_clause := case
        when op = 'insert' then 'with check (false)'
        when op = 'update' then 'using (false) with check (false)'
        else 'using (false)'
      end;
      execute format('drop policy if exists %I on public.%I', policy_name, tbl);
      execute format(
        'create policy %I on public.%I for %s to anon, authenticated %s',
        policy_name, tbl, op, using_clause
      );
    end loop;
  end loop;
end
$$;

create index if not exists pricing_tiers_sort_idx on public.pricing_tiers (sort_order);
create index if not exists pricing_features_sort_idx on public.pricing_features (sort_order);
