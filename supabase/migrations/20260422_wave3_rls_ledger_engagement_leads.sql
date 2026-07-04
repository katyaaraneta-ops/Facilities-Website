-- Facilities, Incorporated — Wave 3: RLS fixes for sensitive/event tables
--
-- Scope ONLY:
-- - public.lease_cancellation_ledger
-- - public.unit_engagement_events
-- - public.leads (if it exists)
--
-- Safety:
-- - Idempotent/re-runnable where possible
-- - Skips objects that don't exist
-- - No data deletion, no destructive table changes, does not disable RLS

begin;

-- -----------------------------------------------------------------------------
-- 1) public.lease_cancellation_ledger
-- -----------------------------------------------------------------------------
do $$
declare
  p record;
begin
  if to_regclass('public.lease_cancellation_ledger') is null then
    return;
  end if;

  execute 'alter table public.lease_cancellation_ledger enable row level security';

  -- Drop named policy if present
  execute 'drop policy if exists "Admin full access to lease cancellation ledger" on public.lease_cancellation_ledger';

  -- Drop any other overly-permissive policies on this table (true qual/with_check)
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'lease_cancellation_ledger'
      and cmd in ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL')
      and (
        coalesce(qual, '') ~* '^(\\(true\\)|true)$'
        or coalesce(with_check, '') ~* '^(\\(true\\)|true)$'
      )
  loop
    execute format('drop policy if exists %I on public.lease_cancellation_ledger', p.policyname);
  end loop;

  -- Recreate as admin-only
  execute $pol$
    create policy "Admin full access to lease cancellation ledger"
      on public.lease_cancellation_ledger
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin())
  $pol$;

  -- Privileges: authenticated only (RLS still enforces)
  execute 'revoke all on table public.lease_cancellation_ledger from anon';
  execute 'grant select, insert, update, delete on table public.lease_cancellation_ledger to authenticated';
end $$;

-- -----------------------------------------------------------------------------
-- 2) public.unit_engagement_events
-- -----------------------------------------------------------------------------
do $$
declare
  p record;
begin
  if to_regclass('public.unit_engagement_events') is null then
    return;
  end if;

  execute 'alter table public.unit_engagement_events enable row level security';

  -- Drop known existing policies (safe if absent)
  execute 'drop policy if exists "Public can insert engagement events" on public.unit_engagement_events';
  execute 'drop policy if exists "Admin can read engagement events" on public.unit_engagement_events';
  execute 'drop policy if exists "Admin can read all engagement events" on public.unit_engagement_events';

  -- Drop any overly-permissive SELECT/UPDATE/DELETE/ALL policies using true
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'unit_engagement_events'
      and cmd in ('SELECT', 'UPDATE', 'DELETE', 'ALL')
      and (
        coalesce(qual, '') ~* '^(\\(true\\)|true)$'
        or coalesce(with_check, '') ~* '^(\\(true\\)|true)$'
      )
  loop
    execute format('drop policy if exists %I on public.unit_engagement_events', p.policyname);
  end loop;

  -- Replace public INSERT policy with real validation (no WITH CHECK true)
  execute $pol$
    create policy "Public can insert valid engagement events"
      on public.unit_engagement_events
      for insert
      to anon, authenticated
      with check (
        event_type is not null
        and page_path is not null
        and char_length(page_path) between 1 and 500
        and event_type in ('unit_view', 'unit_inquiry')
        and (
          unit_id is null
          or exists (
            select 1
            from public.units u
            where u.id = unit_engagement_events.unit_id
          )
        )
      )
  $pol$;

  -- Admin-only reads
  execute $pol$
    create policy "Admins can read engagement events"
      on public.unit_engagement_events
      for select
      to authenticated
      using (public.is_admin())
  $pol$;

  -- Privileges: allow insert for anon/auth, allow select for authenticated (RLS gates to admins)
  execute 'grant insert on table public.unit_engagement_events to anon, authenticated';
  execute 'grant select on table public.unit_engagement_events to authenticated';
end $$;

