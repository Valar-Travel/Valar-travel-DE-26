-- Migration: Add columns and tables to support LuxuryPropertyCard features
-- Features: Review snippets, Luxury badges, Savings indicators, Map functionality, Favorites, Luxury score

-- ============================================
-- 1. ADD MISSING COLUMNS TO scraped_luxury_properties
-- ============================================

-- Add original_price for savings indicators
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2);

COMMENT ON COLUMN scraped_luxury_properties.original_price IS 'Original price before discount, used for savings indicator';

-- Add coordinates for map functionality
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8);

COMMENT ON COLUMN scraped_luxury_properties.latitude IS 'Property latitude coordinate for map display';
COMMENT ON COLUMN scraped_luxury_properties.longitude IS 'Property longitude coordinate for map display';

-- Add badges array for luxury badges display
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';

COMMENT ON COLUMN scraped_luxury_properties.badges IS 'Array of badge labels (e.g., Beachfront, Award Winner, New Listing)';

-- Add luxury_score for luxury ranking
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS luxury_score INTEGER CHECK (luxury_score >= 0 AND luxury_score <= 100);

COMMENT ON COLUMN scraped_luxury_properties.luxury_score IS 'Luxury score from 0-100 based on amenities, reviews, and features';

-- Add star_rating for hotel-style ratings
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5);

COMMENT ON COLUMN scraped_luxury_properties.star_rating IS 'Property star rating (1-5 stars)';

-- Add review_snippet for highlighted review text
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS review_snippet TEXT;

COMMENT ON COLUMN scraped_luxury_properties.review_snippet IS 'Featured review snippet to display on property card';

-- Add review_count for displaying total reviews
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

COMMENT ON COLUMN scraped_luxury_properties.review_count IS 'Total number of reviews for this property';

-- Add is_luxury flag for filtering
ALTER TABLE scraped_luxury_properties 
ADD COLUMN IF NOT EXISTS is_luxury BOOLEAN DEFAULT true;

COMMENT ON COLUMN scraped_luxury_properties.is_luxury IS 'Flag indicating if property is classified as luxury';

-- ============================================
-- 2. CREATE USER_FAVORITES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES scraped_luxury_properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only favorite a property once
  UNIQUE(user_id, property_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_favorites
-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" 
  ON user_favorites FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only add their own favorites
CREATE POLICY "Users can add their own favorites" 
  ON user_favorites FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
  ON user_favorites FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- 3. CREATE INDEXES FOR NEW COLUMNS
-- ============================================

CREATE INDEX IF NOT EXISTS idx_scraped_properties_luxury_score ON scraped_luxury_properties(luxury_score DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_star_rating ON scraped_luxury_properties(star_rating DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_is_luxury ON scraped_luxury_properties(is_luxury);
CREATE INDEX IF NOT EXISTS idx_scraped_properties_coordinates ON scraped_luxury_properties(latitude, longitude);

-- ============================================
-- 4. UPDATE EXISTING PROPERTIES WITH DEFAULT VALUES
-- ============================================

-- Set default values for new columns where data is missing
UPDATE scraped_luxury_properties
SET 
  -- Calculate luxury_score based on rating (scale 4.2-5.0 to 70-100)
  luxury_score = COALESCE(luxury_score, LEAST(100, GREATEST(70, ROUND((rating - 4.0) * 60 + 70)::INTEGER))),
  
  -- Default star rating based on rating (4.5+ = 5 stars, 4.2-4.5 = 4 stars)
  star_rating = COALESCE(star_rating, 
    CASE 
      WHEN rating >= 4.8 THEN 5
      WHEN rating >= 4.5 THEN 5
      WHEN rating >= 4.2 THEN 4
      ELSE 4
    END),
  
  -- Default is_luxury to true for existing properties
  is_luxury = COALESCE(is_luxury, true),
  
  -- Set review_count to 0 if null
  review_count = COALESCE(review_count, 0)
WHERE luxury_score IS NULL OR star_rating IS NULL OR is_luxury IS NULL;

-- ============================================
-- 5. CREATE FUNCTION TO UPDATE REVIEW COUNT
-- ============================================

CREATE OR REPLACE FUNCTION update_property_review_count()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update review count on the property
  IF TG_OP = 'INSERT' THEN
    UPDATE scraped_luxury_properties 
    SET review_count = (
      SELECT COUNT(*) FROM property_reviews WHERE property_id = NEW.property_id
    )
    WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE scraped_luxury_properties 
    SET review_count = (
      SELECT COUNT(*) FROM property_reviews WHERE property_id = OLD.property_id
    )
    WHERE id = OLD.property_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update review count
DROP TRIGGER IF EXISTS trigger_update_review_count ON property_reviews;
CREATE TRIGGER trigger_update_review_count
  AFTER INSERT OR DELETE ON property_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_review_count();

-- ============================================
-- 6. CREATE FUNCTION TO AUTO-SET REVIEW SNIPPET
-- ============================================

CREATE OR REPLACE FUNCTION update_property_review_snippet()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  best_review TEXT;
BEGIN
  -- Get the best review (highest rating, most recent) for this property
  SELECT review_text INTO best_review
  FROM property_reviews
  WHERE property_id = NEW.property_id 
    AND rating >= 4
    AND review_text IS NOT NULL 
    AND LENGTH(review_text) > 20
  ORDER BY rating DESC, review_date DESC
  LIMIT 1;
  
  -- Update the property's review snippet if we found a good review
  IF best_review IS NOT NULL THEN
    UPDATE scraped_luxury_properties 
    SET review_snippet = LEFT(best_review, 200)
    WHERE id = NEW.property_id 
      AND (review_snippet IS NULL OR LENGTH(review_snippet) < LENGTH(best_review));
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update review snippet
DROP TRIGGER IF EXISTS trigger_update_review_snippet ON property_reviews;
CREATE TRIGGER trigger_update_review_snippet
  AFTER INSERT ON property_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_property_review_snippet();

-- ============================================
-- 7. SYNC REVIEW COUNTS AND SNIPPETS FOR EXISTING DATA
-- ============================================

-- Update review counts for all properties
UPDATE scraped_luxury_properties p
SET review_count = (
  SELECT COUNT(*) FROM property_reviews WHERE property_id = p.id
);

-- Update review snippets for all properties that don't have one
UPDATE scraped_luxury_properties p
SET review_snippet = subq.best_snippet
FROM (
  SELECT DISTINCT ON (property_id) 
    property_id,
    LEFT(review_text, 200) as best_snippet
  FROM property_reviews
  WHERE rating >= 4 
    AND review_text IS NOT NULL 
    AND LENGTH(review_text) > 20
  ORDER BY property_id, rating DESC, review_date DESC
) subq
WHERE p.id = subq.property_id AND p.review_snippet IS NULL;
