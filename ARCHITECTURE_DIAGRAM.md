# System Architecture Diagram

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         PUBLIC USERS                            │
│                  (Website Visitors / Tenants)                   │
└────────────────┬────────────────────────────────┬───────────────┘
                 │                                │
                 ▼                                ▼
┌────────────────────────────────┐   ┌──────────────────────────┐
│     PUBLIC WEBSITE             │   │     ADMIN CONSOLE        │
│  (React 19 + React Router)     │   │   (React 19 + Auth)      │
├────────────────────────────────┤   ├──────────────────────────┤
│ • Home Page                    │   │ • Login (Email/Pass)     │
│ • Property Listings            │   │ • Inventory Management   │
│ • Unit Detail Pages            │   │ • Lead Management        │
│ • Blog                         │   │ • Blog CMS               │
│ • Contact Form                 │   │ • Analytics Dashboard    │
└────────────┬───────────────────┘   └─────────┬────────────────┘
             │                                  │
             │                                  │
             └──────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────────┐
         │        SUPABASE CLIENT                   │
         │        (@supabase/supabase-js)           │
         └──────────────┬───────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend-as-a-Service)            │
├───────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   PostgreSQL│  │   Auth       │  │   Storage          │   │
│  │   Database  │  │   (Email)    │  │   (Images)         │   │
│  ├─────────────┤  ├──────────────┤  ├────────────────────┤   │
│  │ • units     │  │ • Users      │  │ • unit-images/     │   │
│  │ • leads     │  │ • Sessions   │  │ • blog-covers/     │   │
│  │ • blog_posts│  │ • Recovery   │  │                    │   │
│  │ • analytics │  │              │  │                    │   │
│  └─────────────┘  └──────────────┘  └────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │           Row-Level Security (RLS)                       │ │
│  │  • Public read (published items only)                    │ │
│  │  • Authenticated full access (admins)                    │ │
│  │  • Public insert (forms)                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                        │
                        ▼
         ┌──────────────────────────────────────┐
         │   OPTIONAL THIRD-PARTY SERVICES      │
         ├──────────────────────────────────────┤
         │ • PostHog (Analytics)                │
         │ • Netlify Forms (Email Alerts)       │
         │ • SendGrid/Resend (Transactional)    │
         └──────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Views Property Listing

```
User visits /units/summit-one
        ↓
React Router renders ListingPage
        ↓
ListingPage fetches units from Supabase
        ↓
SELECT * FROM units 
WHERE building_key = 'summit-one' 
AND contract_length > 0
        ↓
RLS Policy: "Public can view available units"
        ↓
Supabase returns unit data (JSON)
        ↓
React renders grid of unit cards
        ↓
User clicks unit → navigate to /units/summit-one/{id}
```

### 2. User Submits Inquiry Form

```
User fills contact form on website
        ↓
User checks "I agree to Privacy Policy"
        ↓
User clicks "Submit"
        ↓
React sends POST to Supabase:
INSERT INTO leads (full_name, email, phone, message)
        ↓
RLS Policy: "Public can submit leads" (allows INSERT)
        ↓
Supabase stores lead in database
        ↓
[Optional] Trigger Netlify form submission for email
        ↓
[Optional] Track event in PostHog
        ↓
Show success message to user
        ↓
Admin sees new lead in Dashboard → Leads tab
```

### 3. Admin Adds New Property Unit

```
Admin logs in at /login
        ↓
Supabase Auth validates credentials
        ↓
Session created → redirect to /admin
        ↓
Admin clicks "Add New Asset"
        ↓
Admin fills form:
  • Unit number, building, rent, area
  • Uploads 3 images
        ↓
Images compressed (1200px max) → uploaded to Supabase Storage
        ↓
Storage returns public URLs
        ↓
Admin clicks "Save"
        ↓
React sends POST to Supabase:
INSERT INTO units (unit_number, ..., image_urls)
        ↓
RLS Policy: "Admins have full access" (checks auth.role())
        ↓
Supabase stores unit in database
        ↓
Dashboard refreshes → new unit appears in list
        ↓
Public site now shows new unit (if contract_length > 0)
```

### 4. Admin Publishes Blog Post

