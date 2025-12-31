# Barbados Villa CSV Import Instructions

## Overview
This guide explains how to import the 100+ luxury villas from the Worldwide Dream Villas CSV into your Supabase database and generate individual property pages.

## Step 1: Run the Import Script

The script `scripts/import-barbados-villas-from-csv.ts` will:
- Parse the CSV data containing all Barbados luxury villas
- Extract property details (name, location, bedrooms, bathrooms, price)
- Generate slugs for URL-friendly paths
- Insert properties into the `scraped_luxury_properties` table
- Set properties to unpublished status for admin review

**To run the script:**

Click the "Run" button next to `scripts/import-barbados-villas-from-csv.ts` in v0.

## Step 2: Review Properties in Admin

After import, all properties are set to `published: false` for review:

1. Visit `/admin/properties` in your app
2. Review each property
3. Edit details if needed
4. Mark as published to make live

## Step 3: Access Property Pages

Once published, each villa will be accessible at:

\`\`\`
/villas/barbados/[slug]
\`\`\`

Examples:
- `/villas/barbados/beachfront-gardenia-private-estate`
- `/villas/barbados/beachfront-godings-beach-house`
- `/villas/barbados/beachfront-mirador`

## Database Schema

Properties are stored in `scraped_luxury_properties` table with:
- `name`: Villa title
- `slug`: URL-friendly identifier
- `description`: Auto-generated description
- `location`: Full location string from CSV
- `region`: Extracted region (St James, St Peter, etc.)
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms (decimal support for half-baths)
- `max_guests`: Calculated as bedrooms × 2
- `price_per_night`: Extracted minimum price in USD
- `images`: Array of image URLs
- `amenities`: Standard Caribbean villa amenities
- `source_url`: Original listing URL
- `source_site`: "Worldwide Dream Villas"
- `published`: Boolean flag for visibility
- `active`: Boolean flag for availability

## Next Steps

1. **Run the import script** to add all 100+ villas
2. **Review in admin** to ensure quality
3. **Publish properties** to make them live
4. **Test property pages** to ensure correct display
5. **Update Barbados destination page** to feature new villas

All property pages include:
- Image gallery
- Full amenity list
- Pricing calculator
- Booking contact forms
- Links to original listings
- Similar properties section
