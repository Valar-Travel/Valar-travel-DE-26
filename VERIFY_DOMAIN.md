# Verify Domain Setup

## Quick Verification

Once you've added your domain in Vercel, you can verify the setup by visiting:

**Production:** `https://valartravel.de/api/verify-setup`

**Preview:** `https://your-preview-url.vercel.app/api/verify-setup`

This will show you a JSON response with all your configuration checks.

## What to Look For

The response will show:

\`\`\`json
{
  "checks": {
    "siteUrl": {
      "status": "✓",  // Should be checkmark
      "value": "https://valartravel.de"
    },
    "supabase": {
      "url": { "status": "✓" },
      "anonKey": { "status": "✓" }
    }
  },
  "summary": {
    "domainReady": true  // Should be true
  }
}
\`\`\`

## Steps to Complete Domain Setup

### 1. Add Domain in Vercel
- Go to your Vercel project
- Settings → Domains
- Add `valartravel.de`
- Vercel will automatically configure DNS (since your nameservers are already pointing to Vercel)

### 2. Update Environment Variable
- Settings → Environment Variables
- Find `NEXT_PUBLIC_SITE_URL`
- Change from `https://valartravel.vercel.app` to `https://valartravel.de`
- Click Save
- **Important:** Redeploy your project after saving

### 3. Update Supabase Redirect URLs
- Go to Supabase Dashboard
- Authentication → URL Configuration
- Add to Redirect URLs:
  - `https://valartravel.de/auth/callback`
  - `https://www.valartravel.de/auth/callback` (if using www)
- Save changes

### 4. Update Stripe (if using checkout)
- Go to Stripe Dashboard
- Settings → Branding
- Update your website URL to `https://valartravel.de`

### 5. Verify Setup
- Visit `https://valartravel.de/api/verify-setup`
- Check that `domainReady: true`
- Test authentication flow
- Test any payment flows

## Troubleshooting

### Domain not resolving
- Wait 5-10 minutes for DNS propagation
- Check that nameservers are still pointing to Vercel
- Verify domain is added in Vercel dashboard

### Authentication not working
- Check Supabase redirect URLs include your new domain
- Verify `NEXT_PUBLIC_SITE_URL` is updated
- Clear browser cache and cookies

### SSL Certificate issues
- Vercel automatically provisions SSL certificates
- This can take 5-10 minutes after adding domain
- Check domain status in Vercel dashboard

## Need Help?

If you see any `✗` marks in the verification response, that indicates a missing or incorrect configuration that needs to be fixed.
