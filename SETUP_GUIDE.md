# Valar Travel Setup Guide

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-repo/valar-travel.git
cd valar-travel
pnpm install
```

### 2. Environment Variables

Create `.env.local` with the following variables:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Stripe (Optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret

# Resend (Optional - for emails)
RESEND_API_KEY=your_resend_key
```

### 3. Database Setup

The database is managed through Supabase. Tables are created automatically via migrations.

**Required Tables:**
- `scraped_luxury_properties` - Villa listings
- `admin_users` - Admin authentication
- `admin_sessions` - Admin sessions
- `contact_messages` - Customer inquiries
- `newsletter_subscriptions` - Newsletter signups

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Detailed Setup

### Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and keys

2. **Enable Row Level Security**
   - All tables have RLS enabled by default
   - Public tables allow anonymous read access
   - Admin tables require authentication

3. **Configure Authentication**
   - Go to Authentication → URL Configuration
   - Add redirect URL: `https://yourdomain.com/auth/callback`
   - For local dev: `http://localhost:3000/auth/callback`

### Stripe Configuration (Optional)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Add to environment variables
4. Configure webhook endpoints (if needed)

### Resend Configuration (Optional)

1. Create a Resend account at [resend.com](https://resend.com)
2. Verify your domain
3. Get your API key
4. Add to environment variables

---

## Admin Setup

### Create Admin User

Run the password reset endpoint to create an admin user:

```bash
curl -X POST https://yourdomain.com/api/admin/reset-password
```

**Default Credentials:**
- Email: `admin@valartravel.de`
- Password: `ValarAdmin2024!`

Change these immediately after first login.

### Access Admin Dashboard

Navigate to `/admin` and log in with your credentials.

---

## Verification

### Health Check

Visit `/api/health` to verify the setup:

```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "ssl": true
  }
}
```

### Verify Environment

Visit `/api/verify-setup` to check all configurations:

```json
{
  "checks": {
    "siteUrl": { "configured": true },
    "supabase": { "configured": true },
    "stripe": { "configured": true }
  }
}
```

---

## Troubleshooting

### Database Connection Issues

1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check that `SUPABASE_SERVICE_ROLE_KEY` has proper permissions
3. Ensure RLS policies allow the required operations

### Authentication Issues

1. Check redirect URLs in Supabase Dashboard
2. Verify `NEXT_PUBLIC_SITE_URL` matches your domain
3. Clear browser cookies and try again

### Build Errors

1. Run `pnpm type-check` to catch TypeScript errors
2. Run `pnpm lint` to fix code style issues
3. Check for missing environment variables

---

## Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy

### Environment Variables in Vercel

Go to Settings → Environment Variables and add:
- All Supabase variables
- `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
- Any optional service keys

### Custom Domain

1. Add your domain in Vercel dashboard
2. Configure DNS records as instructed
3. Enable SSL (automatic)

---

## Support

For issues:
1. Check the [README.md](./README.md) for documentation links
2. Review error logs in Vercel dashboard
3. Check Supabase logs for database issues

---

**Last Updated:** March 2026
