-- Create user tracking and personalization tables
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  timezone TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  preferred_destinations TEXT[],
  budget_range TEXT,
  travel_style TEXT, -- luxury, budget, mid-range
  property_types TEXT[], -- hotel, villa, apartment
  amenities TEXT[],
  group_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  search_query TEXT,
  destination TEXT,
  price_range_min NUMERIC,
  price_range_max NUMERIC,
  category TEXT,
  filters JSONB,
  results_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deal_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT REFERENCES user_sessions(session_id),
  deal_id UUID REFERENCES deals(id),
  interaction_type TEXT, -- view, click, bookmark, share
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_search_history_session_id ON search_history(session_id);
CREATE INDEX IF NOT EXISTS idx_deal_interactions_session_id ON deal_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_deal_interactions_deal_id ON deal_interactions(deal_id);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're tracking anonymous users)
CREATE POLICY "Allow public access to user_sessions" ON user_sessions FOR ALL USING (true);
CREATE POLICY "Allow public access to user_preferences" ON user_preferences FOR ALL USING (true);
CREATE POLICY "Allow public access to search_history" ON search_history FOR ALL USING (true);
CREATE POLICY "Allow public access to deal_interactions" ON deal_interactions FOR ALL USING (true);
