-- Unit Engagement Events
-- Track first-party view and inquiry events for popularity analytics

create table if not exists public.unit_engagement_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('unit_view', 'unit_inquiry')),
  unit_id uuid not null,
  unit_number text not null,
  building_name text not null,
  source text,
  page_path text,
  created_at timestamptz not null default now()
);

-- Indexes for analytics aggregation queries
create index if not exists idx_unit_engagement_events_unit_id
  on public.unit_engagement_events (unit_id);

create index if not exists idx_unit_engagement_events_event_type
  on public.unit_engagement_events (event_type);

create index if not exists idx_unit_engagement_events_created_at
  on public.unit_engagement_events (created_at desc);

create index if not exists idx_unit_engagement_events_unit_event_composite
  on public.unit_engagement_events (unit_id, event_type, created_at desc);

-- Enable RLS
alter table public.unit_engagement_events enable row level security;

-- Public can write (for tracking), admin can read all
create policy "Public can insert engagement events"
  on public.unit_engagement_events
  for insert
  with check (true);

create policy "Admin can read all engagement events"
  on public.unit_engagement_events
  for select
  using (true);
