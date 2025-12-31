# Caribbean Villa Scraper Setup Guide

## Pre-Deployment Checklist

### 1. Push to VS Code/GitHub
- Click the GitHub icon in the top-right of v0
- Commit all changes with message: "Setup Caribbean villa scraper"
- Push to your repository

### 2. Verify Database Tables

Before running the scraper, ensure these tables exist:
- `scraped_properties` - Stores scraped villa data
- `cities` - Caribbean destination cities
- `deals` - Travel deals
- `reviews` - Location reviews

**Check Status:** Visit `/api/check-scraper-ready` after deployment

### 3. Run Database Setup (if needed)

If tables are missing, run this script:
- `scripts/000-master-setup-all-tables.ts`

### 4. Run the Scraper

**Option A: Via API Endpoint**
Visit: `/api/run-scraper`

**Option B: Via Script**
Run: `scripts/run-caribbean-scraper.ts`

### 5. Verify Results

Check the scraped data:
\`\`\`sql
SELECT COUNT(*) FROM scraped_properties;
SELECT * FROM scraped_properties LIMIT 5;
\`\`\`

## Scraper Features

- Scrapes Barbados villas from sunnyvillaholidays.com
- Extracts: property name, URL, basic details
- Stores in `scraped_properties` table
- Prevents duplicates via `source_url` unique constraint
- Marks properties as unpublished (requires admin review)

## Troubleshooting

### SSL Connection Error
Use TypeScript scripts (`.ts`) instead of SQL (`.sql`) files

### Missing Tables
Run `000-master-setup-all-tables.ts` script first

### No Data Scraped
Check console logs in `/api/run-scraper` response
