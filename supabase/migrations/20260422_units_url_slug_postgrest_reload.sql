-- Facilities, Incorporated — sync `units.url_slug` + reload PostgREST schema cache
--
-- Purpose:
-- - Keep repo migrations in sync with a manual SQL change already applied in Supabase.
-- - Minimal change: ensure the column exists, then notify PostgREST to reload schema.
--
-- IMPORTANT:
-- - This migration intentionally does NOT backfill, add constraints, or create indexes.
-- - It only adds the column if missing.

begin;

alter table public.units
  add column if not exists url_slug text;

-- Ask PostgREST to reload schema cache (Supabase standard channel/payload).
notify pgrst, 'reload schema';

commit;

