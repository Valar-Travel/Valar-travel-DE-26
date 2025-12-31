-- Update properties from sunnyvillaholidays.com to have Barbados location
UPDATE scraped_luxury_properties
SET location = 'Barbados'
WHERE source_url ILIKE '%sunnyvillaholidays.com%';

-- Update any other Barbados-related sources
UPDATE scraped_luxury_properties
SET location = 'Barbados'
WHERE source_url ILIKE '%villasbarbados.com%'
   OR source_url ILIKE '%barbadosdreamvillas.com%'
   OR source_url ILIKE '%barbadosluxury%';

-- Update Jamaica properties
UPDATE scraped_luxury_properties
SET location = 'Jamaica'
WHERE source_url ILIKE '%jamaicavillas%'
   OR source_url ILIKE '%villasjamaica%'
   OR source_url ILIKE '%jamaicaluxury%'
   OR source_url ILIKE '%tryallclub%'
   OR source_url ILIKE '%roundhilljamaica%';

-- Update St Lucia properties  
UPDATE scraped_luxury_properties
SET location = 'St. Lucia'
WHERE source_url ILIKE '%stlucia%'
   OR source_url ILIKE '%saintlucia%'
   OR source_url ILIKE '%jademountain%'
   OR source_url ILIKE '%ansechastanet%';

-- Update St Barthelemy properties
UPDATE scraped_luxury_properties
SET location = 'St. Barthelemy'
WHERE source_url ILIKE '%stbarth%'
   OR source_url ILIKE '%stbarts%'
   OR source_url ILIKE '%saintbarth%'
   OR source_url ILIKE '%sibarth%'
   OR source_url ILIKE '%wimco%';

-- Update Anguilla properties
UPDATE scraped_luxury_properties
SET location = 'Anguilla'
WHERE source_url ILIKE '%anguilla%'
   OR location ILIKE '%anguilla%';

-- Update Turks and Caicos properties
UPDATE scraped_luxury_properties
SET location = 'Turks and Caicos'
WHERE source_url ILIKE '%turksandcaicos%'
   OR source_url ILIKE '%turkscaicos%'
   OR source_url ILIKE '%providenciales%';

-- Update Antigua properties
UPDATE scraped_luxury_properties
SET location = 'Antigua'
WHERE source_url ILIKE '%antigua%';

-- Update British Virgin Islands properties
UPDATE scraped_luxury_properties
SET location = 'British Virgin Islands'
WHERE source_url ILIKE '%bvi%'
   OR source_url ILIKE '%virginislands%'
   OR source_url ILIKE '%tortola%';

-- Set any remaining unknown locations to Caribbean
UPDATE scraped_luxury_properties
SET location = 'Caribbean'
WHERE location IS NULL OR location = '';

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON scraped_luxury_properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_source_url ON scraped_luxury_properties(source_url);
CREATE INDEX IF NOT EXISTS idx_properties_price ON scraped_luxury_properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_rating ON scraped_luxury_properties(rating);
CREATE INDEX IF NOT EXISTS idx_properties_name ON scraped_luxury_properties(name);

-- Show updated counts by location
SELECT location, COUNT(*) as count
FROM scraped_luxury_properties
GROUP BY location
ORDER BY count DESC;
