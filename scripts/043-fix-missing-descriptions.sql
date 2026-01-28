-- Script to check and update properties with missing descriptions
-- Run this in your Supabase SQL Editor

-- First, check how many properties have missing descriptions
SELECT 
  COUNT(*) as total_properties,
  COUNT(CASE WHEN description IS NULL OR description = '' THEN 1 END) as missing_descriptions,
  COUNT(CASE WHEN description IS NOT NULL AND description != '' THEN 1 END) as has_descriptions
FROM scraped_luxury_properties;

-- List all properties with missing descriptions
SELECT 
  id, 
  name, 
  location,
  bedrooms,
  bathrooms,
  price_per_night,
  LEFT(description, 50) as description_preview
FROM scraped_luxury_properties 
WHERE description IS NULL OR description = '' OR LENGTH(description) < 50
ORDER BY name;

-- Set a default description for properties that have none
-- This creates a placeholder that can be enhanced later
UPDATE scraped_luxury_properties
SET description = 
  CONCAT(
    'Welcome to ', name, ', a stunning luxury villa in ', location, '. ',
    'This exceptional property offers ', bedrooms, ' spacious bedrooms and ', bathrooms, ' beautifully appointed bathrooms. ',
    'Perfect for discerning travelers seeking an unforgettable Caribbean escape, this villa combines elegant design with world-class amenities. ',
    'Contact our concierge team to discover the full experience awaiting you at this remarkable property.'
  )
WHERE description IS NULL OR description = '';

-- Verify the update
SELECT 
  id, 
  name, 
  LEFT(description, 100) as description_preview
FROM scraped_luxury_properties 
WHERE name ILIKE '%Escapade%' OR location ILIKE '%St. Maarten%'
ORDER BY name;
