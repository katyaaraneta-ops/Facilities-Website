# New Project Setup Template

> **Purpose**: Use this as a step-by-step checklist when starting a new website project with the same backend architecture.

---

## Project Overview

**Project Name**: ________________________

**Domain**: ________________________

**Purpose**: ________________________

**Launch Date**: ________________________

---

## Phase 1: Planning (Day 1)

### Data Model Design

**Main Content Entity**: ________________ (e.g., properties, products, courses, services)

**Required Fields**:
- [ ] ID (UUID)
- [ ] Title/Name
- [ ] Description
- [ ] Price/Cost (if applicable)
- [ ] Status (Active/Inactive/Sold/etc.)
- [ ] Images (array)
- [ ] Created/Updated timestamps
- [ ] Custom field: ________________
- [ ] Custom field: ________________
- [ ] Custom field: ________________

**Additional Tables Needed**:
- [ ] Leads/Inquiries
- [ ] Blog posts (optional)
- [ ] Categories/Tags (optional)
- [ ] Reviews/Testimonials (optional)
- [ ] Analytics events (optional)

**Storage Requirements**:
- [ ] Images (bucket name: ________________)
- [ ] Documents (bucket name: ________________)
- [ ] Videos (bucket name: ________________)

---

## Phase 2: Supabase Setup (30 min)

### Account & Project

- [ ] Create Supabase account at supabase.com
- [ ] Create new project
  - Project name: ________________
  - Database password: ________________ (save securely!)
  - Region: ________________
- [ ] Wait for project to finish provisioning (~2 minutes)

### API Keys

- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL**: ________________________
- [ ] Copy **anon/public key**: ________________________
- [ ] Create `supabaseClient.ts` with these values
- [ ] Add to `.gitignore`: `.env`, `.env.local`

### Authentication Setup

- [ ] Go to **Authentication** → **Providers**
- [ ] Enable **Email** provider
- [ ] Configure email templates (optional):
  - [ ] Confirm signup
  - [ ] Reset password
  - [ ] Magic link
- [ ] Create admin user:
  - Email: ________________
  - Password: ________________
- [ ] Test login at `/login`

---

## Phase 3: Database Schema (1 hour)

### Main Tables

Copy this template and customize:

```sql
-- Main content table
CREATE TABLE [YOUR_TABLE_NAME] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  status TEXT DEFAULT 'Active',
  image_urls TEXT[],
  -- Add your custom fields here
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Blog table (optional)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_markdown TEXT NOT NULL,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table (optional)
CREATE TABLE engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  item_id UUID,
  source TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Checklist**:
- [ ] Run SQL in Supabase SQL Editor
- [ ] Verify tables created successfully
- [ ] Add sample data for testing

### Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE [YOUR_TABLE_NAME] ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view active items"
  ON [YOUR_TABLE_NAME] FOR SELECT
  USING (status = 'Active');

-- Admin full access
CREATE POLICY "Admins have full access"
  ON [YOUR_TABLE_NAME] FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can submit leads
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Public can track events
CREATE POLICY "Public can track events"
  ON engagement_events FOR INSERT
  WITH CHECK (true);
```

**Checklist**:
- [ ] Enable RLS on all tables
- [ ] Create public read policies
- [ ] Create admin full access policies
- [ ] Create public insert policies (for forms)
- [ ] Test policies from public site

### Storage Buckets

- [ ] Go to **Storage** → **New bucket**
- [ ] Create bucket: ________________ (set as public)
- [ ] Create storage policies:

```sql
CREATE POLICY "Public can view [BUCKET_NAME]"
  ON storage.objects FOR SELECT
  USING (bucket_id = '[BUCKET_NAME]');

CREATE POLICY "Authenticated can upload [BUCKET_NAME]"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = '[BUCKET_NAME]' AND auth.role() = 'authenticated');
```

- [ ] Test upload from admin
- [ ] Test public access to uploaded file

---

## Phase 4: Frontend Setup (2 hours)

### Project Initialization

```bash
# Create React + Vite project
npm create vite@latest [project-name] -- --template react-ts

cd [project-name]

# Install dependencies
npm install @supabase/supabase-js react-router-dom lucide-react

# Optional dependencies
npm install @tiptap/react @tiptap/starter-kit react-markdown remark-gfm
```

**Checklist**:
- [ ] Initialize Git repository
- [ ] Create `.gitignore` (include `.env`, `node_modules`, `dist`)
- [ ] First commit

### File Structure

```
src/
├── supabaseClient.ts       # Supabase config
├── App.tsx                 # Main app with routing
├── LoginPage.tsx           # Admin login
├── AdminDashboard.tsx      # Admin console
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── [YourComponent].tsx
└── pages/
    ├── HomePage.tsx
    ├── ListingPage.tsx
    └── DetailPage.tsx
```

