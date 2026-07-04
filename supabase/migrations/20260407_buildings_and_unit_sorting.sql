-- Facilities, Incorporated
-- Migration: Buildings identity + unit ordering metadata
-- Date: 2026-04-07
--
-- How to apply:
-- - Paste into Supabase SQL Editor and run (or split into safe batches).
-- - Review the BACKFILL section carefully before running in production.

begin;

-- 1) Building identity hardening
create table if not exists public.buildings (
  id uuid primary key default gen_random_uuid(),
  building_key text not null unique,
  building_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_buildings_updated_at on public.buildings;
create trigger trg_buildings_updated_at
before update on public.buildings
for each row execute function public.set_updated_at();

-- Seed stable building keys (idempotent)
insert into public.buildings (building_key, building_name)
values
  ('summit-one', 'Summit One Tower'),
  ('facilities-centre', 'Facilities Centre')
on conflict (building_key) do update
set building_name = excluded.building_name;

-- Add FK to units (nullable first for zero-downtime)
alter table public.units
  add column if not exists building_id uuid;

alter table public.units
  add constraint units_building_id_fkey
  foreign key (building_id) references public.buildings(id)
  on update cascade
  on delete restrict
  not valid;

-- Validate FK separately after backfill

-- 2) Ordering metadata fields
alter table public.units
  add column if not exists floor_label text,
  add column if not exists floor_sort numeric,
  add column if not exists unit_sort numeric,
  add column if not exists sort_version text not null default 'v1';

-- 3) Derivation helper (single source of truth)
create or replace function public.derive_unit_ordering_fields(unit_number_in text)
returns table (floor_label text, floor_sort numeric, unit_sort numeric)
language plpgsql
as $$
declare
  u text := upper(trim(coalesce(unit_number_in, '')));
  num_suffix text;
  n bigint;
  floor_n int;
begin
  -- Unknown / empty
  if u = '' then
    floor_label := 'Uncategorized';
    floor_sort := 98;
    unit_sort := null;
    return next;
    return;
  end if;

  -- PB / base group: PB*, GRD MEZZ*, M\d+
  if u like 'PB%' or u like 'GRD MEZZ%' or u ~ '^M[0-9]+$' then
    floor_label := 'Podium/Base (PB)';
    floor_sort := 0;
    -- numeric suffix if present (PB327 -> 327, M03 -> 3)
    num_suffix := nullif(regexp_replace(u, '[^0-9]+', '', 'g'), '');
    unit_sort := case when num_suffix is null then null else num_suffix::numeric end;
    return next;
    return;
  end if;

  -- Roof deck: RD-*
  if u like 'RD-%' then
    floor_label := 'Roof Deck (RD)';
    floor_sort := 99;
    num_suffix := nullif(regexp_replace(u, '[^0-9]+', '', 'g'), '');
    unit_sort := case when num_suffix is null then null else num_suffix::numeric end;
    return next;
    return;
  end if;

  -- Pure numeric unit numbers (3 or 4+ digits)
  if u ~ '^[0-9]+$' then
    n := u::bigint;
    if length(u) >= 4 then
      floor_n := substring(u from 1 for 2)::int;
    elsif length(u) = 3 then
      floor_n := substring(u from 1 for 1)::int;
    else
      -- 1-2 digit "unit numbers" aren't expected; treat as Uncategorized
      floor_n := null;
    end if;

    if floor_n is null then
      floor_label := 'Uncategorized';
      floor_sort := 98;
      unit_sort := null;
      return next;
      return;
    end if;

    floor_label := floor_n::text || 'th Floor';
    floor_sort := floor_n;
    unit_sort := n::numeric;
    return next;
    return;
  end if;

  -- Alphanumeric units with leading floor digits (e.g., 23E, 24I, 8A)
  if u ~ '^[0-9]+[A-Z]+$' then
    floor_n := substring(u from '^[0-9]+')::int;
    floor_label := floor_n::text || 'th Floor';
    floor_sort := floor_n;
    unit_sort := (floor_n * 1000)::numeric;
    return next;
    return;
  end if;

  -- Fallback
  floor_label := 'Uncategorized';
  floor_sort := 98;
  unit_sort := null;
  return next;
end;
$$;

-- 4) BACKFILL (existing rows)
-- 4a) building_id
update public.units u
set building_id = b.id
from public.buildings b
where u.building_id is null
  and (
    (b.building_key = 'summit-one' and u.building_name = 'Summit One Tower')
    or
    (b.building_key = 'facilities-centre' and u.building_name = 'Facilities Centre')
  );

-- 4b) ordering metadata (safe fallback included)
update public.units u
set
  floor_label = d.floor_label,
  floor_sort = d.floor_sort,
  unit_sort = d.unit_sort
from public.units src
cross join lateral public.derive_unit_ordering_fields(src.unit_number) as d
where src.id = u.id
  and (u.floor_label is null or u.floor_sort is null);

-- 5) Guardrails (constraints + indexes)
-- Constraints are added as NOT VALID first so they can be validated after cleanup.
alter table public.units
  add constraint units_floor_sort_nonnegative check (floor_sort >= 0) not valid;

alter table public.units
  add constraint units_unit_sort_nonnegative check (unit_sort is null or unit_sort >= 0) not valid;

alter table public.units
  add constraint units_floor_label_nonempty check (char_length(trim(floor_label)) > 0) not valid;

-- Ordering index (uses building_id; required for stable ordering at scale)
create index if not exists idx_units_building_ordering
  on public.units (building_id, floor_sort, floor_label, unit_sort, unit_number, id);

create index if not exists idx_units_building_floor_label
  on public.units (building_id, floor_label);

-- 6) Keep correct after backfill (trigger)
create or replace function public.trg_units_derive_ordering()
returns trigger
language plpgsql
as $$
declare
  d record;
begin
  select * into d from public.derive_unit_ordering_fields(new.unit_number);
  new.floor_label := d.floor_label;
  new.floor_sort := d.floor_sort;
  new.unit_sort := d.unit_sort;
  return new;
end;
$$;

drop trigger if exists trg_units_derive_ordering on public.units;
create trigger trg_units_derive_ordering
before insert or update of unit_number on public.units
for each row execute function public.trg_units_derive_ordering();

-- 7) Optional: enforce NOT NULLs after validation
-- After confirming Summit One + Facilities Centre rows are filled and FK backfill is complete:
--   alter table public.units validate constraint units_building_id_fkey;
--   alter table public.units validate constraint units_floor_sort_nonnegative;
--   alter table public.units validate constraint units_unit_sort_nonnegative;
--   alter table public.units validate constraint units_floor_label_nonempty;
--   alter table public.units alter column building_id set not null;
--   alter table public.units alter column floor_label set not null;
--   alter table public.units alter column floor_sort set not null;

commit;

