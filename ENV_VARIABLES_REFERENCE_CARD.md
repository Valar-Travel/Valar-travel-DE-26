# Environment Variables Reference Card
## valartravel.de Configuration

---

## 🔴 CRITICAL - Required for Domain to Work

### 1. NEXT_PUBLIC_SITE_URL
\`\`\`
Name: NEXT_PUBLIC_SITE_URL
Value: https://valartravel.de
Environments: ✓ Production  ✓ Preview  ✓ Development
\`\`\`

### 2. NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
\`\`\`
Name: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
Value: http://localhost:3000/auth/callback
Environments: ✓ Development (only)
\`\`\`

---

## 🟡 OPTIONAL - For Dynamic Image Fetching

### 3. UNSPLASH_ACCESS_KEY
\`\`\`
Name: UNSPLASH_ACCESS_KEY
Value: [Get from https://unsplash.com/developers]
Environments: ✓ Production  ✓ Preview  ✓ Development
\`\`\`

**How to get Unsplash Access Key:**
1. Go to https://unsplash.com/developers
2. Sign up or log in
3. Click "New Application"
4. Accept terms and create app
5. Copy the "Access Key" from your app dashboard

---

## 📋 Quick Setup Checklist

### In Vercel Dashboard:

1. **Navigate to Environment Variables**
   - Go to: https://vercel.com/sarahkuhmichel5-8053s-projects/v0-valar-travel-de
   - Click: Settings → Environment Variables

2. **Add Variable #1: NEXT_PUBLIC_SITE_URL**
   - Click "Add New"
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://valartravel.de`
   - Select: Production, Preview, Development
   - Click "Save"

3. **Add Variable #2: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL**
   - Click "Add New"
   - Name: `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
   - Value: `http://localhost:3000/auth/callback`
   - Select: Development only
   - Click "Save"

4. **Add Variable #3: UNSPLASH_ACCESS_KEY** (Optional)
   - Click "Add New"
   - Name: `UNSPLASH_ACCESS_KEY`
   - Value: [Your Unsplash Access Key]
   - Select: Production, Preview, Development
   - Click "Save"

5. **Redeploy**
   - Go to: Deployments tab
   - Click three dots (...) on latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete

6. **Verify Setup**
   - Visit: https://valartravel.de/api/verify-setup
   - All checks should show ✓

---

## 🔍 Verification Expected Output

After completing setup, you should see:

\`\`\`json
{
  "checks": {
    "siteUrl": {
      "configured": true,
      "value": "https://valartravel.de",
      "status": "✓"
    },
    "supabase": {
      "url": { "configured": true, "status": "✓" },
      "anonKey": { "configured": true, "status": "✓" },
      "redirectUrl": { "configured": true, "status": "✓" }
    },
    "stripe": {
      "publishableKey": { "configured": true, "status": "✓" },
      "secretKey": { "configured": true, "status": "✓" }
    },
    "unsplash": {
      "accessKey": { "configured": true, "status": "✓" }
    }
  },
  "summary": {
    "allCriticalConfigured": true,
    "domainReady": true
  }
}
\`\`\`

---

## 🆘 Troubleshooting

**If verification still shows NOT SET after redeployment:**
1. Double-check variable names (they're case-sensitive)
2. Ensure you selected the correct environments
3. Wait 2-3 minutes after redeployment
4. Hard refresh the verification page (Cmd+Shift+R or Ctrl+Shift+R)

**If Supabase auth doesn't work:**
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Add to Redirect URLs: `https://valartravel.de/auth/callback`
4. Save changes

---

## 📞 Support

If you encounter issues:
- Check Vercel deployment logs for errors
- Verify all environment variables are saved
- Ensure domain DNS is fully propagated
- Visit verification endpoint for detailed status

---

**Last Updated:** November 6, 2025
**Domain:** valartravel.de
**Project:** v0-valar-travel-de
