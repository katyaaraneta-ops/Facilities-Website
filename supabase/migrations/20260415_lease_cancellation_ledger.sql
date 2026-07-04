-- Lease Cancellation Ledger
-- Track revenue lost from early lease terminations for analytics

create table if not exists public.lease_cancellation_ledger (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references public.units(id) on delete set null,
  unit_number text not null,
  building_name text not null,
  lost_revenue_value numeric not null default 0,
  months_stayed integer not null default 0,
  original_contract_length integer not null default 0,
  cancelled_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Index for analytics queries
create index if not exists idx_lease_cancellation_ledger_cancelled_at
  on public.lease_cancellation_ledger (cancelled_at desc);

create index if not exists idx_lease_cancellation_ledger_unit_id
  on public.lease_cancellation_ledger (unit_id);

-- Enable RLS
alter table public.lease_cancellation_ledger enable row level security;

-- Admin can read/write
create policy "Admin full access to lease cancellation ledger"
  on public.lease_cancellation_ledger
  for all
  using (true)
  with check (true);
