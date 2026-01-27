-- Property Prom Submissions Table
-- Stores villa submissions from owners for the Property Prom showcase

CREATE TABLE IF NOT EXISTS property_prom_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Owner Details
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  
  -- Property Details
  property_name TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'villa',
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  
  -- Property Features
  bedrooms INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,
  price_per_night DECIMAL(10, 2),
  
  -- Description
  description TEXT,
  amenities TEXT[],
  
  -- Images (stored as URLs)
  images TEXT[],
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_property_prom_status ON property_prom_submissions(status);
CREATE INDEX IF NOT EXISTS idx_property_prom_country ON property_prom_submissions(country);
CREATE INDEX IF NOT EXISTS idx_property_prom_user ON property_prom_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_property_prom_created ON property_prom_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE property_prom_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON property_prom_submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can create submissions" ON property_prom_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions" ON property_prom_submissions
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role full access" ON property_prom_submissions
  FOR ALL USING (auth.role() = 'service_role');

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_property_prom_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS property_prom_updated_at ON property_prom_submissions;
CREATE TRIGGER property_prom_updated_at
  BEFORE UPDATE ON property_prom_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_property_prom_timestamp();

-- Countries lookup table for Caribbean destinations
CREATE TABLE IF NOT EXISTS property_prom_countries (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT DEFAULT 'Caribbean'
);

INSERT INTO property_prom_countries (code, name, region) VALUES
  ('BB', 'Barbados', 'Caribbean'),
  ('LC', 'St. Lucia', 'Caribbean'),
  ('TC', 'Turks & Caicos', 'Caribbean'),
  ('JM', 'Jamaica', 'Caribbean'),
  ('BL', 'St. Barthélemy', 'Caribbean'),
  ('AG', 'Antigua & Barbuda', 'Caribbean'),
  ('GD', 'Grenada', 'Caribbean'),
  ('KN', 'St. Kitts & Nevis', 'Caribbean'),
  ('VC', 'St. Vincent & Grenadines', 'Caribbean'),
  ('DM', 'Dominica', 'Caribbean'),
  ('TT', 'Trinidad & Tobago', 'Caribbean'),
  ('BS', 'Bahamas', 'Caribbean'),
  ('KY', 'Cayman Islands', 'Caribbean'),
  ('VG', 'British Virgin Islands', 'Caribbean'),
  ('VI', 'US Virgin Islands', 'Caribbean'),
  ('PR', 'Puerto Rico', 'Caribbean'),
  ('AW', 'Aruba', 'Caribbean'),
  ('CW', 'Curaçao', 'Caribbean'),
  ('SX', 'Sint Maarten', 'Caribbean'),
  ('AI', 'Anguilla', 'Caribbean'),
  ('MX', 'Mexico (Caribbean Coast)', 'Caribbean'),
  ('BZ', 'Belize', 'Caribbean')
ON CONFLICT (code) DO NOTHING;
