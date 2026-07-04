-- Grant INSERT permission to anon and authenticated roles
-- RLS policies alone aren't enough; PostgREST needs table-level grants

grant usage on schema public to anon, authenticated;

grant insert on public.unit_engagement_events to anon, authenticated;

grant select on public.unit_engagement_events to authenticated;
