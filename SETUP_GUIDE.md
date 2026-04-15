# Complete Setup Guide - Before Vercel Deployment

This guide covers setting up Supabase (database & storage) before deploying to Vercel.

## Prerequisites

- Supabase account: https://app.supabase.com
- GitHub account (for Vercel)
- Vercel account: https://vercel.com

---

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [Supabase Console](https://app.supabase.com)
2. Click **New Project**
3. Enter:
   - **Name:** Royal Challengers Sports Club
   - **Database Password:** Generate strong password
   - **Region:** Choose closest to your location
4. Click **Create New Project** (wait 5-10 min)

### 1.2 Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon/Public key** → `VITE_SUPABASE_ANON_KEY`

Save these for Vercel environment variables!

---

## Part 2: Database Tables Setup

### 2.1 Create Highlights Table

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste:

```sql
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Visible',
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE highlights DISABLE ROW LEVEL SECURITY;
CREATE INDEX idx_highlights_status ON highlights(status);
CREATE INDEX idx_highlights_created_at ON highlights(created_at DESC);
```

4. Click **Run**

### 2.2 Create Gallery Table

```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Photos',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_created_at ON gallery(created_at DESC);
```

### 2.3 Create Dynamic Blocks Table

```sql
CREATE TABLE dynamic_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT,
  content JSONB,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE dynamic_blocks DISABLE ROW LEVEL SECURITY;
CREATE INDEX idx_dynamic_blocks_type ON dynamic_blocks(type);
CREATE INDEX idx_dynamic_blocks_is_visible ON dynamic_blocks(is_visible);
```

✅ All three tables created!

---

## Part 3: Storage Setup (Images & Videos)

### 3.1 Create Storage Bucket

1. Go to **Storage** in left menu
2. Click **Create a new bucket**
3. Enter:
   - **Name:** `highlights`
   - **Public bucket:** Toggle ON
4. Click **Create Bucket**

### 3.2 Set Storage Policies

1. Click `highlights` bucket
2. Click **Policies** tab
3. Click **New Policy** → select each operation:

#### Policy 1: SELECT (Read)
```sql
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'highlights');
```

#### Policy 2: INSERT (Upload)
```sql
CREATE POLICY "Enable uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'highlights');
```

#### Policy 3: DELETE (Delete)
```sql
CREATE POLICY "Enable deletes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'highlights');
```

✅ Storage bucket ready!

---

## Part 4: Verify Everything Works Locally

```bash
# In project directory
npm install
npm run dev

# Test in browser
# 1. Go to http://localhost:5173
# 2. Login with admin/admin
# 3. Upload an image to Highlights
# 4. Upload an image to Gallery
# 5. Check landing page shows images
```

---

## Part 5: Push to GitHub

```bash
git add .
git commit -m "Setup project for Vercel deployment"
git push origin main
```

---

## Part 6: Vercel Deployment

### 6.1 Connect Vercel to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Find and select your GitHub repo
4. Click **Import**

### 6.2 Add Environment Variables

In Vercel → Your Project → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://cjpbdmeculihrraniuus.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_5V8SfhxvuuDUZ3eXcdnOzw_8jXMSzYQ
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin
VITE_APP_NAME=Royal Challengers Sports Club
VITE_APP_ENV=production
```

✅ Click **Save**

### 6.3 Deploy

Click **Deploy** in Vercel dashboard.

Wait for deployment to complete (2-3 minutes).

---

## Post-Deployment Verification

1. **Visit your deployment URL** (vercel gives you one)
2. **Test admin login:**
   - Username: `admin`
   - Password: `admin`
3. **Upload a test image** and verify it appears on the landing page
4. **Check console** for any errors

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Table doesn't exist" | Run SQL setup scripts in Supabase SQL Editor |
| "Bucket not found" | Create `highlights` bucket in Supabase Storage |
| "Upload failed: RLS" | Disable RLS on tables (included in SQL scripts) |
| "Login doesn't work" | Check admin credentials in Vercel env vars |
| "Images not loading" | Verify bucket is PUBLIC in Storage settings |

---

## Summary of Setup

✅ Supabase Project created
✅ Database tables: highlights, gallery, dynamic_blocks
✅ Storage bucket: highlights (public)
✅ Storage policies: SELECT, INSERT, DELETE
✅ Local testing complete
✅ GitHub connected to Vercel
✅ Environment variables configured
✅ Deployed to Vercel

**Total time:** ~20 minutes

---

## Next Steps

- Update admin credentials for production
- Add custom domain in Vercel (optional)
- Set up monitoring/analytics
- Configure backups in Supabase (optional)

## Links

- Current Supabase: https://app.supabase.com/projects
- Vercel Dashboard: https://vercel.com/dashboard
- Project Repository: Check Vercel settings for GitHub link