**Checklist**:
- [ ] Create `supabaseClient.ts`
- [ ] Create `LoginPage.tsx`
- [ ] Create `AdminDashboard.tsx`
- [ ] Set up routing in `App.tsx`

### Core Components

**supabaseClient.ts**:
- [ ] Add Supabase URL and anon key
- [ ] Test connection

**LoginPage.tsx**:
- [ ] Email/password form
- [ ] Login handler
- [ ] Error display
- [ ] Redirect on success

**AdminDashboard.tsx**:
- [ ] Protected route (check auth)
- [ ] Logout button
- [ ] Tabs for different sections
- [ ] Data fetching from Supabase

---

## Phase 5: Admin Features (4-6 hours)

### Inventory/Content Management

- [ ] Create "Add New" form
- [ ] Implement create functionality
- [ ] Implement read/list functionality
- [ ] Implement update/edit functionality
- [ ] Implement delete functionality (with confirmation)
- [ ] Add image upload with compression
- [ ] Add drag-and-drop for images
- [ ] Add loading states
- [ ] Add error handling

### Leads Management

- [ ] Display all leads in table
- [ ] Add status update buttons
- [ ] Add filter by status
- [ ] Add search functionality
- [ ] Add CSV export
- [ ] Add copy-to-clipboard for contact info
- [ ] Add auto-refresh (optional)

### Blog CMS (Optional)

- [ ] Create blog post form
- [ ] Add TipTap rich-text editor
- [ ] Implement markdown storage
- [ ] Add cover image upload
- [ ] Add draggable focal point
- [ ] Add slug generation
- [ ] Add publish/draft toggle
- [ ] Add preview mode

### Analytics Dashboard (Optional)

- [ ] Create analytics tab
- [ ] Fetch engagement events
- [ ] Display key metrics
- [ ] Add time period filter
- [ ] Add data visualization (optional)
- [ ] Add export functionality

---

## Phase 6: Public Site (3-4 hours)

### Pages to Build

- [ ] **Homepage**
  - Hero section
  - Featured items
  - Contact CTA
  - Footer

- [ ] **Listing Page**
  - Grid/list of items from database
  - Filter/sort functionality
  - Search (optional)
  - Pagination (if > 20 items)

- [ ] **Detail Page**
  - Full item information
  - Image gallery
  - Contact/inquiry form
  - Related items (optional)

- [ ] **Contact Page**
  - Contact form
  - Submit to `leads` table
  - Success message
  - Privacy policy link

- [ ] **Blog** (Optional)
  - Blog index page
  - Individual post pages
  - Markdown rendering

### SEO Setup

- [ ] Install `react-helmet-async`
- [ ] Create `SEOHead` component
- [ ] Add dynamic meta tags for each page:
  - [ ] Title
  - [ ] Description
  - [ ] OG image
  - [ ] Canonical URL
  - [ ] Keywords
- [ ] Test with [metatags.io](https://metatags.io/)

### Forms

- [ ] Contact form component
- [ ] Form validation
- [ ] Submit to Supabase
- [ ] Success/error states
- [ ] Privacy policy checkbox
- [ ] Email notification setup (optional)

---

## Phase 7: Styling & Polish (2-3 hours)

### Design System

- [ ] Choose color palette
- [ ] Define typography scale
- [ ] Create reusable components:
  - [ ] Button
  - [ ] Input
  - [ ] Card
  - [ ] Modal
- [ ] Set up Tailwind CSS (if not using)
- [ ] Create mobile-responsive layouts

### Image Optimization

- [ ] Implement image compression (1200px max)
- [ ] Add lazy loading for images
- [ ] Add loading placeholders
- [ ] Optimize for Core Web Vitals

### Performance

- [ ] Code splitting (React.lazy)
- [ ] Minimize bundle size
- [ ] Test with Lighthouse
- [ ] Fix performance issues

---

## Phase 8: Testing (1-2 hours)

### Manual Testing

- [ ] Test all admin CRUD operations
- [ ] Test login/logout flow
- [ ] Test password recovery
- [ ] Test public form submissions
- [ ] Test image uploads
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test with slow network (throttling)

### Security Testing

- [ ] Try accessing admin without login
- [ ] Try manipulating RLS policies
- [ ] Test SQL injection in forms
- [ ] Verify API keys not exposed in frontend

### Data Integrity

- [ ] Add sample data
- [ ] Test edge cases (empty fields, special characters)
- [ ] Test delete cascading (if using foreign keys)
- [ ] Backup database before launch

---

## Phase 9: Deployment (1 hour)

### Pre-Deployment

- [ ] Remove all `console.log` statements
- [ ] Remove test/dummy data
- [ ] Update `README.md`
- [ ] Final code review
- [ ] Create `.env.example` file

### Netlify Deployment

- [ ] Install Netlify CLI: `npm install -g netlify-cli`
- [ ] Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] Run `netlify login`
- [ ] Run `netlify init`
- [ ] Add environment variables in Netlify dashboard:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy: `netlify deploy --prod`
- [ ] Test production build

