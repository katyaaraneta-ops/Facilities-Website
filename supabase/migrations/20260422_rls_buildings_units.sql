-- Facilities, Incorporated — RLS for public buildings + units (Wave 2)
--
-- Scope: ONLY public.buildings and public.units.
-- Requirements:
-- - Public (anon + authenticated) can SELECT buildings + units.
-- - Only authenticated admins (public.is_admin() = true) may INSERT/UPDATE/DELETE buildings + units.
--
-- This migration is designed to be re-runnable (idempotent).

begin;

-- -----------------------------------------------------------------------------
-- public.buildings
-- -----------------------------------------------------------------------------

alter table public.buildings enable row level security;

-- Drop any explicitly named/known conflicting policies (safe if they don't exist)
drop policy if exists "Public read buildings" on public.buildings;
drop policy if exists "Admin insert buildings" on public.buildings;
drop policy if exists "Admin update buildings" on public.buildings;
drop policy if exists "Admin delete buildings" on public.buildings;

-- Also drop overly-permissive WRITE policies if present (USING/WITH CHECK always true)
do $$
declare
  p record;
begin
  for p in
    select policyname, cmd
    from pg_policies
    where schemaname = 'public'
      and tablename = 'buildings'
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      and (
        coalesce(qual, '') ~* '^(\\(true\\)|true)$'
        or coalesce(with_check, '') ~* '^(\\(true\\)|true)$'
      )
  loop
    execute format('drop policy if exists %I on public.buildings', p.policyname);
  end loop;
end $$;

create policy "Public read buildings"
  on public.buildings
  for select
  to anon, authenticated
  using (true);

create policy "Admin insert buildings"
  on public.buildings
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin update buildings"
  on public.buildings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin delete buildings"
  on public.buildings
  for delete
  to authenticated
  using (public.is_admin());

grant select on table public.buildings to anon, authenticated;
grant insert, update, delete on table public.buildings to authenticated;

-- -----------------------------------------------------------------------------
-- public.units
-- -----------------------------------------------------------------------------

alter table public.units enable row level security;

-- Drop the specific overly-permissive policies called out by Security Advisor
drop policy if exists "Admin Insert Access" on public.units;
drop policy if exists "Admin Update Access" on public.units;
drop policy if exists "Allow Admin Delete Access" on public.units;
drop policy if exists "Allow Admin Insert" on public.units;
drop policy if exists "Allow Admin Insert Access" on public.units;
drop policy if exists "Allow Admin Update Access" on public.units;

-- Drop any explicitly named policies we create here (for idempotency)
drop policy if exists "Public read units" on public.units;
drop policy if exists "Admin insert units" on public.units;
drop policy if exists "Admin update units" on public.units;
drop policy if exists "Admin delete units" on public.units;

-- Also drop any overly-permissive WRITE policies if present (USING/WITH CHECK always true)
do $$
declare
  p record;
begin
  for p in
    select policyname, cmd
    from pg_policies
    where schemaname = 'public'
      and tablename = 'units'
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      and (
        coalesce(qual, '') ~* '^(\\(true\\)|true)$'
        or coalesce(with_check, '') ~* '^(\\(true\\)|true)$'
      )
  loop
    execute format('drop policy if exists %I on public.units', p.policyname);
  end loop;
end $$;

create policy "Public read units"
  on public.units
  for select
  to anon, authenticated
  using (true);

create policy "Admin insert units"
  on public.units
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin update units"
  on public.units
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin delete units"
  on public.units
  for delete
  to authenticated
  using (public.is_admin());

grant select on table public.units to anon, authenticated;
grant insert, update, delete on table public.units to authenticated;

-- -----------------------------------------------------------------------------
-- Verification (run manually in Supabase SQL Editor)
-- -----------------------------------------------------------------------------
-- Check RLS enabled:
--   select tablename, rowsecurity
--   from pg_tables
--   where schemaname = 'public'
--     and tablename in ('buildings', 'units');
--
-- Check policies:
--   select schemaname, tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies
--   where schemaname = 'public'
--     and tablename in ('buildings', 'units')
--   order by tablename, policyname;

commit;

