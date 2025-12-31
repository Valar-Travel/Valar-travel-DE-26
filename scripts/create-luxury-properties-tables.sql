-- Create tables for storing scraped luxury properties data
-- This uses the existing PostgreSQL database through Supabase

-- Table for storing scraped luxury properties
CREATE TABLE IF NOT EXISTS scraped_luxury_properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating DECIMAL(3,2) NOT NULL CHECK (rating >= 4.2), -- Only properties with 4.2+ rating
  price_per_night DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  description TEXT,
  amenities TEXT[], -- Array of amenities
  images TEXT[], -- Array of image URLs
  affiliate_links JSONB, -- Store booking platform links
  source_url TEXT, -- Original listing URL
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing property reviews
CREATE TABLE IF NOT EXISTS property_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES scraped_luxury_properties(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_date DATE,
  source TEXT, -- Platform where review was found
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for tracking scraping sessions
CREATE TABLE IF NOT EXISTS scraping_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_type TEXT NOT NULL, -- 'luxury_properties', 'reviews', etc.
  properties_found INTEGER DEFAULT 0,
  properties_saved INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed'
  error_details JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_luxury_properties_rating ON scraped_luxury_properties(rating DESC);
CREATE INDEX IF NOT EXISTS idx_luxury_properties_location ON scraped_luxury_properties(location);
CREATE INDEX IF NOT EXISTS idx_luxury_properties_scraped_at ON scraped_luxury_properties(scraped_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_scraping_sessions_status ON scraping_sessions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE scraped_luxury_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all operations for now, can be restricted later)
CREATE POLICY "Allow all operations on scraped_luxury_properties" ON scraped_luxury_properties FOR ALL USING (true);
CREATE POLICY "Allow all operations on property_reviews" ON property_reviews FOR ALL USING (true);
CREATE POLICY "Allow all operations on scraping_sessions" ON scraping_sessions FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_scraped_luxury_properties_updated_at 
    BEFORE UPDATE ON scraped_luxury_properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
