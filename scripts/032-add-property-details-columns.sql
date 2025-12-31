-- Add missing columns for property details (bedrooms, bathrooms, max_guests)
-- Run this script to add the columns to the existing scraped_luxury_properties table

ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
ADD COLUMN IF NOT EXISTS bathrooms INTEGER,
ADD COLUMN IF NOT EXISTS max_guests INTEGER,
ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'Villa';

-- Add comment for documentation
COMMENT ON COLUMN scraped_luxury_properties.bedrooms IS 'Number of bedrooms in the property';
COMMENT ON COLUMN scraped_luxury_properties.bathrooms IS 'Number of bathrooms in the property';
COMMENT ON COLUMN scraped_luxury_properties.max_guests IS 'Maximum number of guests allowed';
COMMENT ON COLUMN scraped_luxury_properties.property_type IS 'Type of property (Villa, House, Apartment, etc.)';
