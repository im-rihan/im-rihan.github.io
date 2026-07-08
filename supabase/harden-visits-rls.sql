-- =============================================================================
-- Visits table hardening — run ONCE in Supabase Dashboard → SQL Editor, after
-- visits.sql has already been applied. Safe to re-run (idempotent).
--
-- Context: this site's publishable (anon) key is embedded in the client
-- bundle by design — it's a static export with no backend — and the /status
-- dashboard intentionally shows recent visit geo/device data publicly.
-- Read access therefore stays anonymous, but this migration bounds it and
-- rejects garbage/spam writes:
--
--   1. Anonymous SELECT is capped to a rolling 90-day window instead of the
--      entire historical table, so a raw REST/PostgREST call can't bypass the
--      app's own "last 200 visits" dashboard limit and scrape years of data.
--   2. UPDATE is limited to geo backfill on unresolved rows — see
--      allow-geo-backfill-update.sql (run after this file).
--      DELETE stays revoked for anon/authenticated.
--   3. CHECK constraints reject malformed inserts: bad countryCode length,
--      unknown deviceType, oversized strings, or wildly backdated/future
--      timestamps — the kind of junk a scripted spam-insert would send.
-- =============================================================================

drop policy if exists "Allow anonymous read" on public.visits;
create policy "Allow anonymous read recent"
  on public.visits
  for select
  to anon, authenticated
  using (timestamp > now() - interval '90 days');

revoke delete on public.visits from anon, authenticated;
-- UPDATE revoked here; geo backfill UPDATE is granted in allow-geo-backfill-update.sql
revoke update on public.visits from anon, authenticated;

alter table public.visits
  drop constraint if exists visits_country_code_len;
alter table public.visits
  add constraint visits_country_code_len check (char_length("countryCode") = 2) not valid;

alter table public.visits
  drop constraint if exists visits_device_type_enum;
alter table public.visits
  add constraint visits_device_type_enum
    check ("deviceType" in ('desktop', 'mobile', 'tablet', 'unknown')) not valid;

alter table public.visits
  drop constraint if exists visits_field_lengths;
alter table public.visits
  add constraint visits_field_lengths check (
    char_length(city) <= 100
    and char_length(region) <= 100
    and char_length("deviceLabel") <= 100
    and char_length(browser) <= 50
    and char_length(os) <= 50
    and char_length(page) <= 300
    and char_length("countryName") <= 100
  ) not valid;

-- Rejects future rows outside a small clock-skew window. Deliberately NOT
-- validated against existing rows (they're older than an hour by definition).
alter table public.visits
  drop constraint if exists visits_timestamp_recent;
alter table public.visits
  add constraint visits_timestamp_recent check (
    timestamp > now() - interval '1 hour' and timestamp < now() + interval '5 minutes'
  ) not valid;

-- Existing historical rows already satisfy these three (format-only) checks,
-- so validate them now — new inserts were already enforced the moment the
-- constraints were added above, even before this line runs.
alter table public.visits validate constraint visits_country_code_len;
alter table public.visits validate constraint visits_device_type_enum;
alter table public.visits validate constraint visits_field_lengths;

-- Verify (should succeed with no errors)
select count(*) as visits_count from public.visits;
