# Facilities Inc. — SEO Audit & Content Plan

**Date:** April 2026
**Site:** facilitiesinc.netlify.app
**Goal:** Rank on Google for office space searches in Mandaluyong / Metro Manila; drive qualified leasing inquiries

---

## Part 1: SEO Audit

### 1.1 Meta Tags — Current State & Recommendations

Meta titles and descriptions are the single most important quick wins for Google. Every page needs a unique, keyword-rich meta title (50–60 characters) and meta description (150–160 characters).

#### Homepage
| Field | Current (estimated) | Recommended |
|---|---|---|
| **Meta Title** | Facilities, Incorporated | `Office Space for Rent in Mandaluyong — Facilities Inc` |
| **Meta Description** | (likely blank or generic) | `Lease office space in Summit One Tower and Facilities Centre along Shaw Boulevard, Mandaluyong. PEZA-accredited units available. Inquire today.` |

#### Summit One Tower page
| Field | Recommended |
|---|---|
| **Meta Title** | `Office Space for Rent in Summit One Tower, Shaw Boulevard` |
| **Meta Description** | `Premium fitted office units for lease at Summit One Tower — the tallest building on Shaw Blvd. PEZA-accredited. Full fiber-optic. 100% backup power. View available units.` |

#### Facilities Centre page
| Field | Recommended |
|---|---|
| **Meta Title** | `Commercial Office Space for Rent — Facilities Centre, Mandaluyong` |
| **Meta Description** | `PEZA-accredited commercial hub on Shaw Boulevard with anchor banking tenants, ground-floor retail, and ample parking. Schedule a viewing with our leasing team.` |

#### Projects page
| Field | Recommended |
|---|---|
| **Meta Title** | `Projects — Facilities, Incorporated \| Real Estate Developer Manila` |
| **Meta Description** | `Explore landmark real estate developments by Facilities Inc. — including Summit One Tower, Facilities Centre, and Palladium Subdivision in Mandaluyong.` |

#### Blog index
| Field | Recommended |
|---|---|
| **Meta Title** | `Commercial Real Estate Blog — Mandaluyong Office Space Insights` |
| **Meta Description** | `Tips, guides, and market updates on leasing office space in Mandaluyong and Metro Manila from the team at Facilities, Incorporated.` |

#### Contact page
| Field | Recommended |
|---|---|
| **Meta Title** | `Contact Facilities Inc. — Office Space Leasing Inquiries` |
| **Meta Description** | `Get in touch with our leasing team for office units at Summit One Tower and Facilities Centre. Call, email, or submit an inquiry online.` |

---

### 1.2 On-Page SEO — Quick Wins

These are fixes that can be made directly in your site builder without creating new content:

| Issue | Fix |
|---|---|
| **Homepage H1** is "Office Space for Rent in Mandaluyong — Facilities Inc" — ✅ good | Keep this exactly. It's your most important keyword phrase. |
| **Alt text on images** — all property photos likely have no alt text | Add descriptive alt text: `Summit One Tower exterior — 46-storey office building on Shaw Boulevard, Mandaluyong` |
| **Unit listing page title** uses a good keyword pattern — ✅ | Maintain this format: `Office Units for Rent in [Building], Shaw Boulevard` |
| **Internal linking** — blog articles should link to relevant unit listing pages | End every blog post with a link to the Summit One Tower or Facilities Centre unit pages |
| **Contact email** — mercy.laurenciano@gmail.com on the public contact page | Not an SEO issue per se, but it can affect trust signals. Consider a branded email if possible. |
| **Page URLs** | Should be clean and keyword-friendly. e.g., `/projects/summit-one-tower` rather than `/projects/abc123` |
| **Schema markup** — not visible but likely absent | Add `LocalBusiness` and `RealEstateAgent` schema to your homepage and contact page (see Section 1.3) |

---

### 1.3 Schema Markup (Structured Data)

