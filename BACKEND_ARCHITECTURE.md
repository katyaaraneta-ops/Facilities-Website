# Backend Architecture Documentation
## Facilities, Incorporated Website

> **Purpose**: This document explains how we built the complete backend system for the Facilities Inc. commercial real estate website, including authentication, database, admin console, and analytics. Use this as a blueprint for building similar systems for other websites.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Authentication System](#authentication-system)
4. [Database Architecture](#database-architecture)
5. [Admin Console Features](#admin-console-features)
6. [Analytics Implementation](#analytics-implementation)
7. [Blog System](#blog-system)
8. [Lead Management](#lead-management)
9. [Deployment](#deployment)
10. [How to Replicate](#how-to-replicate)

---

## System Overview

This is a **serverless, full-stack real estate management platform** built entirely on modern web technologies. The architecture eliminates the need for traditional backend servers by using:

- **Supabase** as the Backend-as-a-Service (PostgreSQL + Auth + Storage + Realtime)
- **React 19** for the frontend and admin interface
- **Vite** as the build tool
- **PostHog** for product analytics (optional)
- **Netlify Forms** for email notifications (optional)

### Key Capabilities

- ✅ **Property Inventory Management**: Add, edit, and delete commercial units with images
- ✅ **Lead Capture & CRM**: Track inquiries with status management and CSV export
- ✅ **Blog CMS**: Rich-text editor with markdown, cover images, and SEO controls
- ✅ **Analytics Dashboard**: Track unit views, inquiries, and lease performance
- ✅ **Secure Admin Portal**: Email/password authentication with password recovery
- ✅ **No Backend Code Required**: Everything runs client-side with secure database rules

---

## Tech Stack

### Core Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend Framework** | React 19 | UI components and state management |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Routing** | React Router DOM v7 | Multi-page navigation |
| **Backend-as-a-Service** | Supabase | PostgreSQL database + Auth + Storage |
| **Authentication** | Supabase Auth | Email/password login with magic links |
| **Database** | PostgreSQL (via Supabase) | Relational data storage |
| **File Storage** | Supabase Storage | Image uploads (unit photos, blog covers) |
| **Rich Text Editor** | TipTap | WYSIWYG blog content editor |
| **Markdown Rendering** | react-markdown + remark-gfm | Blog post display |
| **Analytics** | PostHog (optional) | Product analytics and event tracking |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Icons** | Lucide React | Icon library |
| **Deployment** | Netlify / Vercel | Static hosting with serverless functions |

### Dependencies (package.json)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1",
    "@tiptap/extension-link": "^3.22.3",
    "@tiptap/extension-placeholder": "^3.22.3",
    "@tiptap/extension-underline": "^3.22.3",
    "@tiptap/react": "^3.22.3",
    "@tiptap/starter-kit": "^3.22.3",
    "lucide-react": "^0.562.0",
    "marked": "^18.0.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-helmet-async": "^3.0.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.13.1",
    "remark-gfm": "^4.0.1",
    "turndown": "^7.2.4",
    "turndown-plugin-gfm": "^1.0.2"
  }
}
```

---

## Authentication System

### Implementation: Supabase Auth

We use **Supabase's built-in authentication** instead of third-party services like Clerk. This provides:

- Email/password authentication
- Password reset via secure recovery links
- Session management
- Row-level security (RLS) for database access

### Setup Steps

#### 1. Initialize Supabase Client

**File**: `supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-public-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to **Settings** → **API**
- Copy the **Project URL** and **anon/public** key

#### 2. Login Page Component

**File**: `LoginPage.tsx`

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setError(error.message);
  } else {
    onLoginSuccess(data.user);
  }
};
```

#### 3. Password Recovery

```typescript
const handleForgotPassword = async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });
  
  if (!error) {
    setIsEmailSent(true);
  }
};
```

#### 4. Session Management

**File**: `App.tsx`

```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      } else if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

### Creating Admin Users

