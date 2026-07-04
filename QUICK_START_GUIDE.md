# Quick Start Guide: Building Similar Backends

> **TL;DR**: This is the condensed version of the full `BACKEND_ARCHITECTURE.md`. Use this for rapid implementation of similar systems.

---

## Tech Stack (Copy-Paste Ready)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1",
    "@tiptap/react": "^3.22.3",
    "@tiptap/starter-kit": "^3.22.3",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "react-router-dom": "^7.13.1",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1",
    "lucide-react": "^0.562.0"
  }
}
```

---

## 30-Minute Setup Checklist

### Step 1: Supabase Project (5 min)

```bash
# 1. Go to supabase.com and create project
# 2. Copy Project URL and anon key from Settings → API
# 3. Create supabaseClient.ts:
```

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 2: Database Tables (10 min)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main content table (customize for your use case)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  status TEXT DEFAULT 'Active',
  image_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads/inquiries table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog posts table (optional)
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events table (optional)
CREATE TABLE engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  item_id UUID,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view active items"
  ON items FOR SELECT USING (status = 'Active');

CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT USING (is_published = TRUE);

-- Admin full access
CREATE POLICY "Admins have full access to items"
  ON items FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to leads"
  ON leads FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to blog"
  ON blog_posts FOR ALL USING (auth.role() = 'authenticated');

-- Public can submit leads
CREATE POLICY "Public can submit leads"
  ON leads FOR INSERT WITH CHECK (true);

-- Public can track events
CREATE POLICY "Public can track events"
  ON engagement_events FOR INSERT WITH CHECK (true);
```

### Step 3: Storage Buckets (2 min)

```sql
-- Via Supabase Dashboard → Storage → New Bucket
-- Create: "images" (public)

-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Storage policies
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```

### Step 4: Authentication (3 min)

```bash
# 1. Go to Supabase Dashboard → Authentication → Providers
# 2. Enable "Email" provider
# 3. Go to Authentication → Users → Add User
# 4. Create admin user: admin@yoursite.com
```

### Step 5: Basic Login Component (10 min)

```typescript
// LoginPage.tsx
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export const LoginPage: React.FC<{ onLoginSuccess: (user: any) => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      onLoginSuccess(data.user);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## Essential Code Snippets

### Fetch Data from Supabase

```typescript
// Fetch all items
const { data, error } = await supabase
  .from('items')
  .select('*')
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error:', error);
} else {
  setItems(data);
}
```

### Insert New Record

```typescript
const { error } = await supabase
  .from('items')
  .insert([{
    title: 'New Item',
    description: 'Description here',
    price: 100,
    status: 'Active'
  }]);

if (error) {
  alert('Error: ' + error.message);
} else {
  alert('Success!');
}
```

### Update Record

```typescript
const { error } = await supabase
  .from('items')
  .update({ status: 'Sold' })
  .eq('id', itemId);
```

### Delete Record

```typescript
const { error } = await supabase
  .from('items')
  .delete()
  .eq('id', itemId);
```

### Upload Image

```typescript
const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file);
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
```

### Image Compression (Client-Side)

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
        
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Compression failed')),
          'image/jpeg',
          0.8
        );
      };
    };
  });
};

// Usage
const handleUpload = async (file: File) => {
  const compressed = await compressImage(file);
  const publicUrl = await uploadImage(new File([compressed], file.name));
  // Save publicUrl to database
};
```

### Track Analytics Event

```typescript
const trackEvent = async (eventType: string, properties: Record<string, any>) => {
  await supabase.from('engagement_events').insert([{
    event_type: eventType,
    ...properties
  }]);
};

// Usage
trackEvent('item_viewed', { item_id: '123', source: 'listing_page' });
```

### Export to CSV

```typescript
const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(val => 
      `"${String(val || '').replace(/"/g, '""')}"`
    ).join(',')
  ).join('\n');
  
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
};

// Usage
exportToCSV(leads, 'leads_export.csv');
```

---

## Admin Dashboard Template

```typescript
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'leads'>('items');
  const [items, setItems] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    
    if (activeTab === 'items') {
      const { data } = await supabase.from('items').select('*');
      setItems(data || []);
    } else {
      const { data } = await supabase.from('leads').select('*');
      setLeads(data || []);
    }
    
    setLoading(false);
  };

  return (
    <div>
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <nav>
        <button onClick={() => setActiveTab('items')}>Items</button>
        <button onClick={() => setActiveTab('leads')}>Leads</button>
      </nav>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'items' ? (
        <div>
          <h2>Items ({items.length})</h2>
          {items.map(item => (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h2>Leads ({leads.length})</h2>
          {leads.map(lead => (
            <div key={lead.id}>
              <h3>{lead.full_name}</h3>
              <p>{lead.email} | {lead.phone}</p>
              <p>{lead.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Deployment (Netlify)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Create netlify.toml
cat > netlify.toml << EOF
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# 4. Deploy
netlify deploy --prod

# 5. Set environment variables in Netlify dashboard
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

---

## Common Issues & Fixes

### Issue: "Failed to fetch" from Supabase

**Fix:** Check RLS policies. Temporarily disable to debug:

```sql
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY; -- TEST ONLY!
```

### Issue: Images not uploading

**Fix:** Check storage bucket exists and policies allow upload:

```sql
-- Via Supabase Dashboard → Storage → Check bucket exists
-- Check policies in SQL Editor
SELECT * FROM storage.policies WHERE bucket_id = 'images';
```

### Issue: Login not working

**Fix:** Ensure Email auth is enabled:
- Go to **Supabase Dashboard** → **Authentication** → **Providers**
- Enable **Email** provider

---

## Customization Checklist

When adapting this for a new project:

- [ ] Replace "items" table with your domain (products, properties, courses, etc.)
- [ ] Update table columns to match your data structure
- [ ] Change "images" bucket name if needed
- [ ] Customize lead form fields
- [ ] Update admin dashboard tabs/sections
- [ ] Modify analytics event types
- [ ] Adjust RLS policies for your access rules
- [ ] Update branding/styling
- [ ] Configure custom domain
- [ ] Set up email notifications (Netlify Forms or Supabase Edge Functions)

---

## Time Estimates

| Task | Time |
|------|------|
| Supabase setup | 5 min |
| Database schema | 10 min |
| Storage buckets | 2 min |
| Authentication | 3 min |
| Basic login page | 10 min |
| Admin CRUD interface | 2-3 hours |
| Public site integration | 1-2 hours |
| Image upload & compression | 1 hour |
| Analytics tracking | 30 min |
| Deployment | 30 min |
| **TOTAL** | **6-10 hours** |

---

## Next Steps

1. Read the full `BACKEND_ARCHITECTURE.md` for detailed explanations
2. Copy this template and customize for your use case
3. Test thoroughly with dummy data
4. Launch to production
5. Monitor with analytics
6. Iterate based on user feedback

---

**Pro Tip**: Start with the absolute minimum (1 table, 1 admin page, 1 public page) and iterate. Don't overbuild on day 1.

Good luck! 🚀
