-- =============================================================================
-- Geo backfill UPDATE policy — run ONCE in Supabase Dashboard → SQL Editor,
-- after visits.sql and harden-visits-rls.sql have been applied. Safe to re-run.
--
-- Allows the static client to patch rows that were inserted as countryCode 'XX'
-- when a later geo lookup or sibling inference resolves the location. Only geo
-- fields may change; id and device/page metadata stay immutable.
-- =============================================================================

grant update ("countryCode", "countryName", city, region) on public.visits to anon, authenticated;

drop policy if exists "Allow geo backfill update" on public.visits;
create policy "Allow geo backfill update"
  on public.visits
  for update
  to anon, authenticated
  using ("countryCode" = 'XX')
  with check (
    "countryCode" <> 'XX'
    and char_length("countryCode") = 2
    and char_length("countryName") <= 100
    and char_length(city) <= 100
    and char_length(region) <= 100
  );

-- Verify: should succeed (0 rows updated is fine)
-- update public.visits set "countryCode" = 'XX' where false;
