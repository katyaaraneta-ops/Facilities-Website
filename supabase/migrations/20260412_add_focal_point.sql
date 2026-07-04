-- Add focal point coordinates for blog cover images
-- Date: 2026-04-12
-- 
-- Adds cover_focus_x and cover_focus_y columns to store object-position values (0-100%)

begin;

alter table public.blog_posts
  add column if not exists cover_focus_x numeric(5,2) default 50.00,
  add column if not exists cover_focus_y numeric(5,2) default 50.00;

comment on column public.blog_posts.cover_focus_x is 'Horizontal focal point for cover image (0-100%, default 50 = center)';
comment on column public.blog_posts.cover_focus_y is 'Vertical focal point for cover image (0-100%, default 50 = center)';

commit;
