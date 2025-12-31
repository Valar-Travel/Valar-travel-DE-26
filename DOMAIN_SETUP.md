# Custom Domain Setup Guide

## Overview

This guide will help you add your custom domain to your Valar Travel Vercel project. Your codebase is already configured to work with custom domains using the `NEXT_PUBLIC_SITE_URL` environment variable.

## Step-by-Step Setup

### Step 1: Add Domain in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Valar Travel** project
3. Navigate to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain (e.g., `valartravel.de`)
6. Click **Add**

**Recommended Setup:**
- Add both apex domain: `valartravel.de`
- Add www subdomain: `www.valartravel.de`
- Set one as primary (Vercel will redirect the other automatically)

### Step 2: Configure DNS Records

Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these DNS records:

#### Option A: Using Vercel DNS (Recommended)

**For apex domain (valartravel.de):**
\`\`\`
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
\`\`\`

**For www subdomain:**
\`\`\`
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
\`\`\`

#### Option B: Using CNAME for Apex (if supported by your registrar)

\`\`\`
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
\`\`\`

\`\`\`
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
\`\`\`

### Step 3: Add Environment Variables in Vercel

1. In Vercel Dashboard, go to **Settings** → **Environment Variables**
2. Add the following variable:

\`\`\`
Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://yourdomain.com (replace with your actual domain)
Environment: Production, Preview, Development
\`\`\`

**Important:** Make sure to add it to all three environments (Production, Preview, Development).

### Step 4: Update Supabase Redirect URLs

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Add your custom domain to **Redirect URLs**:
   \`\`\`
   https://yourdomain.com/auth/callback
   https://yourdomain.com/*
   \`\`\`
5. Update **Site URL** to: `https://yourdomain.com`

### Step 5: Update Stripe Settings (if using payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Settings** → **Branding**
3. Update your website URL to your custom domain
4. Go to **Settings** → **Checkout settings**
5. Update redirect URLs to use your custom domain

### Step 6: Verify SSL Certificate

Vercel automatically provisions SSL certificates. After DNS propagation:

1. Visit `https://yourdomain.com`
2. Check for the padlock icon in your browser
3. Click the padlock to verify the certificate is valid
4. Certificate should show: "Issued by: Let's Encrypt" or "Vercel"

**Note:** SSL provisioning typically takes 1-5 minutes after DNS propagation.

### Step 7: Test Everything

Run through this checklist:

- [ ] Main domain loads: `https://yourdomain.com`
- [ ] WWW redirects properly: `www.yourdomain.com` → `yourdomain.com`
- [ ] HTTP redirects to HTTPS: `http://yourdomain.com` → `https://yourdomain.com`
- [ ] SSL certificate is valid (padlock icon shows)
- [ ] Sign up/Login works (Supabase auth redirects)
- [ ] All pages load correctly
- [ ] Images load from Unsplash
- [ ] API routes work
- [ ] Stripe checkout works (if applicable)

## Current Configuration

Your codebase uses `NEXT_PUBLIC_SITE_URL` in these locations:

- **API Routes:** `/api/scrape-luxury-properties/route.ts`, `/api/cron/scrape-luxury-properties/route.ts`
- **Stripe Integration:** `lib/stripe.ts`
- **Auth Redirects:** `app/auth/sign-up/page.tsx`
- **Image Processing:** `lib/image-standardization.ts`

All these will automatically use your custom domain once the environment variable is set.

## DNS Propagation Timeline

- **Immediate:** Changes saved at registrar
- **5-30 minutes:** Most DNS servers updated
- **24-48 hours:** Full global propagation
- **Check status:** Use [DNS Checker](https://dnschecker.org)

## Troubleshooting

### Domain not connecting
- **Wait 24-48 hours** for DNS propagation
- Verify DNS records are correct (no typos)
- Check [DNS Checker](https://dnschecker.org) for propagation status
- Clear your browser cache and try incognito mode

### SSL Certificate Issues
- Wait 5-10 minutes after DNS propagation
- Vercel auto-provisions certificates
- If still failing after 1 hour, contact Vercel support
- Check Vercel Dashboard → Domains for certificate status

### Auth Redirects Failing
- Verify `NEXT_PUBLIC_SITE_URL` is set in Vercel
- Check Supabase redirect URLs include your domain
- Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set for development

### Images Not Loading
- Check `next.config.mjs` has correct image domains
- Verify Unsplash API key is set (if using dynamic images)
- Check browser console for CORS errors

### Stripe Checkout Issues
- Update Stripe dashboard with new domain
- Verify `NEXT_PUBLIC_SITE_URL` is set
- Check webhook URLs in Stripe dashboard

## Email Configuration (Optional)

If you want to use email addresses with your domain:

### Professional Email Options:

1. **Google Workspace** (Recommended)
   - Cost: $6/user/month
   - Setup: [Google Workspace](https://workspace.google.com)
   - Add MX records provided by Google

2. **Microsoft 365**
   - Cost: $6/user/month
   - Setup: [Microsoft 365](https://www.microsoft.com/microsoft-365)

3. **Cloudflare Email Routing** (Free)
   - Cost: Free
   - Setup: [Cloudflare Email Routing](https://www.cloudflare.com/products/email-routing/)
   - Forward emails to your personal email

4. **Zoho Mail** (Free tier available)
   - Cost: Free for 5 users
   - Setup: [Zoho Mail](https://www.zoho.com/mail/)

### Suggested Email Addresses:
- `hello@yourdomain.com` - General inquiries
- `concierge@yourdomain.com` - Guest services
- `support@yourdomain.com` - Customer support
- `info@yourdomain.com` - General information
- `affiliates@yourdomain.com` - Partnership inquiries

## Support Resources

- **Vercel Support:** [vercel.com/help](https://vercel.com/help)
- **Vercel Docs:** [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **DNS Checker:** [dnschecker.org](https://dnschecker.org)
- **SSL Checker:** [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

## Quick Reference

### Vercel DNS Records
\`\`\`
A Record:     @ → 76.76.21.21
CNAME Record: www → cname.vercel-dns.com
\`\`\`

### Environment Variable
\`\`\`
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
\`\`\`

### Supabase Redirect URLs
\`\`\`
https://yourdomain.com/auth/callback
https://yourdomain.com/*
\`\`\`

---

**Need Help?** If you encounter any issues, check the Troubleshooting section above or contact Vercel support at [vercel.com/help](https://vercel.com/help).