```
Admin clicks "Blog" tab in Dashboard
        ↓
Admin clicks "Add New Post"
        ↓
Admin enters:
  • Title: "Market Insights 2026"
  • Slug: "market-insights-2026"
  • Content: (Rich-text editor → markdown)
  • Cover image: uploaded to Supabase Storage
        ↓
Admin clicks "Publish"
        ↓
React sends POST to Supabase:
INSERT INTO blog_posts 
(title, slug, content_markdown, cover_image_url, is_published)
VALUES (..., true)
        ↓
Supabase stores post in database
        ↓
Public site: Post appears at /blog
        ↓
User clicks post → /blog/market-insights-2026
        ↓
React fetches post:
SELECT * FROM blog_posts 
WHERE slug = 'market-insights-2026' 
AND is_published = true
        ↓
react-markdown renders markdown to HTML
```

---

## Database Schema Relationships

```
┌────────────────────────────────────────────────────────────┐
│                      BUILDINGS                             │
│  id (UUID, PK)                                             │
│  building_key (TEXT, UNIQUE) ← "summit-one"               │
│  building_name (TEXT)                                      │
└───────────────────┬────────────────────────────────────────┘
                    │
                    │ (one-to-many)
                    ↓
┌────────────────────────────────────────────────────────────┐
│                        UNITS                               │
│  id (UUID, PK)                                             │
│  unit_number (TEXT) ← "701"                                │
│  building_id (UUID, FK) ──→ buildings.id                   │
│  monthly_rent (NUMERIC) ← 50000                            │
│  net_area (NUMERIC) ← 150.5                                │
│  status (TEXT) ← "Available" | "Rented"                    │
│  image_urls (TEXT[]) ← ["url1", "url2", "url3"]            │
│  contract_length (INT) ← 12 (0 = hidden from public)       │
│  headline (TEXT)                                           │
│  narrative (TEXT)                                          │
│  availability_date (DATE)                                  │
│  handover_condition (TEXT) ← "Bare" | "Fitted"             │
└────────────────────────────────────────────────────────────┘
                    │
                    │ (one-to-many)
                    ↓
┌────────────────────────────────────────────────────────────┐
│                 UNIT_ENGAGEMENT_EVENTS                     │
│  id (UUID, PK)                                             │
│  event_type (TEXT) ← "unit_view" | "unit_inquiry"         │
│  unit_id (UUID, FK) ──→ units.id                           │
│  unit_number (TEXT)                                        │
│  building_name (TEXT)                                      │
│  source (TEXT) ← "listing_grid" | "unit_detail_modal"     │
│  created_at (TIMESTAMP)                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                        LEADS                               │
│  id (UUID, PK)                                             │
│  full_name (TEXT) ← "Juan Dela Cruz"                       │
│  email (TEXT) ← "juan@example.com"                         │
│  phone (TEXT) ← "+63 933 XXX XXXX"                         │
│  message (TEXT)                                            │
│  unit_number (TEXT) ← "Unit 701" | "General Inquiry"       │
│  status (TEXT) ← "New" | "Contacted" | "Resolved"          │
│  created_at (TIMESTAMP)                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                     BLOG_POSTS                             │
│  id (UUID, PK)                                             │
│  slug (TEXT, UNIQUE) ← "commercial-real-estate-trends"     │
│  title (TEXT) ← "Commercial Real Estate Trends 2026"       │
│  excerpt (TEXT)                                            │
│  content_markdown (TEXT) ← "# Heading\n\nParagraph..."     │
│  cover_image_url (TEXT)                                    │
│  cover_focus_x (NUMERIC) ← 50 (0-100%)                     │
│  cover_focus_y (NUMERIC) ← 50 (0-100%)                     │
│  is_published (BOOLEAN) ← true | false                     │
│  published_at (TIMESTAMP)                                  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│            LEASE_CANCELLATION_LEDGER                       │
│  id (UUID, PK)                                             │
│  unit_id (UUID, FK) ──→ units.id                           │
│  unit_number (TEXT)                                        │
│  negotiated_rent (NUMERIC)                                 │
│  contracted_months (INT)                                   │
│  months_completed (INT)                                    │
│  earned_revenue (NUMERIC, GENERATED)                       │
│  lost_pipeline (NUMERIC, GENERATED)                        │
│  cancelled_at (TIMESTAMP)                                  │
└────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
                    ┌──────────────┐
                    │    LOGIN     │
                    │     PAGE     │
                    └──────┬───────┘
                           │
                     User enters:
                     • email
                     • password
                           │
                           ▼
              ┌────────────────────────┐
              │  Supabase Auth API     │
              │  signInWithPassword()  │
              └────────┬───────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
     [SUCCESS]                   [FAIL]
          │                         │
          ▼                         ▼
┌─────────────────────┐   ┌──────────────────┐
│  Session Created    │   │  Show Error      │
│  User object stored │   │  "Invalid creds" │
└─────────┬───────────┘   └──────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│    Protected Routes Accessible      │
│    • /admin                         │
│    • Full database access via RLS   │
└─────────────────────────────────────┘
          │
     User clicks
     "Logout"
          │
          ▼
┌─────────────────────────────────────┐
│    Supabase Auth API                │
│    signOut()                        │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│    Session Destroyed                │
│    Redirect to /login               │
└─────────────────────────────────────┘
```

