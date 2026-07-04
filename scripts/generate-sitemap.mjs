/**
 * Generates public/sitemap.xml from Supabase (same URL/key as supabaseClient.ts):
 * static hub URLs, published blog posts, and public unit detail URLs.
 * If `units.url_slug` is missing (migration not applied), slugs match `unit-slug.ts` + duplicate suffix rules.
 */
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const SUPABASE_URL = 'https://qriujbcdkawzziemyykd.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaXVqYmNka2F3enppZW15eWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjE2MzksImV4cCI6MjA4NjQ5NzYzOX0.MQTr8BgM4nzXF6YtYFszA091jk5r3FVx9yw_TA8N3Mo';

const SITE_ORIGIN = 'https://facilitiesinc.netlify.app';

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function dateOnly(iso, fallback) {
  if (!iso) return fallback;
  return String(iso).split('T')[0];
}

/** Must match `unit-slug.ts` / `slugify_unit_segment` in migrations. */
function slugifyUnitSegment(raw) {
  const s = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'unit';
}

/**
 * Returns `{ key, slug }` per public unit (contract_length !== 0).
 * Uses `url_slug` when the column exists; otherwise matches DB backfill rules for duplicates.
 */
async function fetchPublicUnitSegments(supabase) {
  const selectWithSlug =
    'id, url_slug, unit_number, contract_length, buildings(building_key)';
  let { data, error } = await supabase.from('units').select(selectWithSlug);

  let useDbSlug = true;
  if (
    error &&
    error.code === '42703' &&
    String(error.message || '').includes('url_slug')
  ) {
    useDbSlug = false;
    ({ data, error } = await supabase
      .from('units')
      .select('id, unit_number, contract_length, buildings(building_key)'));
  }

  if (error) {
    return { error, segments: [] };
  }

  const rows = (data || []).filter((u) => u.contract_length !== 0);

  if (useDbSlug) {
    const segments = rows
      .map((u) => {
        const key = u.buildings?.building_key;
        const slug =
          (u.url_slug && String(u.url_slug).trim()) ||
          slugifyUnitSegment(String(u.unit_number ?? ''));
        if (!key || !slug) return null;
        return { key, slug };
      })
      .filter(Boolean);
    return { error: null, segments };
  }

  const groups = new Map();
  for (const u of rows) {
    const bk = u.buildings?.building_key;
    if (!bk || u.unit_number == null) continue;
    const base = slugifyUnitSegment(String(u.unit_number));
    const gk = `${bk}\0${base}`;
    if (!groups.has(gk)) groups.set(gk, []);
    groups.get(gk).push(u);
  }

  const segments = [];
  for (const [, list] of groups) {
    list.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const base0 = slugifyUnitSegment(String(list[0].unit_number));
    list.forEach((u, i) => {
      const key = u.buildings?.building_key;
      const rn = i + 1;
      const slug = rn === 1 ? base0 : `${base0}-${rn}`;
      if (key) segments.push({ key, slug });
    });
  }

  return { error: null, segments };
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const today = new Date().toISOString().split('T')[0];

  const { error: unitsError, segments } = await fetchPublicUnitSegments(supabase);
  if (unitsError) {
    console.error('generate-sitemap: Supabase units error', unitsError);
    process.exit(1);
  }

  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select('slug, published_at, updated_at')
    .eq('is_published', true);

  if (postsError) {
    console.error('generate-sitemap: Supabase blog_posts error', postsError);
    process.exit(1);
  }

  const staticUrls = [
    { loc: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'monthly', lastmod: today },
    { loc: `${SITE_ORIGIN}/units/summit-one`, priority: '0.9', changefreq: 'weekly', lastmod: today },
    { loc: `${SITE_ORIGIN}/units/facilities-centre`, priority: '0.9', changefreq: 'weekly', lastmod: today },
    { loc: `${SITE_ORIGIN}/office-space-mandaluyong`, priority: '0.85', changefreq: 'monthly', lastmod: today },
    { loc: `${SITE_ORIGIN}/office-space-shaw-boulevard`, priority: '0.85', changefreq: 'monthly', lastmod: today },
    { loc: `${SITE_ORIGIN}/office-space-near-ortigas`, priority: '0.85', changefreq: 'monthly', lastmod: today },
    { loc: `${SITE_ORIGIN}/office-rental-mandaluyong`, priority: '0.85', changefreq: 'monthly', lastmod: today },
    { loc: `${SITE_ORIGIN}/blog`, priority: '0.8', changefreq: 'weekly', lastmod: today },
  ];

  const unitUrls = segments
    .map(({ key, slug }) => ({
      loc: `${SITE_ORIGIN}/units/${key}/${slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: today,
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const blogUrls = (posts || [])
    .filter((p) => p.slug)
    .map((p) => ({
      loc: `${SITE_ORIGIN}/blog/${p.slug}`,
      priority: '0.75',
      changefreq: 'monthly',
      lastmod: dateOnly(p.published_at || p.updated_at, today),
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const all = [...staticUrls, ...unitUrls, ...blogUrls];

  const body = all
    .map(
      (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${body}

</urlset>
`;

  writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log(
    `Wrote ${publicDir}/sitemap.xml (${all.length} URLs: ${unitUrls.length} unit pages, ${blogUrls.length} blog posts).`
  );
}

main();
