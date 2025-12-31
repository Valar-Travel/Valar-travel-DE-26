# Custom Domain Setup for valartravel.de

## Current Status
✅ Nameservers already pointing to Vercel:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

## Step-by-Step Setup

### 1. Add Domain in Vercel (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **valartravel** or **Valar Travel -Deals and Discounts**
3. Click **Settings** → **Domains**
4. In the "Add Domain" field, enter: `valartravel.de`
5. Click **Add**
6. Vercel will automatically configure DNS (since it controls your nameservers)
7. Wait for SSL certificate to be issued (usually 1-2 minutes)

**Optional:** Add www subdomain
- Repeat steps 4-5 with `www.valartravel.de`
- Vercel will automatically redirect www → non-www (or vice versa based on your preference)

### 2. Update Environment Variables in Vercel (2 minutes)

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Find or add `NEXT_PUBLIC_SITE_URL`
3. Set value to: `https://valartravel.de`
4. Apply to: **Production, Preview, and Development**
5. Click **Save**

### 3. Update Supabase Configuration (3 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   - `https://valartravel.de/auth/callback`
   - `https://valartravel.de/auth/sign-up-success`
   - `https://www.valartravel.de/auth/callback` (if using www)
5. Under **Site URL**, set: `https://valartravel.de`
6. Click **Save**

### 4. Update Stripe Configuration (2 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Settings** → **Branding**
3. Update your website URL to: `https://valartravel.de`
4. Go to **Developers** → **Webhooks**
5. Update webhook endpoints to use new domain if you have any configured

### 5. Redeploy Your Application (1 minute)

1. In Vercel Dashboard, go to **Deployments**
2. Click the three dots on the latest deployment
3. Select **Redeploy**
4. Wait for deployment to complete

### 6. Verify Everything Works

Test these URLs after deployment:
- ✅ Homepage: https://valartravel.de
- ✅ Authentication: https://valartravel.de/auth/login
- ✅ Sign up: https://valartravel.de/auth/sign-up
- ✅ Dashboard: https://valartravel.de/dashboard
- ✅ Villas: https://valartravel.de/villas
- ✅ Destinations: https://valartravel.de/destinations/barbados

## Environment Variables Reference

Your codebase uses these environment variables for domain configuration:

\`\`\`bash
# Primary site URL (update this to your custom domain)
NEXT_PUBLIC_SITE_URL=https://valartravel.de

# Supabase redirect URL for development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Vercel automatically sets these (no action needed)
NEXT_PUBLIC_VERCEL_URL=auto-set-by-vercel
VERCEL_URL=auto-set-by-vercel
\`\`\`

## How Your Code Handles Domains

Your application is already configured to use environment variables for all domain references:

1. **Stripe redirects** (`lib/stripe.ts`):
   - Uses `NEXT_PUBLIC_SITE_URL` for success/cancel URLs
   - Falls back to `NEXT_PUBLIC_VERCEL_URL` in preview deployments
   - Falls back to `localhost:3000` in development

2. **Supabase auth** (`app/auth/sign-up/page.tsx`):
   - Uses `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` for development
   - Uses `window.location.origin` for production (automatically uses your domain)

3. **Image proxy** (`lib/image-standardization.ts`):
   - Uses `window.location.origin` to construct proxy URLs
   - Automatically adapts to your domain

## Troubleshooting

### Domain not working after adding
- Wait 5-10 minutes for DNS propagation
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check Vercel domain status in Settings → Domains

### SSL certificate issues
- Vercel automatically issues SSL certificates
- If it fails, remove and re-add the domain
- Ensure nameservers are still pointing to Vercel

### Authentication redirects failing
- Double-check Supabase redirect URLs include your new domain
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in Vercel
- Redeploy after changing environment variables

### Stripe checkout not working
- Verify webhook URLs use new domain
- Update success/cancel URLs in Stripe dashboard
- Check `NEXT_PUBLIC_SITE_URL` environment variable

## Next Steps After Domain Setup

1. **Update Google Search Console**
   - Add new domain property
   - Submit sitemap: `https://valartravel.de/sitemap.xml`

2. **Update Social Media Links**
   - Update website URL on Facebook, Instagram, Twitter
   - Update Open Graph tags if needed

3. **Set up Email**
   - Configure email forwarding for your domain
   - Set up professional email addresses (info@valartravel.de)

4. **Monitor Analytics**
   - Update Google Analytics property
   - Verify tracking works on new domain

## Support

If you encounter any issues:
- Check Vercel deployment logs
- Review Supabase auth logs
- Contact Vercel support at vercel.com/help
\`\`\`

\`\`\`markdown file="" isHidden
