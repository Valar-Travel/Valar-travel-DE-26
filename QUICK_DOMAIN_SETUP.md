# Quick Domain Setup Guide

Your domain **valartravel.de** is ready to be configured. Follow these steps in order:

## ✅ Pre-Setup Checklist

- [x] Nameservers pointing to Vercel (ns1.vercel-dns.com, ns2.vercel-dns.com)
- [ ] Domain added in Vercel Dashboard
- [ ] Environment variables updated
- [ ] Supabase redirect URLs configured
- [ ] Application redeployed

---

## 🚀 5-Minute Setup

### Step 1: Add Domain in Vercel (2 min)

1. Go to: https://vercel.com/dashboard
2. Select project: **valartravel**
3. Settings → Domains → Add `valartravel.de`
4. Wait for SSL certificate (auto-provisioned)

### Step 2: Update Environment Variable (1 min)

In Vercel Dashboard:
- Settings → Environment Variables
- Set `NEXT_PUBLIC_SITE_URL` = `https://valartravel.de`
- Apply to: Production, Preview, Development
- Save

### Step 3: Update Supabase (1 min)

In Supabase Dashboard:
- Authentication → URL Configuration
- Add redirect URLs:
  - `https://valartravel.de/auth/callback`
  - `https://valartravel.de/auth/sign-up-success`
- Set Site URL: `https://valartravel.de`
- Save

### Step 4: Redeploy (1 min)

In Vercel Dashboard:
- Deployments → Latest → Redeploy

---

## 🧪 Verify Setup

Run the verification script:

\`\`\`bash
npx tsx scripts/verify-domain-setup.ts
\`\`\`

Or manually test these URLs:
- https://valartravel.de (homepage)
- https://valartravel.de/auth/login (authentication)
- https://valartravel.de/villas (villas page)

---

## 📝 What Your Code Already Handles

Your application is already configured to work with custom domains:

✅ **Automatic domain detection** - Uses `NEXT_PUBLIC_SITE_URL` environment variable
✅ **Stripe redirects** - Automatically uses your domain for checkout success/cancel URLs
✅ **Supabase auth** - Uses `window.location.origin` for production redirects
✅ **Image proxy** - Adapts to your domain automatically
✅ **Development fallback** - Falls back to localhost:3000 in development

No code changes needed!

---

## 🆘 Troubleshooting

**Domain not working?**
- Wait 5-10 minutes for DNS propagation
- Clear browser cache (Cmd+Shift+R)

**SSL errors?**
- Vercel auto-provisions SSL (takes 1-2 minutes)
- If it fails, remove and re-add domain

**Auth redirects failing?**
- Double-check Supabase redirect URLs
- Ensure `NEXT_PUBLIC_SITE_URL` is set
- Redeploy after env var changes

---

## 📚 Full Documentation

For detailed information, see:
- `DOMAIN_SETUP_VALARTRAVEL.md` - Complete setup guide
- `DOMAIN_SETUP.md` - Original domain documentation

---

**Need help?** Contact Vercel support at vercel.com/help
