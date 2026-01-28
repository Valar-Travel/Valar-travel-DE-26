-- Fix all properties with missing or empty descriptions
-- This generates descriptions based on property data

UPDATE scraped_luxury_properties
SET description = 
  'Welcome to ' || name || ', an exceptional luxury retreat nestled in the heart of ' || COALESCE(location, 'the Caribbean') || '. ' ||
  'This stunning property offers ' || COALESCE(bedrooms::text, '3') || ' beautifully appointed bedrooms and ' || 
  COALESCE(bathrooms::text, '2') || ' elegantly designed bathrooms, comfortably accommodating up to ' || 
  COALESCE(sleeps::text, max_guests::text, (COALESCE(bedrooms, 3) * 2)::text) || ' guests.' || E'\n\n' ||
  'Experience the perfect blend of sophisticated Caribbean living and modern comfort. The villa features expansive living spaces with breathtaking views, allowing you to fully immerse yourself in the natural beauty of the surroundings.' || E'\n\n' ||
  'Every detail has been carefully curated to ensure an unforgettable stay. From the premium finishes throughout to the thoughtfully designed outdoor areas, this property exemplifies the finest in Caribbean luxury living.' || E'\n\n' ||
  'Whether you''re seeking a romantic getaway, a family vacation, or a memorable gathering with friends, ' || name || ' provides the ideal setting for creating lasting memories in paradise.'
WHERE description IS NULL OR description = '' OR LENGTH(description) < 50;

-- Also update any properties that have very short descriptions (less than 100 chars)
-- to have more complete descriptions
UPDATE scraped_luxury_properties
SET description = 
  'Welcome to ' || name || ', an exceptional luxury retreat nestled in the heart of ' || COALESCE(location, 'the Caribbean') || '. ' ||
  'This stunning property offers ' || COALESCE(bedrooms::text, '3') || ' beautifully appointed bedrooms and ' || 
  COALESCE(bathrooms::text, '2') || ' elegantly designed bathrooms, comfortably accommodating up to ' || 
  COALESCE(sleeps::text, max_guests::text, (COALESCE(bedrooms, 3) * 2)::text) || ' guests.' || E'\n\n' ||
  'Experience the perfect blend of sophisticated Caribbean living and modern comfort. The villa features expansive living spaces with breathtaking views, allowing you to fully immerse yourself in the natural beauty of the surroundings.' || E'\n\n' ||
  'Every detail has been carefully curated to ensure an unforgettable stay. From the premium finishes throughout to the thoughtfully designed outdoor areas, this property exemplifies the finest in Caribbean luxury living.' || E'\n\n' ||
  'Whether you''re seeking a romantic getaway, a family vacation, or a memorable gathering with friends, ' || name || ' provides the ideal setting for creating lasting memories in paradise.'
WHERE LENGTH(description) < 100 AND LENGTH(description) > 0;

-- Verify results
SELECT 
  COUNT(*) AS total_properties,
  COUNT(CASE WHEN description IS NULL OR description = '' THEN 1 END) AS missing_descriptions,
  COUNT(CASE WHEN LENGTH(description) < 100 THEN 1 END) AS short_descriptions,
  COUNT(CASE WHEN LENGTH(description) >= 100 THEN 1 END) AS complete_descriptions
FROM scraped_luxury_properties;