Add this JSON-LD to your homepage `<head>` to help Google understand your business. This powers Knowledge Panel and local search results:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Facilities, Incorporated",
  "url": "https://facilitiesinc.netlify.app",
  "logo": "https://facilitiesinc.netlify.app/logo.png",
  "description": "Family-owned real estate developer leasing premium office space in Summit One Tower and Facilities Centre along Shaw Boulevard, Mandaluyong City, Philippines.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "23/F Summit One Tower, Shaw Boulevard",
    "addressLocality": "Mandaluyong City",
    "addressCountry": "PH"
  },
  "telephone": "+639335383815",
  "email": "mercy.laurenciano@gmail.com",
  "foundingDate": "1960",
  "areaServed": "Metro Manila"
}
```

---

### 1.4 Target Keywords by Priority

#### Tier 1 — High intent, direct competitors (go after these first)
- `office space for rent in mandaluyong`
- `office space shaw boulevard`
- `summit one tower office for rent`
- `peza accredited office space mandaluyong`
- `office for rent near mrt shaw`

#### Tier 2 — Informational, blog-appropriate
- `how to lease office space in mandaluyong`
- `mandaluyong office space guide`
- `fitted vs bare office space philippines`
- `office space price per sqm mandaluyong`
- `peza benefits philippines office tenants`

#### Tier 3 — Brand / direct
- `facilities incorporated mandaluyong`
- `facilities centre shaw boulevard`
- `summit one tower mandaluyong office`

---

### 1.5 Google Business Profile

If Facilities Inc. doesn't have a verified **Google Business Profile** (formerly Google My Business), this is the highest-impact free action you can take. It will:
- Show your business in Google Maps results
- Display your units, contact info, and photos in the search sidebar
- Let you collect Google Reviews (trust signal for brokers and tenants)

**Action:** Go to business.google.com, claim the listing for "Facilities, Incorporated" at 23/F Summit One Tower, Mandaluyong City, and verify by postcard or phone.

---

## Part 2: Blog Content Plan — May to July 2026

### Strategy

Google's ranking algorithm is roughly 30% on-page SEO and 70% authority (backlinks) and content depth. A competitor with more backlinks will outrank you even if your on-page SEO is better. Content gives Google reason to show you in results — and gives other sites a reason to link to you. These two efforts (content + backlinks) run in parallel.

- **Goal:** Rank for Tier 1 and Tier 2 keywords above; bring in brokers and company owners at the research stage
- **Cadence:** 2 posts per month (manageable, consistent)
- **Format:** 900–1,400 words, 1 hero image, numbered or structured subheadings, CTA at bottom
- **Voice:** Helpful expert (see brand guidelines) — informational first, Facilities Inc. mentioned naturally

---

### Blog Post Template (Use for Every Article)

Every post should follow this structure to maximize SEO performance:

1. **H1:** Primary keyword (e.g., "How Much Does Office Rent Cost in Mandaluyong?")
2. **Intro:** Hook + relevance statement — why this matters to the reader
3. **H2 sections:** 3–5 subsections, each naturally incorporating secondary keywords
4. **Data/examples:** Include your actual pricing, your buildings, and visuals where possible
5. **FAQ section:** Answer question-based searches (e.g., "What's included in office rent?")
6. **Internal links:** Minimum 3–5 links back to unit pages, listing pages, and homepage
7. **Call-to-action:** "Ready to view units? Contact us." — link to inquiry form
8. **Meta description:** 150–160 characters with the primary keyword included

---

### Month 1 — Foundation (May 2026)

#### Post 1: Already published ✅
**"Office Space for Rent in Mandaluyong"** (April 12, 2026)
- Already live — good foundation
- **Improvement needed:** Add internal links to Summit One Tower and Facilities Centre unit pages at the bottom
- **CTA to add:** "Browse available units at Summit One Tower →"

#### Post 2: Pricing guide ⭐ Priority
**Title:** `How Much Does Office Space Cost in Mandaluyong? (2026 Price Guide)`
**Target keywords:** `office space price per sqm mandaluyong`, `how much does office rent cost mandaluyong`
**Angle:** Walk through what drives pricing — floor level, fitted vs. bare, building grade, association dues. Use your own unit pricing as real examples. Be transparent; readers will trust you more for it.
**Include:** A simple comparison table with price ranges per sqm for different building grades in the corridor
**CTA:** "Request current pricing for Summit One Tower units →"
**Backlink opportunity:** Share this post when listing on Lamudi and other directories

#### Post 3: Shaw Boulevard area guide
**Title:** `Shaw Boulevard Mandaluyong — Business Area Guide`
**Target keywords:** `office space shaw boulevard`, `shaw boulevard mandaluyong business district`
**Angle:** Practical guide to the corridor — MRT access, parking, nearby amenities, types of businesses operating here. The honest insider's view.
**CTA:** Link to both Summit One Tower and Facilities Centre

---

### Month 2 — Authority Building (June 2026)

#### Post 4: PEZA explainer
**Title:** `What Is PEZA Accreditation and Why It Matters for Office Tenants in the Philippines`
**Target keyword:** `peza accredited office space philippines`
**Angle:** Many business owners don't know what PEZA means for them — explain the tax perks, eligibility, and why it matters when choosing a building.
**CTA:** Link to Summit One Tower page (PEZA-accredited)

#### Post 5: Bare shell vs. warm shell explainer
**Title:** `Renting Office Space in the Philippines: Bare Shell vs. Warm Shell Explained`
**Target keyword:** `bare shell vs warm shell office space philippines`, `fitted vs bare office space`
**Angle:** Explain the tradeoffs — upfront cost, move-in timeline, flexibility, what "fitted" means in the PH context. Practical framework for SME decision-makers.
**CTA:** "View fitted units available at Summit One Tower →"

**Also this month:** Create 3–5 individual unit detail pages (beyond the existing 2). Each page = a new indexed URL that can rank for long-tail keywords like "223 sqm office for rent shaw boulevard."

---

### Month 3 — Expansion (July 2026)

#### Post 6: Broker-focused piece
**Title:** `A Broker's Guide to Leasing Office Space in Mandaluyong`
**Target keyword:** `mandaluyong office space broker guide`
**Angle:** Written specifically for real estate brokers sourcing space for clients — what buildings to know, how to contact Mercy directly, what the leasing process looks like. Builds the broker relationship channel.
**CTA:** "Contact our leasing team directly — we work with brokers."

