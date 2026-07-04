-- Facilities, Incorporated — Wave 4: pin function search_path (Security Advisor 0011)
--
-- Scope ONLY:
-- - public.set_updated_at()
-- - public.derive_unit_ordering_fields(unit_number_in text)
-- - public.trg_units_derive_ordering()
--
-- Goal: preserve signatures + logic, add `SET search_path = ''` to each function.

begin;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.derive_unit_ordering_fields(unit_number_in text)
returns table (floor_label text, floor_sort numeric, unit_sort numeric)
language plpgsql
set search_path = ''
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

create or replace function public.trg_units_derive_ordering()
returns trigger
language plpgsql
set search_path = ''
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

commit;

