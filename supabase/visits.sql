-- =============================================================================
-- Portfolio visitor analytics — run ONCE in Supabase Dashboard → SQL Editor
-- (Do NOT use the Migrations tab if it shows schema_migrations errors)
-- =============================================================================

create table if not exists public.visits (
  id text primary key,
  "countryCode" text not null,
  "countryName" text not null,
  city text not null default '',
  region text not null default '',
  "deviceType" text not null,
  "deviceLabel" text not null,
  browser text not null,
  os text not null,
  page text not null,
  timestamp timestamptz not null default now()
);

-- Required for API access (publishable key uses the anon role)
grant usage on schema public to anon, authenticated;
grant select, insert on public.visits to anon, authenticated;

alter table public.visits enable row level security;

drop policy if exists "Allow anonymous read" on public.visits;
create policy "Allow anonymous read"
  on public.visits
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow anonymous insert" on public.visits;
create policy "Allow anonymous insert"
  on public.visits
  for insert
  to anon, authenticated
  with check (true);

-- Verify (should return 0 rows, not an error)
select count(*) as visits_count from public.visits;
