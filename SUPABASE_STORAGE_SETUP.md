# Supabase Storage Setup Guide

## Step 1: Create Storage Bucket

1. Go to **Supabase Dashboard** → Your project
2. Click **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `highlights`
5. Toggle **Enable read access for public URLs**
6. Click **Create Bucket**

## Step 2: Set Bucket Policies

1. Click on the `highlights` bucket
2. Click **Policies** tab
3. Click **New Policy** → **For queries with RLS disabled**
4. Select **Allow all access** or use custom policy below

### Custom Policy for Public Read:
```sql
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'highlights');
```

### Allow Uploads from Anon Users:
```sql
CREATE POLICY "Enable insert for authenticated users only" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'highlights');

CREATE POLICY "Enable delete for authenticated users only" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'highlights');
```

## Step 3: Verify Success

- Try uploading an image through the admin dashboard
- Image should appear in the storage bucket
- Public URL should work in browser

## File Size Limits
- Free tier: 50MB max file size
- Recommend: Images under 5MB for optimal performance

## Cost
- Free tier: 1GB storage
- Storage overage: $0.15 per GB/month
- Bandwidth: Free for first 2GB/month, then $0.12 per GB

## Tips
✅ Use JPG/PNG format
✅ Optimize images before upload (recommended ~1-2MB)
✅ Images are automatically served via CDN
✅ URLs are permanent (can be shared)
