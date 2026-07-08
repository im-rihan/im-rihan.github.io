-- =============================================================================
-- Purge stale unresolved visits — run manually or schedule via pg_cron.
--
-- Rows with countryCode 'XX' older than 30 days are usually unrecoverable
-- (geo provider failed permanently, bot traffic, or VPN with no inference).
-- Removing them keeps dashboard totals and country charts honest.
-- =============================================================================

delete from public.visits
where "countryCode" = 'XX'
  and timestamp < now() - interval '30 days';

-- Optional pg_cron schedule (enable pg_cron extension in Supabase first):
-- select cron.schedule(
--   'purge-unresolved-visits',
--   '0 3 * * *',
--   $$delete from public.visits where "countryCode" = 'XX' and timestamp < now() - interval '30 days'$$
-- );
