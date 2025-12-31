# Custom Domain Setup Checklist

Use this checklist to ensure you complete all steps when adding your custom domain.

## Pre-Setup

- [ ] Have access to your domain registrar account
- [ ] Have access to your Vercel dashboard
- [ ] Have access to your Supabase dashboard (if using auth)
- [ ] Have access to your Stripe dashboard (if using payments)
- [ ] Know your desired domain (e.g., `valartravel.de`)

## Vercel Configuration

- [ ] Log into Vercel Dashboard
- [ ] Navigate to your project → Settings → Domains
- [ ] Add apex domain (e.g., `valartravel.de`)
- [ ] Add www subdomain (e.g., `www.valartravel.de`)
- [ ] Note the DNS records provided by Vercel

## DNS Configuration

- [ ] Log into your domain registrar
- [ ] Navigate to DNS settings
- [ ] Add A record: `@` → `76.76.21.21`
- [ ] Add CNAME record: `www` → `cname.vercel-dns.com`
- [ ] Save DNS changes
- [ ] Note the time (for tracking propagation)

## Environment Variables

- [ ] Go to Vercel → Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_SITE_URL` with your domain
- [ ] Set for Production environment
- [ ] Set for Preview environment
- [ ] Set for Development environment
- [ ] Save changes
- [ ] Trigger a new deployment (optional, but recommended)

## Supabase Configuration (if using auth)

- [ ] Log into Supabase Dashboard
- [ ] Go to Authentication → URL Configuration
- [ ] Update Site URL to `https://yourdomain.com`
- [ ] Add redirect URL: `https://yourdomain.com/auth/callback`
- [ ] Add redirect URL: `https://yourdomain.com/*`
- [ ] Save changes

## Stripe Configuration (if using payments)

- [ ] Log into Stripe Dashboard
- [ ] Go to Settings → Branding
- [ ] Update website URL to your custom domain
- [ ] Go to Settings → Checkout settings
- [ ] Update success/cancel URLs to use custom domain
- [ ] Go to Developers → Webhooks
- [ ] Update webhook endpoint URLs (if any)
- [ ] Save all changes

## Verification (Wait 24-48 hours for DNS propagation)

- [ ] Check DNS propagation: [dnschecker.org](https://dnschecker.org)
- [ ] Visit `https://yourdomain.com` - should load
- [ ] Visit `http://yourdomain.com` - should redirect to HTTPS
- [ ] Visit `www.yourdomain.com` - should redirect to apex
- [ ] Check SSL certificate (padlock icon in browser)
- [ ] Test sign up/login flow
- [ ] Test all main pages load correctly
- [ ] Test API routes work
- [ ] Test image loading
- [ ] Test Stripe checkout (if applicable)
- [ ] Test on mobile device
- [ ] Test in different browsers (Chrome, Firefox, Safari)

## Post-Setup

- [ ] Update any marketing materials with new domain
- [ ] Update social media profiles with new domain
- [ ] Set up Google Search Console with new domain
- [ ] Submit new sitemap to Google
- [ ] Update any third-party integrations
- [ ] Notify users of domain change (if applicable)
- [ ] Set up email forwarding (optional)
- [ ] Configure professional email (optional)

## Monitoring

- [ ] Monitor Vercel Analytics for traffic
- [ ] Check Vercel logs for any errors
- [ ] Monitor Supabase logs for auth issues
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Set up error tracking (e.g., Sentry)

## Troubleshooting Reference

If something doesn't work:

1. **Domain not loading:** Wait 24-48 hours for DNS propagation
2. **SSL errors:** Wait 5-10 minutes after DNS propagation, Vercel auto-provisions
3. **Auth redirects failing:** Check Supabase redirect URLs
4. **Images not loading:** Check `next.config.mjs` image domains
5. **API errors:** Check environment variables are set correctly

---

**Completion Date:** _______________

**Domain:** _______________

**Notes:**
