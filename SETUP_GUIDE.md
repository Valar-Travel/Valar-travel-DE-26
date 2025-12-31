# Valar Travel Setup Guide

## Current Status
- **Version**: 0.1.2
- **Database**: Neon (Postgres 17)
- **Region**: AWS US East 1 (Virginia)
- **Project**: neon-green-lamp

## Issues Fixed
1. ✅ SSL connection configuration added to all database connections
2. ✅ Cache control headers added for development
3. ✅ Centralized database connection utility created
4. ✅ Health check endpoint added

## Next Steps to Complete Setup

### 1. Run Database Initialization Script
The database tables need to be created. Run this script from the v0 Scripts panel:

\`\`\`bash
packages/backend/src/scripts/000-initialize-neon-database.ts
\`\`\`

This will create:
- `scraped_luxury_properties` - For vacation properties
- `cities` - Caribbean destinations
- `deals` - Travel deals and discounts
- `blog_posts` - Blog content
- Indexes and RLS policies

### 2. Verify Connection
After running the initialization script, check the health endpoint:

\`\`\`
http://localhost:3000/api/health
\`\`\`

You should see:
\`\`\`json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "ssl": true
  }
}
\`\`\`

### 3. Clear Browser Cache
To fix the "old version showing" issue:

**Chrome/Edge:**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Or use keyboard shortcuts:**
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

**Or clear application data:**
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Check all boxes and click "Clear site data"

### 4. Verify Setup is Working

After completing steps 1-3, verify:

1. **Database Tables Created**
   - Go to your Neon console → Tables
   - You should see: scraped_luxury_properties, cities, deals, blog_posts

2. **Website Loads**
   - Visit `http://localhost:3000`
   - Should show Caribbean destinations
   - No SSL errors in console

3. **Health Check Passes**
   - Status should be "healthy"   - Visit `http://localhost:3000/api/health`


## Troubleshooting

### SSL Connection Error
If you still see "SSL connection is required":
1. Check that `POSTGRES_URL` environment variable is set
2. Verify it includes `?sslmode=require` at the end
3. Restart your development server

### Old Version Showing
If the site still shows old content:
1. Clear all browser cache (see step 3 above)
2. Close all browser tabs with localhost:3000
3. Restart Next.js dev server (`npm run dev`)
4. Open in incognito/private window

### Script Won't Run
If the initialization script fails:
1. Check Neon console that database is running
2. Verify environment variables are set in v0
3. Check the error message - it will show specific SSL or connection issues

## Environment Variables Needed

These should already be set from Neon integration:
- `POSTGRES_URL` - Primary connection string
- `DATABASE_URL` - Fallback connection string  
- `NEON_PROJECT_ID` - Project identifier

## Database Schema

### scraped_luxury_properties
\`\`\`sql
- id: UUID (primary key)
- name: TEXT
- location: TEXT
- rating: DECIMAL(3,2) >= 4.0
- price_per_night: DECIMAL(10,2)
- description: TEXT
- amenities: TEXT[]
- images: TEXT[]
- source_url: TEXT
\`\`\`

### cities
\`\`\`sql
- id: SERIAL (primary key)
- name: TEXT
- country: TEXT
- region: TEXT
- is_featured: BOOLEAN
\`\`\`

## Support

If issues persist after following this guide:
1. Check the `/api/health` endpoint response
2. Look for error messages in browser console (F12)
3. Check Neon console for database connectivity
