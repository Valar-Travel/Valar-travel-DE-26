# Database Network Restrictions & Security Guide

## Supabase Network Security Configuration

### 1. IP Allowlist (Recommended for Production)

**In Supabase Dashboard:**
1. Go to **Settings** → **Database**
2. Scroll to **Network Restrictions**
3. Enable **Restrict connections to specific IP addresses**
4. Add allowed IPs:
   - Your Vercel deployment IPs
   - Your office/home IP for development
   - Any CI/CD pipeline IPs

**Vercel IP Ranges:**
\`\`\`
76.76.21.0/24
76.76.21.21
76.76.21.142
\`\`\`

### 2. SSL/TLS Enforcement

**Already Configured:**
- All Supabase connections use SSL by default
- Connection strings include `sslmode=require`

**Verify in your connection:**
\`\`\`typescript
// All connections should use SSL
const connectionString = process.env.DATABASE_URL // includes ?sslmode=require
\`\`\`

### 3. Row Level Security (RLS)

**Current Status:** ✅ Enabled on all tables

**Tables with RLS:**
- `villas` - Public read, admin write
- `bookings` - User-specific access
- `villa_owners` - Public insert, admin read
- `contact_messages` - Public insert, admin read
- `newsletter_subscriptions` - Public insert, admin read
- `collaborations` - Public read, admin write
- `blog_posts` - Public read, admin write

### 4. API Key Security

**Environment Variables:**
\`\`\`bash
# Public (client-side) - Limited permissions
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Service Role (server-side only) - Full permissions
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

**Best Practices:**
- ✅ Never expose service role key to client
- ✅ Use anon key for client-side operations
- ✅ Use service role only in API routes/server actions
- ✅ Rotate keys regularly (every 90 days)

### 5. Rate Limiting

**Supabase Built-in Limits:**
- Free tier: 500 requests/second
- Pro tier: 1000 requests/second

**Additional Protection:** See `lib/rate-limiter.ts`

### 6. Database Connection Pooling

**Configuration:**
\`\`\`typescript
// Use pooled connection for API routes
POSTGRES_URL // Pooled connection (recommended)
POSTGRES_URL_NON_POOLING // Direct connection (for migrations)
\`\`\`

**Limits:**
- Free tier: 60 connections
- Pro tier: 200 connections

### 7. Backup & Recovery

**Automated Backups:**
- Daily backups (retained 7 days on free tier)
- Point-in-time recovery (Pro tier)

**Manual Backup:**
\`\`\`bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
\`\`\`

### 8. Monitoring & Alerts

**Set up in Supabase Dashboard:**
1. Go to **Settings** → **Alerts**
2. Configure alerts for:
   - High CPU usage (>80%)
   - High memory usage (>80%)
   - Connection pool exhaustion
   - Failed authentication attempts

### 9. Access Control

**Database Roles:**
- `anon` - Public access (limited by RLS)
- `authenticated` - Logged-in users
- `service_role` - Full access (server-side only)

**Current Implementation:**
\`\`\`typescript
// Client-side (limited access)
import { createClient } from '@/lib/supabase/client'

// Server-side (full access when needed)
import { createClient } from '@/lib/supabase/server'
\`\`\`

### 10. Security Checklist

- [x] RLS enabled on all tables
- [x] SSL/TLS enforced
- [x] Service role key never exposed to client
- [x] Rate limiting implemented
- [x] Connection pooling configured
- [ ] IP allowlist configured (do this in Supabase dashboard)
- [ ] Monitoring alerts set up
- [ ] Regular security audits scheduled
- [ ] Key rotation policy established

## Additional Security Measures

### API Route Protection

All sensitive API routes should:
1. Validate authentication
2. Check authorization
3. Sanitize inputs
4. Rate limit requests
5. Log suspicious activity

### Example Protected Route:
\`\`\`typescript
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limiter'

export async function POST(request: Request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitResult = await rateLimit(ip)
  if (!rateLimitResult.success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Your logic here
}
\`\`\`

## Network Restriction Setup Steps

### Step 1: Get Your Vercel IPs
\`\`\`bash
# Your app will be deployed from these IPs
# Add them to Supabase allowlist
\`\`\`

### Step 2: Configure Supabase
1. Login to Supabase Dashboard
2. Select your project: `valartravel`
3. Go to Settings → Database
4. Enable "Restrict connections"
5. Add Vercel IPs + your development IPs

### Step 3: Test Connection
\`\`\`bash
# Test from allowed IP
psql $DATABASE_URL -c "SELECT 1"

# Should succeed if IP is allowed
# Should fail if IP is blocked
\`\`\`

### Step 4: Update Documentation
Document all allowed IPs and their purposes in your team wiki.

## Emergency Access

If you get locked out:
1. Go to Supabase Dashboard (web access always works)
2. Temporarily disable IP restrictions
3. Fix the issue
4. Re-enable restrictions with correct IPs

## Support

For issues with network restrictions:
- Supabase Support: https://supabase.com/support
- Documentation: https://supabase.com/docs/guides/platform/network-restrictions
\`\`\`

\`\`\`typescript file="" isHidden
