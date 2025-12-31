-- Update ALL properties to be labeled as Barbados
-- All scraped villas so far are Barbados properties

-- Fixed table name to scraped_luxury_properties
UPDATE scraped_luxury_properties
SET 
  location = 'Barbados',
  updated_at = NOW()
WHERE location IS NULL OR location != 'Barbados';

-- Also update any that say Caribbean, Anguilla, or other locations
UPDATE scraped_luxury_properties
SET 
  location = 'Barbados',
  updated_at = NOW()
WHERE location IN ('Caribbean', 'Anguilla', 'Jamaica', 'St. Lucia', 'St. Barths', 'Turks and Caicos', 'Antigua', 'British Virgin Islands');

-- Verify the update
SELECT COUNT(*) as total_properties, location 
FROM scraped_luxury_properties 
GROUP BY location;
