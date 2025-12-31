# Supabase Manual Cleanup & Security Steps

## Critical Security Issues to Fix

### 1. Fix SQL Injection Vulnerabilities in `lib/neon-db.ts`

**Problem:** Using string interpolation in SQL queries
**Fix:** Replace with parameterized queries

\`\`\`typescript
// ❌ BAD - SQL Injection vulnerability
whereConditions.push(`location ILIKE '%${location}%'`)

// ✅ GOOD - Use parameterized queries
whereConditions.push(sql`location ILIKE ${'%' + location + '%'}`)
\`\`\`

### 2. Remove Service Role Key from Client-Side Routes

**Files to check:**
- `app/api/newsletter/subscribe/route.ts` (Line 19)
- `app/api/owners/submit/route.ts` (Line 14)
- `lib/async-db-query.ts` (Line 3)

**Fix:** Use the server-side client with anon key instead

\`\`\`typescript
// ❌ BAD - Exposes full database access
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// ✅ GOOD - Use anon key for public operations
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()
\`\`\`

### 3. Strengthen RLS Policies

**Go to Supabase Dashboard → SQL Editor and run:**

\`\`\`sql
-- Fix scraped_properties policies to check ownership
DROP POLICY IF EXISTS "Authenticated users can update properties" ON scraped_properties;
DROP POLICY IF EXISTS "Authenticated users can delete properties" ON scraped_properties;

CREATE POLICY "Users can only update their own properties"
  ON scraped_properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can delete any property"
  ON scraped_properties
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );
\`\`\`

### 4. Remove Duplicate Migration Scripts

**Duplicates found:**
- `scripts/015-create-scraped-properties-schema.ts`
- `scripts/015-create-scraped-properties-schema.sql`
- `scripts/000-master-setup-all-tables.ts`

**Action:** Keep only `000-master-setup-all-tables.ts` and delete the others

### 5. Clean Up Old Non-Caribbean Data

**In Supabase SQL Editor, run:**

\`\`\`sql
-- Remove all non-Caribbean destinations
DELETE FROM cities 
WHERE LOWER(name) IN ('paris', 'tokyo', 'new york', 'london', 'rome', 'barcelona', 'dubai', 'singapore', 'bali', 'maldives');

DELETE FROM deals 
WHERE LOWER(city) IN ('paris', 'tokyo', 'new york', 'london', 'rome', 'barcelona', 'dubai', 'singapore', 'bali', 'maldives');

DELETE FROM properties 
WHERE LOWER(city) IN ('paris', 'tokyo', 'new york', 'london', 'rome', 'barcelona', 'dubai', 'singapore', 'bali', 'maldives');

-- Remove old unpublished scraped properties (older than 30 days)
DELETE FROM scraped_properties 
WHERE is_published = false 
AND scraped_at < NOW() - INTERVAL '30 days';
\`\`\`

### 6. Add Missing Indexes for Performance

**In Supabase SQL Editor:**

\`\`\`sql
-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_scraped_properties_published_scraped 
  ON scraped_properties(is_published, scraped_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraped_properties_city_published 
  ON scraped_properties(city, is_published);

CREATE INDEX IF NOT EXISTS idx_villas_location_featured 
  ON villas(location, featured) WHERE status = 'active';

-- Add partial indexes to save space
CREATE INDEX IF NOT EXISTS idx_active_villas 
  ON villas(created_at DESC) WHERE status = 'active';
\`\`\`

### 7. Enable Connection Pooling

**In Supabase Dashboard:**
1. Go to **Settings → Database**
2. Find **Connection Pooling** section
3. Enable **Transaction Mode** for API routes
4. Use `POSTGRES_URL` (pooled) instead of `POSTGRES_URL_NON_POOLING`

### 8. Set Up Database Monitoring

**In Supabase Dashboard:**
1. Go to **Settings → Alerts**
2. Add alerts for:
   - Database CPU > 80%
   - Connection pool > 80% full
   - Failed auth attempts > 100/hour
   - Storage > 80% full

### 9. Review and Remove Debug Console Logs

**Files with [v0] debug logs:**
- `lib/supabase/client.ts`
- `lib/supabase/middleware.ts`

**Action:** Remove or disable in production

\`\`\`typescript
// ❌ Remove these in production
console.log("[v0] Creating Supabase client successfully")

// ✅ Or use environment check
if (process.env.NODE_ENV === 'development') {
  console.log("[v0] Creating Supabase client successfully")
}
\`\`\`

### 10. Enable SSL Mode in Database URL

**Check your environment variables:**

\`\`\`bash
# ✅ GOOD - Has sslmode=require
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# ❌ BAD - Missing SSL mode
DATABASE_URL="postgresql://user:pass@host:5432/db"
\`\`\`

**To fix:** Add `?sslmode=require` to all database URLs

## Quick Wins Checklist

Priority tasks you can do right now:

- [ ] Run `scripts/complete-database-audit-and-fix.ts` to clean data
- [ ] Go to Supabase SQL Editor and run the RLS policy updates
- [ ] Go to Supabase SQL Editor and delete non-Caribbean data
- [ ] Check all DATABASE_URL variables have `?sslmode=require`
- [ ] Remove duplicate migration files
- [ ] Fix SQL injection in `lib/neon-db.ts`
- [ ] Remove service role key from `lib/async-db-query.ts`
- [ ] Set up monitoring alerts in Supabase dashboard
- [ ] Enable connection pooling in Supabase settings
- [ ] Remove debug console.log statements

## Testing After Changes

\`\`\`bash
# 1. Test database connection
npm run dev

# 2. Check for errors in console

# 3. Test scraper
Visit: http://localhost:3000/api/run-scraper

# 4. Verify only Caribbean destinations show
Visit: http://localhost:3000

# 5. Check Supabase logs
Go to Supabase Dashboard → Logs → Database
\`\`\`

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs
2. Review error messages in browser console
3. Test database connection: `psql $DATABASE_URL -c "SELECT 1"`