---

## Row-Level Security (RLS) Policy Logic

### Public User Access

```
REQUEST: SELECT * FROM units
         ↓
RLS CHECK: Is contract_length > 0?
         ↓
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
 ALLOW      DENY
(return)   (hide row)
```

### Admin Access

```
REQUEST: SELECT * FROM units
         ↓
RLS CHECK: Is auth.role() = 'authenticated'?
         ↓
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
 ALLOW      APPLY PUBLIC
 (all)      POLICIES
```

### Lead Form Submission

```
REQUEST: INSERT INTO leads (...)
         ↓
RLS CHECK: Policy = "Public can submit leads"
         ↓
    WITH CHECK (true)
         ↓
     ALLOW INSERT
```

---

## Technology Stack at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
├─────────────────────────────────────────────────────────┤
│  Framework:        React 19                             │
│  Router:           React Router DOM v7                  │
│  Build Tool:       Vite                                 │
│  Language:         TypeScript                           │
│  Styling:          Tailwind CSS                         │
│  Icons:            Lucide React                         │
│  Rich Editor:      TipTap                               │
│  Markdown:         react-markdown + remark-gfm          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    BACKEND                              │
├─────────────────────────────────────────────────────────┤
│  Provider:         Supabase (BaaS)                      │
│  Database:         PostgreSQL (managed)                 │
│  Authentication:   Supabase Auth (Email/Password)       │
│  File Storage:     Supabase Storage (AWS S3 under hood) │
│  API:              Auto-generated REST API              │
│  Security:         Row-Level Security (RLS)             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  DEPLOYMENT                             │
├─────────────────────────────────────────────────────────┤
│  Hosting:          Netlify / Vercel                     │
│  CDN:              Global (automatic)                   │
│  SSL:              Automatic (Let's Encrypt)            │
│  Forms:            Netlify Forms (optional)             │
│  CI/CD:            Git push → auto-deploy               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              OPTIONAL SERVICES                          │
├─────────────────────────────────────────────────────────┤
│  Analytics:        PostHog (product analytics)          │
│  Email:            SendGrid / Resend                    │
│  Monitoring:       Supabase Dashboard                   │
└─────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow Example

### Public User Views Property

```
USER                 BROWSER              SUPABASE           DATABASE
 │                      │                     │                  │
 │ clicks "View Unit"   │                     │                  │
 ├─────────────────────>│                     │                  │
 │                      │ GET /units/701      │                  │
 │                      │ (React Router)      │                  │
 │                      ├────────────────────>│                  │
 │                      │  supabase           │  SELECT * FROM   │
 │                      │    .from('units')   │  units WHERE     │
 │                      │    .select('*')     │  id = '701'      │
 │                      │    .eq('id', '701') │                  │
 │                      │                     ├─────────────────>│
 │                      │                     │                  │
 │                      │                     │  RLS Check:      │
 │                      │                     │  contract_length │
 │                      │                     │  > 0? YES → OK   │
 │                      │                     │                  │
 │                      │                     │<─────────────────┤
 │                      │<────────────────────┤  Return unit data│
 │                      │  JSON: {            │                  │
 │                      │    id: '701',       │                  │
 │                      │    title: 'Unit...' │                  │
 │                      │  }                  │                  │
 │                      │                     │                  │
 │<─────────────────────┤                     │                  │
 │  Rendered HTML       │                     │                  │
 │  (Unit Details)      │                     │                  │
```

### Admin Creates New Unit

```
ADMIN               BROWSER              SUPABASE           DATABASE
 │                      │                     │                  │
 │ fills "Add Unit"     │                     │                  │
 │ form + uploads image │                     │                  │
 ├─────────────────────>│                     │                  │
 │                      │ 1. Upload Image     │                  │
 │                      │    to Storage       │                  │
 │                      ├────────────────────>│                  │
 │                      │  supabase.storage   │  Store in S3     │
 │                      │    .upload(...)     ├─────────────────>│
 │                      │                     │<─────────────────┤
 │                      │<────────────────────┤  Return URL      │
 │                      │  publicUrl          │                  │
 │                      │                     │                  │
 │ clicks "Save"        │                     │                  │
 ├─────────────────────>│                     │                  │
 │                      │ 2. Insert Unit      │                  │
 │                      ├────────────────────>│                  │
 │                      │  supabase           │  INSERT INTO     │
 │                      │    .from('units')   │  units (...)     │
 │                      │    .insert({...})   │  VALUES (...)    │
 │                      │                     ├─────────────────>│
 │                      │                     │                  │
 │                      │                     │  RLS Check:      │
 │                      │                     │  auth.role() =   │
 │                      │                     │  authenticated?  │
 │                      │                     │  YES → INSERT OK │
 │                      │                     │                  │
 │                      │                     │<─────────────────┤
 │                      │<────────────────────┤  Success         │
 │<─────────────────────┤  "Unit Added"       │                  │
 │  Success Message     │                     │                  │
```

---

## File Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. USER SELECTS FILE                                       │
│     • Input type="file" or drag-drop                        │
│     • File object in browser memory                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CLIENT-SIDE COMPRESSION                                 │
│     • Canvas API resizes image to 1200px max                │
│     • Converts to JPEG at 80% quality                       │
│     • Reduces file size: 5MB → 200KB                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. UPLOAD TO SUPABASE STORAGE                              │
│     supabase.storage                                        │
│       .from('unit-images')                                  │
│       .upload(fileName, compressedBlob)                     │
│                                                             │
│     → Stored in S3-compatible storage                       │
│     → Returns: { path: 'abc123.jpg' }                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. GET PUBLIC URL                                          │
│     supabase.storage                                        │
│       .from('unit-images')                                  │
│       .getPublicUrl(fileName)                               │
│                                                             │
│     → Returns: https://...supabase.co/storage/.../abc123.jpg│
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. SAVE URL TO DATABASE                                    │
│     INSERT INTO units (..., image_urls)                     │
│     VALUES (..., ['https://...abc123.jpg'])                 │
│                                                             │
│     → URL stored in TEXT[] column                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  6. PUBLIC ACCESS                                           │
│     <img src="https://...abc123.jpg" />                     │
│                                                             │
│     → Served via CDN (fast global delivery)                 │
│     → No authentication required (public bucket)            │
└─────────────────────────────────────────────────────────────┘
```

---

## Cost Breakdown (Free Tier)

```
┌──────────────────────────────────────────────────────────┐
│  SUPABASE (Free Forever Tier)                            │
├──────────────────────────────────────────────────────────┤
│  Database:         500 MB                                │
│  Storage:          1 GB                                  │
│  Bandwidth:        2 GB / month                          │
│  Monthly Users:    50,000                                │
│  API Requests:     Unlimited                             │
│  Auth Users:       50,000                                │
│  Cost:             $0 / month                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  NETLIFY / VERCEL (Free Tier)                            │
├──────────────────────────────────────────────────────────┤
│  Bandwidth:        100 GB / month                        │
│  Build Minutes:    300 / month                           │
│  Sites:            Unlimited                             │
│  SSL:              Automatic                             │
│  CDN:              Global                                │
│  Cost:             $0 / month                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  POSTHOG (Optional - Free Tier)                          │
├──────────────────────────────────────────────────────────┤
│  Events:           1,000,000 / month                     │
│  Recordings:       5,000 / month                         │
│  Feature Flags:    1,000,000 requests / month            │
│  Cost:             $0 / month                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  TOTAL MONTHLY COST                                      │
│  (Small to Medium Website)                               │
├──────────────────────────────────────────────────────────┤
│  Infrastructure:   $0                                    │
│  Domain:           $10-15 / year (one-time)              │
└──────────────────────────────────────────────────────────┘

When to Upgrade:
  • Database > 500MB        → Supabase Pro ($25/mo)
  • Storage > 1GB           → Supabase Pro (100GB included)
  • Traffic > 100GB/mo      → Netlify Pro ($19/mo)
  • Need daily backups      → Supabase Pro
  • Need dedicated support  → Paid plans
```

---

## Security Model

```
┌──────────────────────────────────────────────────────────┐
│               FRONTEND (Public Access)                   │
├──────────────────────────────────────────────────────────┤
│  ✅ Read published content                               │
│  ✅ Submit forms (leads)                                 │
│  ✅ Track analytics events                               │
│  ❌ Edit/delete content                                  │
│  ❌ View unpublished content                             │
│  ❌ View other users' data                               │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ RLS Policies Enforce:
                   │ • WHERE is_published = true
                   │ • WHERE contract_length > 0
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│                  ROW-LEVEL SECURITY                      │
│                  (PostgreSQL RLS)                        │
├──────────────────────────────────────────────────────────┤
│  • Runs at database level (cannot be bypassed)           │
│  • Checks auth.role() and auth.uid()                     │
│  • Policies are SQL WHERE clauses                        │
│  • Applied before query execution                        │
└──────────────────┬───────────────────────────────────────┘
                   │
                   │ If authenticated:
                   │ • auth.role() = 'authenticated'
                   │ • Full access granted
                   │
                   ▼
┌──────────────────────────────────────────────────────────┐
│            ADMIN (Authenticated Access)                  │
├──────────────────────────────────────────────────────────┤
│  ✅ Full CRUD on all tables                              │
│  ✅ Upload to storage                                    │
│  ✅ View all leads                                       │
│  ✅ Publish/unpublish content                            │
│  ✅ View analytics                                       │
│  ✅ Export data                                          │
└──────────────────────────────────────────────────────────┘

Security Best Practices Implemented:
  ✅ RLS enabled on all tables
  ✅ No direct database access from frontend
  ✅ API keys in environment variables
  ✅ HTTPS enforced (automatic with Netlify)
  ✅ CORS configured correctly
  ✅ No sensitive data in client-side code
  ✅ Session-based authentication
  ✅ SQL injection prevented (parameterized queries)
```

---

## Summary: Why This Architecture Works

```
┌─────────────────────────────────────────────────────────────┐
│                   KEY ADVANTAGES                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ NO BACKEND CODE TO WRITE                                │
│     • Supabase handles all server logic                    │
│     • Focus 100% on frontend and user experience           │
│                                                             │
│  ✅ ZERO INFRASTRUCTURE MANAGEMENT                          │
│     • No servers to provision or maintain                  │
│     • Auto-scaling built-in                                │
│     • Automatic backups (on paid plans)                    │
│                                                             │
│  ✅ FAST DEVELOPMENT                                        │
│     • Full CRUD app in hours, not weeks                    │
│     • Auto-generated REST API                              │
│     • Pre-built auth flows                                 │
│                                                             │
│  ✅ PRODUCTION-READY SECURITY                               │
│     • Row-level security at database level                 │
│     • Cannot be bypassed from frontend                     │
│     • Battle-tested auth system                            │
│                                                             │
│  ✅ COST-EFFECTIVE                                          │
│     • Free tier sufficient for most small sites            │
│     • Pay only for what you use                            │
│     • No upfront costs                                     │
│                                                             │
│  ✅ SCALABLE                                                │
│     • Handles 50K users on free tier                       │
│     • Easy upgrade path when needed                        │
│     • Global CDN included                                  │
│                                                             │
│  ✅ DEVELOPER EXPERIENCE                                    │
│     • Modern React with TypeScript                         │
│     • Hot reload development                               │
│     • Git-based deployment                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Last Updated**: April 2026  
**For**: Facilities, Incorporated Website  
**Architecture**: Supabase + React + Netlify
