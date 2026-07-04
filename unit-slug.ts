/**
 * URL segment for /units/:building/:unitRef — must stay aligned with
 * public.slugify_unit_segment() in supabase/migrations/20260420_units_url_slug.sql
 */
export function slugifyUnitSegment(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'unit';
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** True when the path segment is a legacy Supabase unit id (UUID v4). */
export function isUuidParam(s: string): boolean {
  return UUID_RE.test(s.trim());
}