**Option 1: Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. User can now log in at `/login`

**Option 2: Using SQL (for bulk creation)**
```sql
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@example.com', crypt('password123', gen_salt('bf')), NOW());
```

---

## Database Architecture

### Database Provider: Supabase (PostgreSQL)

Supabase provides a managed PostgreSQL database with:
- RESTful API auto-generated from your schema
- Row-level security (RLS) for fine-grained access control
- Real-time subscriptions (optional)
- Automatic API documentation

### Core Tables

#### 1. `units` Table (Property Inventory)

**Purpose**: Stores all commercial property units available for rent.

```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number TEXT NOT NULL,
  building_name TEXT NOT NULL,
  building_id UUID REFERENCES buildings(id),
  floor_label TEXT,
  floor_sort INTEGER,
  unit_sort INTEGER,
  monthly_rent NUMERIC NOT NULL,
  assoc_dues NUMERIC,
  net_area NUMERIC NOT NULL,
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Rented')),
  availability_date DATE,
  handover_condition TEXT DEFAULT 'Bare' CHECK (handover_condition IN ('Bare', 'Fitted', 'Furnished')),
  headline TEXT,
  narrative TEXT,
  image_urls TEXT[],
  contract_length INTEGER, -- 0 to hide from public, 1-60 for active leases
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_units_updated_at
BEFORE UPDATE ON units
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Key Fields:**
- `contract_length`: Set to `0` to hide unit from public view (admin-only visibility)
- `image_urls`: PostgreSQL array of image URLs stored in Supabase Storage
- `floor_sort` / `unit_sort`: Used for custom ordering in listings

#### 2. `buildings` Table (Reference Data)

```sql
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_key TEXT UNIQUE NOT NULL, -- e.g., 'summit-one', 'facilities-centre'
  building_name TEXT NOT NULL, -- e.g., 'Summit One Tower'
  address TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial buildings
INSERT INTO buildings (building_key, building_name, address) VALUES
  ('summit-one', 'Summit One Tower', '23/F Summit One Tower, Shaw Blvd, Mandaluyong City'),
  ('facilities-centre', 'Facilities Centre', 'Shaw Blvd, Mandaluyong City');
```

#### 3. `leads` Table (Lead Capture)

**Purpose**: Stores all inquiry submissions from the public website.

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  unit_number TEXT, -- "General Inquiry" or "Unit 701 - Summit One Tower"
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved', 'Archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Lead Lifecycle:**
1. **New** → Inquiry submitted from website
2. **Contacted** → Admin has reached out
3. **Resolved** → Lease signed or inquiry closed
4. **Archived** → Non-responsive or spam

#### 4. `blog_posts` Table (CMS)

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  title TEXT NOT NULL,
  excerpt TEXT,
  content_markdown TEXT NOT NULL,
  cover_image_url TEXT,
  cover_focus_x NUMERIC DEFAULT 50, -- Focal point X% (0-100)
  cover_focus_y NUMERIC DEFAULT 50, -- Focal point Y% (0-100)
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Features:**
- Markdown content storage for easy editing
- Draggable focal point for cover images
- Draft/published workflow
- SEO-friendly slugs

#### 5. `unit_engagement_events` Table (Analytics)

**Purpose**: First-party analytics for tracking user interactions.

```sql
CREATE TABLE unit_engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'unit_view', 'unit_inquiry', etc.
  unit_id UUID REFERENCES units(id),
  unit_number TEXT,
  building_name TEXT,
  source TEXT, -- 'listing_grid', 'unit_detail_modal', etc.
  page_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. `lease_cancellation_ledger` Table (Revenue Tracking)

**Purpose**: Track proration when leases are cancelled early.