#### Post 7: Original data / research piece (backlink magnet)
**Title:** `Office Rent Prices in Mandaluyong 2026 — A Comprehensive Study`
**Target keyword:** `mandaluyong office space market 2026`
**Angle:** Compile your own unit pricing + any publicly available market data into a short "study." Original data earns backlinks organically — other blogs, journalists, and directories will cite you.
**Extras:** Floor plan visuals, before/after unit photos, or an office tour video if available

#### From July onward: Monthly cadence
- 1 post per month on real estate trends, facility management tips, or market updates
- Monitor backlink growth; respond to directory verification emails
- Estimated effort: ~2 hours/month to maintain momentum

---

### Content Calendar Summary

| Month | Post | Target Keyword | Backlink Action |
|---|---|---|---|
| April (live) | Office Space for Rent in Mandaluyong | office space for rent mandaluyong | — |
| May | Pricing Guide: How Much Does Office Rent Cost? | office space price sqm mandaluyong | List on Lamudi + Housinginteractive |
| May | Shaw Boulevard Business Area Guide | office space shaw boulevard | Contact 5 real estate directories |
| June | PEZA Accreditation Explainer | peza accredited office space philippines | Submit to Philippine Chamber of Commerce directory |
| June | Bare Shell vs. Warm Shell Explained | bare shell vs warm shell philippines | Create 3–5 new individual unit pages |
| July | Broker's Guide to Mandaluyong | mandaluyong office space broker | Outreach to 10 local business blogs |
| July | Office Rent Prices 2026 Study | mandaluyong office space market 2026 | Organic — pitch to real estate journalists |
| Aug+ | 1 post/month (trends, tips, market updates) | Rotate through Tier 2 keywords | Monitor + respond to directory verifications |

