# Blog Feature Setup Instructions

This guide will help you set up the database and storage for the new blog feature.

## 1. Apply Database Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file: `supabase/migrations/20260412_blog_posts.sql`
4. Copy the entire contents and paste into the SQL Editor
5. Click **Run** to execute the migration

This will create:
- `blog_posts` table with all necessary columns
- Index for efficient querying of published posts
- Row Level Security (RLS) policies
- Auto-update trigger for `updated_at` timestamp

## 2. Create Storage Bucket

1. In your Supabase dashboard, navigate to **Storage**
2. Click **New Bucket**
3. Configure the bucket:
   - **Name**: `blog-images`
   - **Public bucket**: ✅ Yes (checked)
   - Click **Create bucket**

4. Set up storage policies:
   - Click on the `blog-images` bucket
   - Go to **Policies** tab
   - Click **New Policy** and add these policies:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'blog-images' );
```

### Policy 2: Authenticated Insert
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 3: Authenticated Update
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

### Policy 4: Authenticated Delete
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);
```

## 3. Verify Setup

### Test Database Access
Run this query in SQL Editor to verify the table was created:
```sql
SELECT * FROM blog_posts;
```

You should see an empty table with no errors.

### Test Storage Access
1. Go to Storage > blog-images
2. Try uploading a test image
3. Verify you can see and delete it

## 4. Access the Blog Management UI

1. Log into your admin dashboard at `/admin`
2. Click on the **Blog** tab in the navigation
3. Click **New Blog Post** to create your first post
4. Add content using Markdown formatting
5. Upload a cover image (optional)
6. Check "Publish immediately" if you want it live
7. Click **Create Post**

## 5. View Your Blog

- **Blog Index**: Navigate to `/blog` (currently hidden, not in navigation)
- **Individual Post**: Navigate to `/blog/your-slug-here`

Note: The blog is currently set to `noindex,nofollow` for testing. Blog links are not yet added to the homepage or navigation.

## 6. Launch Checklist

When ready to make the blog public:

1. ✅ Test creating, editing, and deleting posts
2. ✅ Verify Markdown rendering works correctly
3. ✅ Test image uploads
4. ✅ Review published posts at `/blog`
5. ✅ Check individual post pages at `/blog/:slug`

Then to launch:
1. Add blog link to homepage/navigation in `App.tsx`
2. Remove `robots="noindex,nofollow"` from blog routes in `App.tsx`
3. Add blog URLs to `public/sitemap.xml`
4. Deploy changes

## Troubleshooting

### "Permission denied" when uploading images
- Check that the `blog-images` bucket is set to **Public**
- Verify all 4 storage policies are in place
- Ensure you're logged in as an authenticated user

### "Table does not exist" error
- Confirm the migration was applied successfully
- Check the SQL Editor for any error messages
- Verify the `blog_posts` table exists in **Table Editor**

### Images not displaying
- Check the bucket is set to Public
- Verify the image URL in the `cover_image_url` column is correct
- Try accessing the image URL directly in your browser

## Features Available

✅ Markdown content with live preview  
✅ Cover image upload (1 per post)  
✅ Draft/Publish toggle  
✅ SEO metadata (title, description, canonical)  
✅ Slug-based URLs (`/blog/your-post-slug`)  
✅ Hidden from search engines until launch  
✅ Edit and delete existing posts  
✅ Responsive design matching site theme  

---

**Need help?** Check the Supabase docs or reach out to your development team.
