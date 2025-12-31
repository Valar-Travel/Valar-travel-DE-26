# Database Scripts

## Important Notes

### SSL Connection Required

All scripts now use a centralized database connection utility that automatically adds SSL mode to database connections. You should no longer see "SSL connection is required" errors.

### Script Execution in v0

v0 may prompt you to run scripts when it detects:
- New migration scripts that haven't been executed
- Database schema updates needed
- Initial setup scripts for new integrations

**This is normal behavior** and only happens when scripts are added or modified. Once executed, you won't be prompted again unless the script changes.

### Preventing Repeated Script Prompts

If you're being asked to run the same script repeatedly:
1. The script completed successfully - v0 is just being cautious
2. Clear your browser cache and reload
3. The script might have a check that's always returning false

### Scripts That Should Only Run Once

- `000-master-setup-all-tables.ts` - Initial database setup
- `015-create-scraped-properties-schema.ts` - Property schema creation
- `016-seed-caribbean-cities-only.ts` - Initial city data
- `017-seed-caribbean-deals-only.ts` - Initial deals data
- `018-seed-caribbean-reviews-only.ts` - Initial review data

Once these complete successfully, you can safely ignore prompts to run them again.

### Scripts You Can Run Anytime

- `999-verify-and-run-scraper.ts` - Run the property scraper
- `cleanup-now.ts` - Clean up database records
- `run-caribbean-scraper.ts` - Scrape new properties

## Troubleshooting

If you encounter SSL errors despite these updates, check that your `POSTGRES_URL` environment variable is properly set in your Vercel project settings.
