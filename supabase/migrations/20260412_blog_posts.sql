-- Facilities, Incorporated
-- Migration: Blog posts with markdown content
-- Date: 2026-04-12
--
-- Creates blog_posts table and RLS policies.
-- Storage bucket: run supabase/migrations/20260412_blog_images_storage.sql

begin;

-- 1) Blog posts table
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content_markdown text not null,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Index for published post listing (newest first)
create index if not exists idx_blog_posts_published 
  on public.blog_posts (is_published, published_at desc);

-- 3) Updated_at trigger (reuses existing set_updated_at function)
drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

-- 4) Row-level security
alter table public.blog_posts enable row level security;

-- Policy: public can read published posts
create policy "Public read published posts"
  on public.blog_posts
  for select
  using (is_published = true);

-- Policy: authenticated users can do everything
create policy "Authenticated full access"
  on public.blog_posts
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

commit;
