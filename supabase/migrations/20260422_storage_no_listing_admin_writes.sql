-- Facilities, Incorporated — Wave 5: prevent public bucket listing; admin-only writes
--
-- Scope ONLY:
-- - storage.objects policies referencing bucket_id = 'blog-images'
-- - storage.objects policies referencing bucket_id = 'unit-images'
--
-- Goals:
-- - Remove broad SELECT/listing policies for these public buckets.
-- - Ensure only authenticated admins (public.is_admin()) can INSERT/UPDATE/DELETE in these buckets.
-- - Do NOT create public SELECT policies on storage.objects.
-- - Buckets remain public (public URL rendering relies on bucket visibility, not listing).

begin;

-- 1) Drop known broad listing policies (safe if absent)
drop policy if exists "blog_images_public_read" on storage.objects;
drop policy if exists "Allow Authenticated Uploads 1thdpep_1" on storage.objects;

-- 2) Drop any other existing policies referencing these buckets so we can safely
--    recreate admin-only write policies without leaving permissive leftovers.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (
        coalesce(qual, '') ilike '%blog-images%'
        or coalesce(with_check, '') ilike '%blog-images%'
        or coalesce(qual, '') ilike '%unit-images%'
        or coalesce(with_check, '') ilike '%unit-images%'
      )
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end $$;

-- 3) Admin-only write policies: blog-images
create policy "Admins can insert blog images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-images'
    and public.is_admin()
  );

create policy "Admins can update blog images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-images'
    and public.is_admin()
  )
  with check (
    bucket_id = 'blog-images'
    and public.is_admin()
  );

create policy "Admins can delete blog images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-images'
    and public.is_admin()
  );

-- 4) Admin-only write policies: unit-images
create policy "Admins can insert unit images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'unit-images'
    and public.is_admin()
  );

create policy "Admins can update unit images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'unit-images'
    and public.is_admin()
  )
  with check (
    bucket_id = 'unit-images'
    and public.is_admin()
  );

create policy "Admins can delete unit images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'unit-images'
    and public.is_admin()
  );

commit;