```sql
CREATE TABLE lease_cancellation_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id),
  unit_number TEXT NOT NULL,
  building_name TEXT NOT NULL,
  negotiated_rent NUMERIC NOT NULL,
  contracted_months INTEGER NOT NULL,
  months_completed INTEGER NOT NULL,
  earned_revenue NUMERIC GENERATED ALWAYS AS (negotiated_rent * months_completed) STORED,
  lost_pipeline NUMERIC GENERATED ALWAYS AS (negotiated_rent * (contracted_months - months_completed)) STORED,
  cancelled_at TIMESTAMP DEFAULT NOW()
);
```

### Row-Level Security (RLS) Setup

**Critical**: Enable RLS to secure your data from unauthorized access.

```sql
-- Enable RLS on all tables
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE lease_cancellation_ledger ENABLE ROW LEVEL SECURITY;

-- Public read access for published units (excluding hidden ones)
CREATE POLICY "Public can view available units"
  ON units FOR SELECT
  USING (contract_length > 0 OR contract_length IS NULL);

-- Public read access for published blog posts
CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT
  USING (is_published = TRUE);

-- Authenticated users (admins) have full access
CREATE POLICY "Admins have full access to units"
  ON units FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to leads"
  ON leads FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to blog posts"
  ON blog_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- Public can insert leads (for contact forms)
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Public can insert engagement events (for analytics)
CREATE POLICY "Public can track engagement"
  ON unit_engagement_events FOR INSERT
  WITH CHECK (true);
```

### Supabase Storage Setup

**Buckets to Create:**

1. **`unit-images`** - For property photos
2. **`blog-covers`** - For blog post cover images

**Configuration:**
```typescript
// Create buckets in Supabase Dashboard → Storage

// Storage policies (allow public read, authenticated write)
CREATE POLICY "Public can view unit images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'unit-images');

CREATE POLICY "Authenticated users can upload unit images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'unit-images' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view blog covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated users can upload blog covers"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-covers' AND auth.role() = 'authenticated');
```

---

## Admin Console Features

### Overview

The admin console is a single-page React application located at `/admin` that provides full control over:

1. **Inventory Management** - Add/edit/delete property units
2. **Leads Management** - View and process inquiries
3. **Blog CMS** - Create and publish blog posts
4. **Analytics Dashboard** - Track performance metrics

### Feature Breakdown

#### 1. Inventory Management

**File**: `AdminDashboard.tsx` (Inventory tab)

**Capabilities:**
- ✅ Add new property units with photos (max 3 images)
- ✅ Edit existing units (metadata, pricing, images)
- ✅ Toggle unit status: Available ↔ Rented
- ✅ Set contract duration (1-60 months)
- ✅ Hide units from public view (set `contract_length = 0`)
- ✅ Automatic image compression (1200px max width)
- ✅ Drag-and-drop image upload
- ✅ Delete units with confirmation

**Code Example: Adding a Unit**

```typescript
const handleSaveUnit = async () => {
  setIsSubmitting(true);

  const unitData = {
    unit_number: newUnit.unit_number,
    building_name: newUnit.building_name,
    monthly_rent: Number(newUnit.monthly_rent),
    assoc_dues: Number(newUnit.assoc_dues) || null,
    net_area: Number(newUnit.net_area),
    status: newUnit.status,
    availability_date: newUnit.availability_date || null,
    handover_condition: newUnit.handover_condition,
    headline: newUnit.headline,
    narrative: newUnit.narrative,
    image_urls: newUnit.image_urls,
    contract_length: 12, // Default lease length
  };

  const { error } = await supabase.from('units').insert([unitData]);

  if (error) {
    alert('Error saving unit: ' + error.message);
  } else {
    fetchUnits(); // Refresh list
    setIsAdding(false);
    setNewUnit(INITIAL_FORM_STATE);
  }

  setIsSubmitting(false);
};
```

**Image Upload with Compression:**

