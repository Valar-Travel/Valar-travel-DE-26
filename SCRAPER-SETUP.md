# Property Scraper Setup Guide

## Overview

The Valar Travel property scraper imports luxury villa listings from external sources into the Supabase database.

## How It Works

1. **API Endpoint:** `/api/scrape` accepts a URL and destination
2. **Parser:** Uses Cheerio to extract property data
3. **Storage:** Saves to `scraped_luxury_properties` table
4. **Review:** Properties are unpublished by default for admin review

## Running the Scraper

### Via Admin Dashboard

1. Log in to `/admin`
2. Navigate to Properties section
3. Use the "Import Properties" feature
4. Enter the source URL and destination

### Via API

```bash
POST /api/scrape
Content-Type: application/json

{
  "url": "https://source-website.com/villas",
  "destination": "Barbados",
  "maxProperties": 50
}
```

## Supported Sources

The scraper is optimized for:
- sunnyvillaholidays.com
- Similar villa listing websites

## Data Extracted

For each property:
- **Name** - Villa title
- **Location** - Full address/region
- **Description** - Property description
- **Bedrooms/Bathrooms** - Room counts
- **Max Guests** - Capacity
- **Price** - Nightly rate
- **Images** - Photo gallery URLs
- **Amenities** - Feature list
- **Source URL** - Original listing

## Post-Import Steps

1. **Review in Admin:** Check imported properties at `/admin`
2. **Edit Details:** Update any incorrect information
3. **Add Images:** Supplement with additional photos if needed
4. **Publish:** Mark properties as published to make live

## Database Table

Properties are stored in `scraped_luxury_properties`:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Villa name |
| slug | TEXT | URL-friendly identifier |
| location | TEXT | Location string |
| description | TEXT | Full description |
| bedrooms | INTEGER | Number of bedrooms |
| bathrooms | DECIMAL | Number of bathrooms |
| max_guests | INTEGER | Maximum capacity |
| price_per_night | DECIMAL | Nightly rate |
| images | TEXT[] | Array of image URLs |
| amenities | TEXT[] | Array of amenities |
| source_url | TEXT | Original listing URL |
| published | BOOLEAN | Visibility flag |
| created_at | TIMESTAMP | Import date |

## Troubleshooting

### No Properties Found

- Check the source URL is accessible
- Verify the website structure hasn't changed
- Check server logs for parsing errors

### Duplicate Properties

- Properties are matched by `source_url`
- Existing properties are updated, not duplicated

### Images Not Loading

- External images use `unoptimized` flag
- Check image URLs are valid and accessible

---

**Last Updated:** March 2026