-- -----------------------------------------------------------------------------
-- 3) public.leads (if exists) — column-aware policy generation
-- -----------------------------------------------------------------------------
do $$
declare
  leads_exists boolean := (to_regclass('public.leads') is not null);
  conds text[] := array[]::text[];
  col record;
  with_check_sql text;
begin
  if not leads_exists then
    return;
  end if;

  execute 'alter table public.leads enable row level security';

  -- Drop known policies (safe if absent)
  execute 'drop policy if exists "Public can submit leads" on public.leads';
  execute 'drop policy if exists "Public can submit valid leads" on public.leads';
  execute 'drop policy if exists "Admins can read leads" on public.leads';
  execute 'drop policy if exists "Allow update for authenticated users" on public.leads';
  execute 'drop policy if exists "Admins can update leads" on public.leads';

  -- Drop any overly-permissive SELECT/INSERT/UPDATE/DELETE/ALL policies using true
  for col in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and cmd in ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'ALL')
      and (
        coalesce(qual, '') ~* '^(\\(true\\)|true)$'
        or coalesce(with_check, '') ~* '^(\\(true\\)|true)$'
      )
  loop
    execute format('drop policy if exists %I on public.leads', col.policyname);
  end loop;

  -- Build validation only using columns that exist.
  -- We validate "name/contact/message-like" fields if present, without requiring non-existent columns.
  for col in
    select a.attname as name
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'leads'
      and a.attnum > 0
      and not a.attisdropped
  loop
    if col.name in ('name', 'full_name', 'first_name', 'last_name') then
      conds := conds || format('char_length(btrim(%I)) between 1 and 200', col.name);
    elsif col.name in ('email', 'email_address') then
      conds := conds || format('char_length(btrim(%I)) between 5 and 320', col.name);
      conds := conds || format('position(''@'' in %I) > 1', col.name);
    elsif col.name in ('phone', 'phone_number', 'contact_phone') then
      conds := conds || format('char_length(btrim(%I)) between 7 and 50', col.name);
    elsif col.name in ('contact', 'contact_info') then
      conds := conds || format('char_length(btrim(%I)) between 3 and 320', col.name);
    elsif col.name in ('message', 'notes', 'inquiry', 'details') then
      conds := conds || format('char_length(btrim(%I)) between 1 and 5000', col.name);
    end if;
  end loop;

  if array_length(conds, 1) is null then
    -- If we can't infer any validation columns, still prevent unrestricted inserts.
    -- Require the user to be authenticated; callers can still submit leads via auth.
    with_check_sql := 'auth.uid() is not null';
  else
    with_check_sql := array_to_string(conds, ' and ');
  end if;

  execute format($pol$
    create policy "Public can submit valid leads"
      on public.leads
      for insert
      to anon, authenticated
      with check (%s)
  $pol$, with_check_sql);

  execute $pol$
    create policy "Admins can read leads"
      on public.leads
      for select
      to authenticated
      using (public.is_admin())
  $pol$;

  execute $pol$
    create policy "Admins can update leads"
      on public.leads
      for update
      to authenticated
      using (public.is_admin())
      with check (public.is_admin())
  $pol$;

  -- Privileges:
  -- - anon can INSERT (public lead submission)
  -- - anon cannot SELECT/UPDATE/DELETE
  -- - authenticated can INSERT
  -- - authenticated can SELECT (RLS gates reads to admins via public.is_admin())
  execute 'revoke select, update, delete on table public.leads from anon';
  execute 'grant insert on table public.leads to anon, authenticated';
  execute 'grant select on table public.leads to authenticated';
  execute 'grant update on table public.leads to authenticated';
end $$;

-- -----------------------------------------------------------------------------
-- Verification (run manually in Supabase SQL Editor)
-- -----------------------------------------------------------------------------
-- Check RLS:
--   select tablename, rowsecurity
--   from pg_tables
--   where schemaname = 'public'
--     and tablename in ('lease_cancellation_ledger', 'unit_engagement_events', 'leads');
--
-- Check policies:
--   select schemaname, tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies
--   where schemaname = 'public'
--     and tablename in ('lease_cancellation_ledger', 'unit_engagement_events', 'leads')
--   order by tablename, policyname;

commit;