```typescript
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        }, 'image/jpeg', 0.8);
      };
    };
  });
};

const handleImageUpload = async (file: File) => {
  setUploading(true);
  
  try {
    const compressedBlob = await compressImage(file);
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    const { data, error } = await supabase.storage
      .from('unit-images')
      .upload(fileName, compressedBlob, { contentType: 'image/jpeg' });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('unit-images')
      .getPublicUrl(fileName);
    
    setNewUnit(prev => ({
      ...prev,
      image_urls: [...prev.image_urls, publicUrl]
    }));
  } catch (err) {
    console.error('Upload error:', err);
    alert('Failed to upload image');
  } finally {
    setUploading(false);
  }
};
```

#### 2. Leads Management

**File**: `AdminDashboard.tsx` (Leads tab)

**Capabilities:**
- ✅ View all inquiries sorted by date
- ✅ Filter by building (Summit One / Facilities Centre / All)
- ✅ Filter by status (New / Contacted / Resolved / Archived)
- ✅ Update lead status with one click
- ✅ Export all leads to CSV
- ✅ Copy contact details to clipboard
- ✅ Auto-refresh every 30 seconds (optional)

**Code Example: Updating Lead Status**

```typescript
const handleLeadStatusUpdate = async (leadId: string, newStatus: string) => {
  setUpdatingId(leadId);
  
  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', leadId);
  
  if (error) {
    alert('Error updating status: ' + error.message);
  } else {
    fetchLeads(true); // Silently refresh
  }
  
  setUpdatingId(null);
};
```

**CSV Export Functionality:**

```typescript
const handleExportCSV = () => {
  const csvHeader = 'Date,Name,Email,Phone,Unit,Status,Message\n';
  const csvRows = leads.map(lead => {
    const date = new Date(lead.created_at).toLocaleDateString();
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    
    return [
      escapeCsv(date),
      escapeCsv(lead.full_name),
      escapeCsv(lead.email),
      escapeCsv(lead.phone || ''),
      escapeCsv(lead.unit_number),
      escapeCsv(lead.status),
      escapeCsv(lead.message)
    ].join(',');
  }).join('\n');
  
  const csvContent = csvHeader + csvRows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
};
```

#### 3. Blog CMS

**File**: `AdminDashboard.tsx` (Blog tab) + `BlogRichTextEditor.tsx`

**Capabilities:**
- ✅ Rich-text editor with formatting (bold, italic, headings, lists, links)
- ✅ Markdown storage (future-proof and portable)
- ✅ Cover image upload with draggable focal point
- ✅ SEO-friendly slug generation
- ✅ Draft/publish workflow
- ✅ Live preview in admin
- ✅ Delete posts with confirmation

**Rich Text Editor Setup (TipTap):**

```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

const BlogRichTextEditor: React.FC<{
  initialContent: string;
  onUpdate: (html: string) => void;
}> = ({ initialContent, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({ placeholder: 'Start writing...' })
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    }
  });

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()}>
          <Bold size={18} />
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <Italic size={18} />
        </button>
        {/* More buttons... */}
      </div>
      
      {/* Editor */}
      <EditorContent editor={editor} className="prose p-4" />
    </div>
  );
};
```

**Draggable Focal Point for Cover Images:**

```typescript
const DraggableFocalPoint: React.FC<{
  imageUrl: string;
  initialX: number;
  initialY: number;
  onUpdate: (x: number, y: number) => void;
}> = ({ imageUrl, initialX, initialY, onUpdate }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    
    setPosition({ x: clampedX, y: clampedY });
    onUpdate(clampedX, clampedY);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative aspect-[2/1] cursor-crosshair"
    >
      <img 
        src={imageUrl} 
        alt="Cover preview"
        className="w-full h-full object-cover"
        style={{ objectPosition: `${position.x}% ${position.y}%` }}
      />
      <div 
        className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};
```

#### 4. Analytics Dashboard

**File**: `AdminDashboard.tsx` (Analytics tab)

**Capabilities:**
- ✅ Track unit views from listing pages
- ✅ Track inquiry submissions
- ✅ View lease cancellation history with revenue impact
- ✅ Filter by time period (7d / 30d / 90d / All Time)
- ✅ Export analytics data

