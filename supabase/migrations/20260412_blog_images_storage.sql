-- Facilities, Incorporated
-- Migration: Storage bucket + RLS for blog cover images
-- Date: 2026-04-12
--
-- Run in Supabase SQL Editor (same as other migrations).
-- Creates public bucket `blog-images` and policies: world-readable objects,
-- authenticated users can upload/update/delete within this bucket.

begin;

-- 1) Bucket (public: objects readable on web when paired with SELECT policy below)
-- Minimal columns for compatibility across Supabase versions; tune limits in Dashboard if needed.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

-- 2) Policies on storage.objects (idempotent re-run)
drop policy if exists "blog_images_public_read" on storage.objects;
drop policy if exists "blog_images_authenticated_insert" on storage.objects;
drop policy if exists "blog_images_authenticated_update" on storage.objects;
drop policy if exists "blog_images_authenticated_delete" on storage.objects;

-- Anyone can read objects in this bucket (public cover images on the site)
create policy "blog_images_public_read"
  on storage.objects
  for select
  using (bucket_id = 'blog-images');

-- Logged-in dashboard users can upload covers
create policy "blog_images_authenticated_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'blog-images');

create policy "blog_images_authenticated_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'blog-images')
  with check (bucket_id = 'blog-images');

create policy "blog_images_authenticated_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'blog-images');

commit;
