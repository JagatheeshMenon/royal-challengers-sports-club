# Vercel Deployment Guide

## Pre-Deployment Checklist

✅ Project cleaned (Firebase files removed)
✅ Supabase database configured with gallery table
✅ Environment variables setup ready
✅ Build passes locally: `npm run build`

## Step 1: Prepare Your Repository

```bash
# Make sure .gitignore is correct
git add .
git commit -m "Clean project and prepare for Vercel deployment"
git push origin main
```

**Files that should NOT be in git:**
- `.env` (never commit)
- `node_modules/`
- `dist/`

## Step 2: Connect to Vercel

### Option A: UI Dashboard (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select your GitHub repository
4. Click **Import**

### Option B: CLI
```bash
npx vercel@latest
# Follow the prompts to link your project
```

## Step 3: Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

### Production Variables

| Variable | Value | Get From |
|----------|-------|----------|
| `VITE_SUPABASE_URL` | `https://cjpbdmeculihrraniuus.supabase.co` | Supabase Console |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Supabase → Settings → API |
| `VITE_ADMIN_USERNAME` | `admin` | Your choice |
| `VITE_ADMIN_PASSWORD` | Strong password | Your choice |
| `VITE_APP_NAME` | `Royal Challengers Sports Club` | Fixed |
| `VITE_APP_ENV` | `production` | Fixed |

### Step-by-Step for Supabase Variables:
1. Go to [Supabase Console](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `Anon/Public` key → `VITE_SUPABASE_ANON_KEY`

## Step 4: Deploy

### Automatic Deployment
Every push to `main` branch triggers automatic deployment.

### Manual Deployment
```bash
vercel --prod
```

## Step 5: Verify Deployment

1. Visit your Vercel deployment URL
2. Test login with admin credentials
3. Verify images load correctly
4. Test gallery upload functionality

## Environment Variable Security

### ⚠️ Important Notes:

**Public Variables (Safe in `.env.example`):**
- `VITE_SUPABASE_URL` - This is public by design (Supabase URL)
- `VITE_SUPABASE_ANON_KEY` - Public key, with RLS policies for security
- `VITE_APP_NAME` - Application name

**Private Variables (NEVER commit):**
- `VITE_ADMIN_USERNAME` - Change default "admin" for production
- `VITE_ADMIN_PASSWORD` - Use strong password, different from development
- `.env` file - Add to .gitignore

### Recommended Production Setup:

```
VITE_ADMIN_USERNAME=your_secure_username (not "admin")
VITE_ADMIN_PASSWORD=generate_strong_password (use password generator)
```

## Custom Domain Setup

1. In Vercel Dashboard → Your Project → Domains
2. Click **Add**
3. Enter your domain (e.g., `royalchallengerssports.com`)
4. Follow DNS instructions from your domain provider

## Build & Performance Optimizations

### Production Build:
```bash
npm run build
```

**Current Build Stats:**
- Bundle size: ~639KB (gzipped: 184KB)
- Modules: 2143
- Build time: ~2s

### Rollback

If deployment has issues:
1. Go to Vercel Dashboard → Deployments
2. Click the previous deployment
3. Click **Promote to Production**

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `npm run build` locally first |
| Variables not working | Verify exact variable names in Vercel settings |
| Images not loading | Check Supabase Storage bucket is public |
| Admin login fails | Verify VITE_ADMIN_USERNAME/PASSWORD in Vercel |
| CORS errors | Check Supabase URL is set correctly |

## Post-Deployment

### Monitor Performance:
- Vercel Dashboard → Analytics
- Check Core Web Vitals
- Monitor build times

### Update Content:
- Admin users can update:
  - Highlights
  - Gallery images
  - Dynamic blocks
- Changes sync in real-time from Supabase

### Schedule Maintenance:
- Always test locally before pushing
- Deploy during low-traffic hours if possible
- Keep dependencies updated: `npm update`

## Support

**Vercel Docs:** https://vercel.com/docs
**Supabase Docs:** https://supabase.com/docs
**Vite Docs:** https://vitejs.dev/guide/

## Quick Deploy Command

```bash
# Build and test locally
npm run build

# Deploy to Vercel
vercel --prod
```

---

**Deployed URL:** Will be provided by Vercel after first deployment
**Environment:** auto.vercel.app (staging) or custom domain (production)