**Code Example: Fetching Analytics**

```typescript
const fetchAnalyticsData = async (timePeriod: '7d' | '30d' | '90d' | 'all') => {
  setLoadingAnalytics(true);
  
  let dateFilter: string | null = null;
  if (timePeriod !== 'all') {
    const daysAgo = timePeriod === '7d' ? 7 : timePeriod === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    dateFilter = cutoffDate.toISOString();
  }
  
  let eventsQuery = supabase
    .from('unit_engagement_events')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (dateFilter) {
    eventsQuery = eventsQuery.gte('created_at', dateFilter);
  }
  
  const [ledgerResult, eventsResult] = await Promise.all([
    supabase
      .from('lease_cancellation_ledger')
      .select('*')
      .order('cancelled_at', { ascending: false }),
    eventsQuery
  ]);
  
  setCancellationLedger(ledgerResult.data || []);
  setEngagementEvents(eventsResult.data || []);
  setLoadingAnalytics(false);
};
```

**Tracking Events from Public Site:**

```typescript
// When a user views a unit detail page
const trackUnitView = async (unit: PropertyUnit) => {
  const { error } = await supabase.from('unit_engagement_events').insert([{
    event_type: 'unit_view',
    unit_id: unit.id,
    unit_number: unit.unit_number,
    building_name: unit.building_name,
    source: 'listing_grid',
    page_path: window.location.pathname
  }]);
  
  if (error) {
    console.error('Failed to track unit view:', error);
  }
};

// When a user submits an inquiry
const trackInquiry = async (unit: PropertyUnit) => {
  const { error } = await supabase.from('unit_engagement_events').insert([{
    event_type: 'unit_inquiry',
    unit_id: unit.id,
    unit_number: unit.unit_number,
    building_name: unit.building_name,
    source: 'unit_detail_modal'
  }]);
};
```

---

## Analytics Implementation

### Two-Tier Analytics Strategy

#### 1. First-Party Analytics (Supabase)

**Why?** Full data ownership, no third-party dependencies, GDPR-friendly.

**Implementation**: Custom `unit_engagement_events` table

**Tracked Events:**
- `unit_view` - User views unit detail page
- `unit_inquiry` - User submits inquiry form
- Page navigation paths

**Advantages:**
- ✅ No cookie consent required (first-party data)
- ✅ 100% data accuracy (no ad blockers)
- ✅ Custom business logic and reporting
- ✅ Integrated with your database

#### 2. PostHog (Optional Third-Party)

**Why?** Advanced product analytics, session recording, feature flags.

**File**: `posthogCapture.ts`

```typescript
type PostHogClient = { 
  capture: (eventName: string, properties?: Record<string, unknown>) => void 
};

export function capturePostHog(
  eventName: string, 
  properties?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: PostHogClient }).posthog;
  ph?.capture(eventName, properties);
}
```

**Setup:**

