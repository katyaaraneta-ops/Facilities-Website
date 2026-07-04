-- Facilities, Incorporated — Admin allowlist for RLS
-- Wave 1: Create admin allowlist + helper predicate only.
--
-- Notes:
-- - This project is a client-side app using the anon key, so RLS is the enforcement layer.
-- - `public.is_admin()` is SECURITY INVOKER and `SET search_path = ''` as required.
-- - RLS on `public.admin_users` is configured to avoid policy recursion while allowing
--   `public.is_admin()` to check membership safely.

begin;

-- 1) Admin allowlist table
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2) Lock it down with RLS
alter table public.admin_users enable row level security;

-- 3) Helper predicate for admin-gated policies
-- SECURITY INVOKER + STABLE: evaluates in the caller's context, safe for RLS usage.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    auth.uid() is not null
    and exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
    );
$$;

-- 4) Policies: do not expose to anon; allow authenticated users to read their own row.
-- This supports `public.is_admin()` membership checks without requiring broad listing.
drop policy if exists "Admins can view admin allowlist" on public.admin_users;
drop policy if exists "Users can view own admin allowlist row" on public.admin_users;

create policy "Users can view own admin allowlist row"
  on public.admin_users
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 5) Privileges: authenticated may SELECT (still gated by RLS); anon gets nothing.
revoke all on table public.admin_users from anon;
grant select on table public.admin_users to authenticated;

commit;

