-- Facilities, Incorporated — public unit URL slugs (building-scoped uniqueness)
begin;

-- Matches app-side slugifyUnitSegment() in unit-slug.ts
create or replace function public.slugify_unit_segment(raw text)
returns text
language plpgsql
immutable
as $$
declare
  s text;
begin
  s := lower(trim(coalesce(raw, '')));
  s := regexp_replace(s, '\s+', '-', 'g');
  s := regexp_replace(s, '[^a-z0-9-]+', '-', 'g');
  s := regexp_replace(s, '-+', '-', 'g');
  s := trim(both '-' from s);
  if s = '' or s is null then
    return 'unit';
  end if;
  return s;
end;
$$;

-- Ensure building_id is set (same rules as 20260407 backfill)
update public.units u
set building_id = b.id
from public.buildings b
where u.building_id is null
  and (
    (b.building_key = 'summit-one' and u.building_name = 'Summit One Tower')
    or
    (b.building_key = 'facilities-centre' and u.building_name = 'Facilities Centre')
  );

do $$
begin
  if exists (select 1 from public.units where building_id is null) then
    raise exception 'units_url_slug: units.building_id is null for some rows; run building backfill or fix data';
  end if;
end $$;

alter table public.units
  add column if not exists url_slug text;

-- Per-building slug from unit_number; disambiguate duplicates with -2, -3, ...
with numbered as (
  select
    u.id,
    public.slugify_unit_segment(u.unit_number) as base_slug,
    row_number() over (
      partition by u.building_id, public.slugify_unit_segment(u.unit_number)
      order by u.id
    ) as rn
  from public.units u
  where u.building_id is not null
)
update public.units u
set url_slug = case
  when n.rn = 1 then n.base_slug
  else n.base_slug || '-' || n.rn::text
end
from numbered n
where u.id = n.id;

-- Any row still missing slug (e.g. null building_id): fail loudly
do $$
begin
  if exists (select 1 from public.units where url_slug is null or trim(url_slug) = '') then
    raise exception 'units_url_slug: backfill left empty url_slug; fix building_id / unit_number rows';
  end if;
end $$;

alter table public.units
  alter column url_slug set not null;

create unique index if not exists units_building_id_url_slug_key
  on public.units (building_id, url_slug);

commit;
