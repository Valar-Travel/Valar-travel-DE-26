-- Check current column type
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'scraped_luxury_properties' 
AND column_name = 'images';

-- If images column is integer or not jsonb/text[], we need to fix it
-- First, rename the old column
ALTER TABLE scraped_luxury_properties 
RENAME COLUMN images TO images_old;

-- Create new column as jsonb array
ALTER TABLE scraped_luxury_properties 
ADD COLUMN images jsonb DEFAULT '[]'::jsonb;

-- Drop the old column (it had wrong data anyway)
ALTER TABLE scraped_luxury_properties 
DROP COLUMN images_old;

-- Verify the fix
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'scraped_luxury_properties' 
AND column_name = 'images';
