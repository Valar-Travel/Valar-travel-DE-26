-- Add missing property detail columns to scraped_luxury_properties
-- These columns store bedroom, bathroom, and guest capacity data

-- Add bedrooms column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scraped_luxury_properties' AND column_name = 'bedrooms') 
  THEN
    ALTER TABLE public.scraped_luxury_properties ADD COLUMN bedrooms INTEGER;
  END IF;
END $$;

-- Add bathrooms column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scraped_luxury_properties' AND column_name = 'bathrooms') 
  THEN
    ALTER TABLE public.scraped_luxury_properties ADD COLUMN bathrooms INTEGER;
  END IF;
END $$;

-- Add max_guests column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scraped_luxury_properties' AND column_name = 'max_guests') 
  THEN
    ALTER TABLE public.scraped_luxury_properties ADD COLUMN max_guests INTEGER;
  END IF;
END $$;

-- Add is_published column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'scraped_luxury_properties' AND column_name = 'is_published') 
  THEN
    ALTER TABLE public.scraped_luxury_properties ADD COLUMN is_published BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update existing properties: try to extract bedroom/bathroom data from description or set defaults
-- This is a one-time data migration

-- Set default values for properties that don't have these fields
UPDATE public.scraped_luxury_properties
SET 
  bedrooms = COALESCE(bedrooms, 3),
  bathrooms = COALESCE(bathrooms, 2),
  max_guests = COALESCE(max_guests, bedrooms * 2, 6),
  is_published = COALESCE(is_published, true)
WHERE bedrooms IS NULL OR bathrooms IS NULL OR max_guests IS NULL OR is_published IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scraped_properties_bedrooms ON public.scraped_luxury_properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_is_published ON public.scraped_luxury_properties(is_published);