1. Sign up at [posthog.com](https://posthog.com)
2. Add PostHog snippet to `index.html`:

```html
<script>
  !function(t,e){/* PostHog snippet */}(window,document);
  posthog.init('YOUR_API_KEY', {
    api_host: 'https://app.posthog.com'
  });
</script>
```

3. Use wrapper function throughout app:

```typescript
// Track custom events
capturePostHog('unit_viewed', {
  unit_id: unit.id,
  unit_number: unit.unit_number,
  building: unit.building_name
});

capturePostHog('unit_inquiry_submitted', {
  unit_number: unit.unit_number,
  source: 'unit_detail_modal'
});
```

**Advantages:**
- ✅ Automatic pageview tracking
- ✅ Session recordings (see how users interact)
- ✅ Funnel analysis (view → inquiry → conversion)
- ✅ A/B testing (feature flags)

---

## Blog System

### Architecture

The blog system uses a **headless CMS approach** with:

- **Admin Editor**: Rich-text editor (TipTap) for content creation
- **Storage Format**: Markdown (portable and future-proof)
- **Public Display**: `react-markdown` renders markdown to HTML
- **SEO**: Custom `<SEOHead>` component with dynamic meta tags

### Blog Post Workflow

1. **Create Draft** → Admin fills in title, excerpt, content, cover image
2. **Generate Slug** → URL-friendly identifier (e.g., `commercial-real-estate-trends`)
3. **Preview** → See how post looks on public site
4. **Publish** → Set `is_published = true` and `published_at = NOW()`
5. **Public View** → Post appears at `/blog/{slug}`

### SEO Implementation

**File**: `seo-metadata.ts`

```typescript
export const buildBlogPostSEO = (post: {
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
}) => {
  return {
    title: `${post.title} | Facilities Inc. Blog`,
    description: post.excerpt || 'Read the latest insights on commercial real estate.',
    keywords: 'commercial real estate, Mandaluyong, office space, blog',
    ogImage: post.coverImageUrl || '/images/default-og.jpg',
    canonicalUrl: `https://yoursite.com/blog/${post.slug}`,
    h1: post.title
  };
};
```

**Usage in Blog Post Page:**

```typescript
const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (!error && data) {
        setPost(data);
      }
    };
    fetchPost();
  }, [slug]);

  if (!post) return <Navigate to="/blog" />;

  const seoData = buildBlogPostSEO({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || undefined,
    coverImageUrl: post.cover_image_url || undefined,
  });

  return (
    <>
      <SEOHead {...seoData} />
      <article>
        <h1>{post.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content_markdown}
        </ReactMarkdown>
      </article>
    </>
  );
};
```

---

## Lead Management

### Lead Capture Flow

```
Public Site Contact Form
        ↓
1. User fills name, email, phone, message
        ↓
2. User checks "I agree to Privacy Policy" checkbox
        ↓
3. Form submits to Supabase (RLS allows public INSERT)
        ↓
4. [Optional] Trigger Netlify form submission for email alert
        ↓
5. Lead appears in Admin Dashboard → Leads tab
        ↓
6. Admin reviews and updates status (New → Contacted → Resolved)
```

### Code: Contact Form Submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isAgreed) {
    setShowError(true);
    return;
  }
  
  setIsSubmitting(true);
  
  const { error } = await supabase.from('leads').insert([{
    full_name: formData.name,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
    unit_number: "General Inquiry",
    status: 'New'
  }]);
  
  if (error) {
    alert('Failed to submit inquiry. Please try again.');
  } else {
    // Optional: Send to Netlify for email notification
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "leads",
        "full_name": formData.name,
        "email": formData.email,
        "phone": formData.phone,
        "message": formData.message
      })
    }).catch(err => console.error("Netlify error:", err));
    
    // Track in analytics
    capturePostHog('lead_form_submitted', {
      inquiry_type: 'general',
      source: 'contact_section'
    });
    
    setIsSuccess(true);
  }
  
  setIsSubmitting(false);
};
```

### Email Notifications (Optional)

**Option 1: Netlify Forms**

Add this to your HTML:

```html
<form name="leads" netlify netlify-honeypot="bot-field" hidden>
  <input type="text" name="full_name" />
  <input type="email" name="email" />
  <input type="tel" name="phone" />
  <textarea name="message"></textarea>
  <input type="text" name="unit_number" />
</form>
```

Configure email notifications in Netlify dashboard:
- Go to **Site Settings** → **Forms** → **Form notifications**
- Add email address to receive notifications

**Option 2: Supabase Edge Functions**

Create a serverless function to send emails via SendGrid/Resend:

```typescript
// supabase/functions/send-lead-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { full_name, email, unit_number, message } = await req.json();
  
  // Send email using your preferred service
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: 'mercy.laurenciano@gmail.com' }],
        subject: `New Lead: ${unit_number}`
      }],
      from: { email: 'noreply@yoursite.com' },
      content: [{
        type: 'text/plain',
        value: `Name: ${full_name}\nEmail: ${email}\n\n${message}`
      }]
    })
  });
  
  return new Response('Email sent', { status: 200 });
});
```