### Custom Domain (Optional)

- [ ] Purchase domain
- [ ] Add domain in Netlify dashboard
- [ ] Update DNS records
- [ ] Enable HTTPS
- [ ] Test custom domain

---

## Phase 10: Launch & Monitoring (Ongoing)

### Launch Checklist

- [ ] Final smoke test on production
- [ ] Test admin login on production
- [ ] Test form submissions on production
- [ ] Verify analytics tracking
- [ ] Announce launch

### Post-Launch Monitoring

- [ ] Set up analytics dashboard
- [ ] Monitor Supabase usage (database size, API calls)
- [ ] Check for errors in browser console
- [ ] Monitor form submissions
- [ ] Collect user feedback

### Maintenance Schedule

**Weekly**:
- [ ] Review new leads/inquiries
- [ ] Check analytics for trends
- [ ] Respond to user feedback

**Monthly**:
- [ ] Database backup (Supabase auto-backups on paid plans)
- [ ] Review and update content
- [ ] Check for dependency updates
- [ ] Review performance metrics

**Quarterly**:
- [ ] Security audit
- [ ] Full backup of codebase
- [ ] Performance optimization
- [ ] Feature planning

---

## Optional Enhancements

### Email Notifications

**Option 1: Netlify Forms**
- [ ] Add Netlify form to HTML
- [ ] Configure email notifications in Netlify dashboard

**Option 2: Supabase Edge Functions**
- [ ] Create edge function for email sending
- [ ] Integrate SendGrid/Resend
- [ ] Test email delivery

### Advanced Analytics

**Option 3: PostHog Integration**
- [ ] Sign up at posthog.com
- [ ] Add PostHog snippet to `index.html`
- [ ] Create wrapper function for tracking
- [ ] Set up funnels and dashboards

### Third-Party Integrations

- [ ] Google Analytics 4 (optional)
- [ ] Facebook Pixel (optional)
- [ ] Live chat widget (optional)
- [ ] Email marketing (Mailchimp, etc.)

---

## Resource Links

### Documentation
- Supabase: https://supabase.com/docs
- React Router: https://reactrouter.com/
- Tailwind CSS: https://tailwindcss.com/docs

### Tools
- Color Palette: https://coolors.co/
- Icons: https://lucide.dev/
- Image Compression: https://tinypng.com/
- Meta Tags Tester: https://metatags.io/

### Communities
- Supabase Discord: https://discord.supabase.com/
- Reddit: r/Supabase, r/reactjs

---

## Project Notes

Use this section to document project-specific decisions, gotchas, and learnings:

```
Date: _______________
Note: _______________________________________________
_____________________________________________________
_____________________________________________________

Date: _______________
Note: _______________________________________________
_____________________________________________________
_____________________________________________________
```

---

## Handoff Checklist

When handing off to a client or team:

- [ ] Provide Supabase dashboard access (or create new user)
- [ ] Provide Netlify dashboard access
- [ ] Document admin login credentials
- [ ] Create admin user guide
- [ ] Record video walkthrough (optional)
- [ ] Provide support contact
- [ ] Transfer domain ownership (if applicable)

---

## Time Breakdown

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Planning | 1-2 hours |
| Phase 2: Supabase Setup | 30 min |
| Phase 3: Database Schema | 1 hour |
| Phase 4: Frontend Setup | 2 hours |
| Phase 5: Admin Features | 4-6 hours |
| Phase 6: Public Site | 3-4 hours |
| Phase 7: Styling & Polish | 2-3 hours |
| Phase 8: Testing | 1-2 hours |
| Phase 9: Deployment | 1 hour |
| **Total Estimated Time** | **15-22 hours** |

---

## Success Criteria

- [ ] Admin can log in and manage content
- [ ] Public site displays data from database
- [ ] Forms submit successfully and appear in admin
- [ ] Images upload and display correctly
- [ ] Site is mobile-responsive
- [ ] All pages load in < 3 seconds
- [ ] No console errors in production
- [ ] Analytics tracking works
- [ ] SEO meta tags are correct

---

**Project Started**: _______________

**Project Completed**: _______________

**Total Hours**: _______________

**Notes**: _____________________________________
_________________________________________________
_________________________________________________
