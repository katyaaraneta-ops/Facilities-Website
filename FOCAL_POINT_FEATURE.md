# Blog Cover Image Focal Point Feature

## Overview
This feature adds a draggable focal point control for blog cover images, allowing you to adjust which part of the image is displayed in the fixed 2:1 aspect ratio frame.

## What's New
- **Draggable focal point**: Click or drag on the cover image preview in the admin to adjust the focal point
- **Visual feedback**: A crosshair icon shows the current focal point position
- **Reset option**: Quickly reset to center (50%, 50%)
- **Touch support**: Works on mobile devices with touch gestures
- **Persistent positioning**: Focal point is saved and applied consistently across blog listing and detail pages

## Database Migration Required

### Step 1: Apply the Migration
You need to run the SQL migration to add the focal point columns to your `blog_posts` table.

**File**: `supabase/migrations/20260412_add_focal_point.sql`

**Option A - Via Supabase Dashboard:**
1. Go to your Supabase project dashboard: https://qriujbcdkawzziemyykd.supabase.co
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20260412_add_focal_point.sql`
5. Click **Run** to execute the migration

**Option B - Via Supabase CLI (if installed):**
```bash
supabase db push
```

### Step 2: Verify the Migration
After running the migration, you should see two new columns in the `blog_posts` table:
- `cover_focus_x` (numeric, default 50.00)
- `cover_focus_y` (numeric, default 50.00)

## How to Use

### For Existing Posts
1. Navigate to **Admin Dashboard** → **Blog** tab
2. Click **Edit** on any blog post with a cover image
3. You'll see the draggable focal point control above the cover image
4. Click or drag the crosshair to adjust the focal point
5. The coordinates display in the bottom-left corner on hover
6. Click **Reset to Center** to return to default (50%, 50%)
7. Save the post to persist the changes

### For New Posts
1. Upload a cover image as usual
2. The draggable focal point control will appear automatically
3. Adjust the focal point before publishing
4. Default position is center (50%, 50%)

## Technical Details

### How It Works
- The focal point uses CSS `object-position` with percentage values (0-100%)
- The drag interaction is constrained to the visible area based on the image aspect ratio vs. container aspect ratio
- Wider images allow more horizontal movement, taller images allow more vertical movement
- Values are stored as decimals in the database with 2 decimal precision

### Components
- **DraggableFocalPoint.tsx**: Reusable component for focal point control
- **AdminDashboard.tsx**: Integrated into blog post form
- **App.tsx**: Applied to blog listing and detail page renders

### Browser Compatibility
Works in all modern browsers that support:
- CSS `object-fit: cover`
- CSS `object-position`
- Mouse and touch events

## Notes
- The focal point only affects how the image is displayed on **your site**
- **Link previews** (Open Graph, social media shares) that use the raw image URL may not reflect the focal point adjustment
- For exact control in all contexts, consider cropping images to 2:1 aspect ratio before upload
- Existing posts without focal point values default to center (50%, 50%)

## Troubleshooting

### Focal point not saving
- Make sure the database migration was applied successfully
- Check browser console for any errors
- Verify the `cover_focus_x` and `cover_focus_y` columns exist in the `blog_posts` table

### Image looks the same after adjustment
- Some images may have most content in the center, making adjustments less visible
- Try images with off-center subjects to see the effect more clearly
- Check that the image aspect ratio differs significantly from 2:1

### Drag not working
- Make sure you're clicking directly on the image preview area
- Check that JavaScript is enabled
- Try refreshing the page
- On mobile, use a single finger to drag

## Support
If you encounter issues, check:
1. Database migration was applied correctly
2. No console errors in browser dev tools
3. Dev server is running (`npm run dev`)
4. All file changes have been saved
