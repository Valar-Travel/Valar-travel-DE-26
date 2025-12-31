# Security Implementation Guide

## Overview

This document outlines the security measures implemented in the Valar Travel application to protect the database and API endpoints.

## Implemented Security Features

### 1. IP-Based Rate Limiting

**File:** `lib/ip-rate-limiter.ts`

**Purpose:** Prevent abuse of public endpoints by limiting requests per IP address.

**Configuration:**
- Newsletter: 5 requests/hour
- Contact forms: 10 requests/hour
- Owner inquiries: 3 requests/hour
- Default: 100 requests/hour

**Usage:**
\`\`\`typescript
import { rateLimitByIP, getClientIP } from '@/lib/ip-rate-limiter'

export async function POST(request: Request) {
  const ip = getClientIP(request)
  const rateLimit = await rateLimitByIP(ip, 'newsletter')
  
  if (!rateLimit.success) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // Process request
}
\`\`\`

### 2. Input Validation & Sanitization

**File:** `lib/input-validation.ts`

**Features:**
- Email validation
- Phone number validation
- String sanitization (XSS prevention)
- URL validation
- HTML sanitization
- Form data validation

**Usage:**
\`\`\`typescript
import { validateContactForm } from '@/lib/input-validation'

const validation = validateContactForm(formData)
if (!validation.isValid) {
  return Response.json({ errors: validation.errors }, { status: 400 })
}

// Use validation.sanitized data
\`\`\`

### 3. Security Headers

**File:** `lib/security-headers.ts`

**Headers Applied:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

### 4. API Route Protection

**File:** `lib/api-protection.ts`

**Features:**
- Method validation
- Rate limiting
- Authentication checks
- Security headers
- Standardized responses

**Usage:**
\`\`\`typescript
import { protectAPIRoute, createAPIResponse } from '@/lib/api-protection'

export async function POST(request: Request) {
  const protection = await protectAPIRoute(request, {
    rateLimit: 'contact',
    allowedMethods: ['POST'],
  })
  
  if (!protection.allowed) {
    return protection.response!
  }
  
  // Process request
  return createAPIResponse({ success: true })
}
\`\`\`

## Database Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**Public Tables (Read):**
- `villas`
- `blog_posts`
- `collaborations`

**Public Tables (Insert):**
- `contact_messages`
- `newsletter_subscriptions`
- `villa_owners`

**Protected Tables:**
- `bookings` (user-specific)
- `profiles` (user-specific)
- Admin tables (service role only)

### Connection Security

- SSL/TLS enforced on all connections
- Connection pooling configured
- Service role key never exposed to client
- Anon key used for client-side operations

## API Endpoint Security Checklist

When creating new API endpoints:

- [ ] Apply rate limiting
- [ ] Validate and sanitize inputs
- [ ] Add security headers
- [ ] Check authentication (if required)
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Log suspicious activity
- [ ] Return appropriate error messages (don't leak info)
- [ ] Test with invalid/malicious inputs

## Example: Secure API Route

\`\`\`typescript
import { protectAPIRoute, createAPIResponse } from '@/lib/api-protection'
import { validateContactForm } from '@/lib/input-validation'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // 1. Protect the route
  const protection = await protectAPIRoute(request, {
    rateLimit: 'contact',
    allowedMethods: ['POST'],
  })
  
  if (!protection.allowed) {
    return protection.response!
  }
  
  // 2. Parse and validate input
  const body = await request.json()
  const validation = validateContactForm(body)
  
  if (!validation.isValid) {
    return createAPIResponse(
      { errors: validation.errors },
      400
    )
  }
  
  // 3. Process with sanitized data
  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_messages')
    .insert(validation.sanitized)
  
  if (error) {
    console.error('[v0] Database error:', error)
    return createAPIResponse(
      { error: 'Failed to submit message' },
      500
    )
  }
  
  // 4. Return success
  return createAPIResponse({ success: true })
}
\`\`\`

## Monitoring & Alerts

### What to Monitor:

1. **Rate Limit Violations**
   - Track IPs hitting rate limits
   - Alert on sustained abuse

2. **Failed Authentication Attempts**
   - Log failed login attempts
   - Alert on brute force patterns

3. **Database Errors**
   - Monitor RLS policy violations
   - Track connection pool exhaustion

4. **Suspicious Patterns**
   - Multiple failed validations from same IP
   - Unusual request patterns
   - SQL injection attempts

### Logging Best Practices:

\`\`\`typescript
// Log security events
console.log('[v0] Security event:', {
  type: 'rate_limit_exceeded',
  ip: protection.ip,
  endpoint: '/api/newsletter/subscribe',
  timestamp: new Date().toISOString(),
})
\`\`\`

## Regular Security Tasks

### Weekly:
- Review rate limit logs
- Check for suspicious patterns
- Update dependencies

### Monthly:
- Audit RLS policies
- Review API endpoint security
- Test security measures

### Quarterly:
- Rotate API keys
- Security audit
- Penetration testing
- Update security documentation

## Emergency Response

### If Security Breach Detected:

1. **Immediate Actions:**
   - Rotate all API keys
   - Enable IP restrictions
   - Review access logs
   - Notify affected users

2. **Investigation:**
   - Identify breach vector
   - Assess data exposure
   - Document timeline

3. **Remediation:**
   - Patch vulnerabilities
   - Update security measures
   - Implement additional monitoring

4. **Post-Mortem:**
   - Document lessons learned
   - Update security procedures
   - Train team on new measures

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
\`\`\`