---

## Part 3: Backlink Strategy

Backlinks are votes of confidence from other websites. Google counts them as a major ranking signal. The goal in months 1–3 is to get 5–10 high-authority backlinks from real estate directories and local business sites.

### Tier 1 — High Authority Directories (Do These First)

Start here. These are free listings that take 1 hour each and immediately give you high-quality backlinks:

| Platform | Domain Authority | Estimated Effort | Action |
|---|---|---|---|
| **Lamudi.com.ph** | DA 75 | 1 hour | List Summit One Tower + Facilities Centre with photos, pricing, unit sizes, and your website URL |
| **Housinginteractive.com.ph** | DA 65 | 1 hour | Same listings — different platform, another backlink |
| **MyProperty.ph** | DA 60 | 1 hour | Add both buildings + units |
| **DotProperty.com.ph** | DA 65 | 1 hour | Upload listings with your URL |
| **Google Business Profile** | DA 100 (Google) | 30 min | Create your Mandaluyong location page (see Part 1.5) |

**Total effort: 4–5 hours. Result: 5 high-authority backlinks — equivalent to months of organic outreach.**

### Tier 2 — Local & Niche Directories (Month 2)

- Philippine Chamber of Commerce member/business directory
- SME and startup business directories
- Metro Manila business guides and city portals
- Mandaluyong City official business registry
- Filipino real estate and property blogs (reach out for a mention or guest post)

### Tier 3 — Organic Outreach (Month 3+)

Once your blog posts are live and indexed:
1. Identify 10–20 relevant sites: local business blogs, real estate journalists, entrepreneurship sites
2. Send a short, specific email: *"We published a guide on Shaw Boulevard office space for startups — thought your readers might find it useful. Happy to share the link."*
3. Expected response rate: 5–10% — that's 1–2 links per 10 emails sent

### Content That Earns Backlinks Naturally

These content types attract links without outreach:
- **Original pricing data** — "Office rent prices in Mandaluyong 2026" (your July post)
- **Unique visuals** — floor plans, aerial property photos, office tour videos
- **Interviews** — "5 startups that moved to Shaw Boulevard: what they learned"
- **Original research** — "How much do Metro Manila businesses spend on office space?" (survey your current tenants)

---

## Part 4: Master Checklist

### This Week (Phase 2 Kickoff — ~3–4 hours total)

- [ ] **List on Lamudi.com.ph** — Summit One Tower + Facilities Centre with photos, price, unit sizes, and website URL
- [ ] **List on Housinginteractive.com.ph** — same content, second backlink
- [ ] **Set up Google Business Profile** at business.google.com — claim or create Facilities Inc. in Mandaluyong City with address, hours, phone, and photos
- [ ] **Draft pricing blog post** — "How Much Does Office Space Cost in Mandaluyong?" (800–1,200 words, include your actual unit pricing as examples)

### On-Page Fixes (Complete Before Publishing More Content)

- [ ] **Update meta titles and descriptions** for all 6 main pages (see Part 1.1)
- [ ] **Add alt text** to all property images
- [ ] **Add schema markup** to homepage (copy from Part 1.3)
- [ ] **Add internal links** to existing April blog post → unit listing pages
- [ ] **Submit sitemap** to Google Search Console
- [ ] **Connect Google Search Console** to monitor which keywords are bringing traffic
- [ ] **Clean up page URLs** to be keyword-friendly (e.g., `/projects/summit-one-tower`)

### Monthly (Ongoing)

- [ ] Publish 2 blog posts per month (May–July), then 1/month from August
- [ ] Add listings to MyProperty.ph and DotProperty.com.ph (Month 1)
- [ ] Submit to Tier 2 directories (Month 2)
- [ ] Begin outreach to local blogs and journalists (Month 3)
- [ ] Monitor Google Search Console for keyword ranking progress
- [ ] Respond to directory verification emails promptly

---

*Last updated: April 2026 | facilitiesinc.netlify.app*