---

## Deployment

### Option 1: Netlify (Recommended)

**Why Netlify?**
- ✅ Free tier with generous bandwidth
- ✅ Automatic HTTPS
- ✅ Form submission handling
- ✅ Instant rollbacks
- ✅ Branch previews

**Deployment Steps:**

1. **Build Configuration**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

2. **Deploy via Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

3. **Environment Variables**

Go to **Site Settings** → **Build & Deploy** → **Environment Variables**

Add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

4. **Update `supabaseClient.ts`:**

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'fallback-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'fallback-key';
```

### Option 2: Vercel

**Deployment Steps:**

1. Install Vercel CLI:

```bash
npm install -g vercel
vercel login
```

2. Create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

3. Deploy:

```bash
vercel --prod
```

4. Add environment variables in Vercel dashboard.

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Node.js 18+
- Nginx or Apache
- SSL certificate (Let's Encrypt)

**Steps:**

```bash
# Build the app
npm run build

# Copy dist/ folder to server
scp -r dist/* user@yourserver:/var/www/yoursite

# Configure Nginx
sudo nano /etc/nginx/sites-available/yoursite

# Add:
server {
    listen 80;
    server_name yoursite.com;
    root /var/www/yoursite;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Enable site and reload Nginx
sudo ln -s /etc/nginx/sites-available/yoursite /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# Add SSL with Let's Encrypt
sudo certbot --nginx -d yoursite.com
```

---

## How to Replicate

### Checklist for Building Similar Systems

Use this checklist when building a similar backend for other websites:

#### Phase 1: Supabase Setup (30 min)

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Copy Project URL and anon key
- [ ] Create `supabaseClient.ts` with credentials
- [ ] Enable Email Auth in **Authentication** → **Providers**
- [ ] Add admin user in **Authentication** → **Users**

#### Phase 2: Database Schema (1-2 hours)

- [ ] Design your core tables (e.g., `products`, `inquiries`, `blog_posts`)
- [ ] Create tables via SQL Editor or Table Editor
- [ ] Enable Row-Level Security (RLS) on all tables
- [ ] Create RLS policies:
  - Public read for published content
  - Authenticated full access for admins
  - Public insert for lead forms
- [ ] Test database access from frontend

#### Phase 3: Authentication (30 min)

- [ ] Create `LoginPage.tsx` component
- [ ] Implement `signInWithPassword` flow
- [ ] Add password recovery flow
- [ ] Protect admin routes with auth check
- [ ] Test login/logout/recovery

#### Phase 4: Admin Console (3-4 hours)

- [ ] Create `AdminDashboard.tsx` with tabs
- [ ] Implement CRUD operations for main entity (inventory, products, etc.)
- [ ] Add image upload with compression
- [ ] Build lead/inquiry management interface
- [ ] Add CSV export functionality
- [ ] Implement search/filter logic

#### Phase 5: Public Site Integration (2-3 hours)

- [ ] Create public listing pages
- [ ] Connect to Supabase with RLS policies
- [ ] Add contact/inquiry form
- [ ] Implement lead submission to database
- [ ] Track events in analytics table

#### Phase 6: Blog/CMS (Optional, 2-3 hours)

- [ ] Create `blog_posts` table
- [ ] Install TipTap and markdown libraries
- [ ] Build rich-text editor component
- [ ] Create blog admin interface
- [ ] Build public blog index and post pages
- [ ] Implement SEO metadata

#### Phase 7: Analytics (Optional, 1-2 hours)

- [ ] Create analytics event tables
- [ ] Track key user actions (views, clicks, submissions)
- [ ] Build analytics dashboard in admin
- [ ] [Optional] Integrate PostHog for advanced analytics

#### Phase 8: Deployment (1 hour)

- [ ] Set up Netlify/Vercel project
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy and test production build
- [ ] Set up custom domain
- [ ] Configure SSL certificate

### Estimated Total Time: 12-18 hours

---

## Key Learnings & Best Practices

### 1. Security

✅ **DO:**
- Enable RLS on ALL tables
- Use environment variables for API keys
- Test policies thoroughly before launch
- Hash sensitive data in database
- Use Supabase Auth instead of rolling your own

❌ **DON'T:**
- Commit API keys to Git
- Give public users write access to critical tables
- Store passwords in plain text
- Skip authentication on admin routes

### 2. Performance

✅ **DO:**
- Compress images before upload (1200px max)
- Use database indexes on frequently queried columns
- Implement pagination for large datasets
- Cache static assets
- Use lazy loading for images

❌ **DON'T:**
- Upload full-resolution photos (5MB+)
- Fetch all records without limits
- Run N+1 queries in loops

### 3. User Experience

✅ **DO:**
- Show loading states during API calls
- Provide clear error messages
- Auto-save drafts periodically
- Confirm destructive actions (delete)
- Export data in standard formats (CSV)

❌ **DON'T:**
- Leave users guessing during long operations
- Show generic "Something went wrong" errors
- Delete data without confirmation

### 4. Maintainability

✅ **DO:**
- Use TypeScript for type safety
- Document your database schema
- Keep components small and focused
- Use consistent naming conventions
- Write README for future you

❌ **DON'T:**
- Create 1000+ line components
- Use magic numbers/strings
- Skip code comments for complex logic

---

## Troubleshooting

### Common Issues

#### "Failed to fetch" when querying Supabase

**Cause:** RLS policy blocking access

**Fix:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Temporarily disable to test (NOT for production)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;

-- Then create proper policy
CREATE POLICY "Your policy name"
  ON your_table FOR SELECT
  USING (true); -- Adjust condition as needed
```

#### "Invalid API key" error

**Cause:** Wrong Supabase keys

**Fix:**
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy **Project URL** and **anon/public** key (NOT the secret key)
3. Update `supabaseClient.ts`

#### Images not uploading

**Cause:** Storage bucket not created or missing policies

**Fix:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('unit-images', 'unit-images', true);

-- Add upload policy
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'unit-images' AND auth.role() = 'authenticated');
```

#### Login not working

**Cause:** Email auth not enabled

**Fix:**
1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

---

## Resources & References

### Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row-Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [React Router v7 Docs](https://reactrouter.com/)
- [TipTap Editor](https://tiptap.dev/)

### Tutorials

- [Supabase YouTube Channel](https://www.youtube.com/@Supabase)
- [Build a CRUD App with Supabase](https://supabase.com/docs/guides/getting-started/tutorials)

### Community

- [Supabase Discord](https://discord.supabase.com/)
- [r/Supabase Reddit](https://reddit.com/r/Supabase)

---

## Conclusion

This architecture provides a **production-ready, scalable, and cost-effective** backend solution for content-heavy websites. The combination of Supabase (managed PostgreSQL + Auth + Storage) and React enables rapid development without sacrificing features or security.

### Total Monthly Cost Estimate

- **Supabase**: $0 (Free tier: 500MB database, 1GB storage, 50K monthly active users)
- **Netlify/Vercel**: $0 (Free tier: 100GB bandwidth)
- **PostHog** (Optional): $0 (Free tier: 1M events/month)

**Total: $0/month** until you scale beyond free tiers.

### When to Upgrade

- **Database**: > 500MB or need daily backups → Supabase Pro ($25/mo)
- **Hosting**: > 100GB bandwidth → Netlify Pro ($19/mo)
- **Analytics**: > 1M events/month → PostHog paid plans

---

**Last Updated**: April 2026  
**Maintainer**: Katya Araneta  
**Project**: Facilities, Incorporated Website

For questions or support, contact: mercy.laurenciano@gmail.com
