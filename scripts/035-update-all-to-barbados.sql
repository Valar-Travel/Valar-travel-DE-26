-- Update ALL properties in the database to have location "Barbados"
-- This will ensure all 292+ scraped properties appear on the Barbados destination page

UPDATE scraped_luxury_properties
SET 
  location = 'Barbados',
  updated_at = NOW();
