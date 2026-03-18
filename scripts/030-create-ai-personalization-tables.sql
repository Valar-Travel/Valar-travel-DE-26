-- AI Personalization and Privacy Consent Tables
-- Run this migration to enable AI-powered recommendations

-- User Privacy Consent Table
-- Tracks granular user consent for different data usage types
CREATE TABLE IF NOT EXISTS user_privacy_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Consent levels (granular opt-in)
  basic_personalization BOOLEAN DEFAULT false,     -- Use browsing history for recommendations
  ai_recommendations BOOLEAN DEFAULT false,        -- Enable AI-powered villa suggestions
  marketing_communications BOOLEAN DEFAULT false,  -- Receive personalized emails
  social_data_analysis BOOLEAN DEFAULT false,      -- Analyze linked social profiles
  
  -- Consent metadata
  consent_version VARCHAR(20) DEFAULT '1.0',       -- Track consent policy version
  consent_ip VARCHAR(45),                          -- IP address at consent time
  consent_user_agent TEXT,                         -- Browser info at consent time
  
  -- Timestamps
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one consent record per user
  UNIQUE(user_id)
);

-- User Preference Signals Table
-- Tracks user behavior for AI analysis
CREATE TABLE IF NOT EXISTS user_preference_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Signal type
  signal_type VARCHAR(50) NOT NULL,  -- 'property_view', 'search', 'favorite', 'booking', 'filter_used'
  signal_data JSONB NOT NULL,        -- Flexible data for each signal type
  
  -- Context
  property_id UUID REFERENCES scraped_properties(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  page_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI User Profiles Table
-- Stores computed user preferences from AI analysis
CREATE TABLE IF NOT EXISTS ai_user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Computed preferences (updated by AI)
  preferred_destinations JSONB DEFAULT '[]',       -- ['Barbados', 'St. Lucia']
  preferred_property_types JSONB DEFAULT '[]',     -- ['villa', 'beachfront']
  preferred_amenities JSONB DEFAULT '[]',          -- ['pool', 'ocean_view', 'chef']
  price_range JSONB DEFAULT '{}',                  -- {min: 500, max: 2000, currency: 'EUR'}
  travel_style JSONB DEFAULT '{}',                 -- {family: 0.8, romantic: 0.5, adventure: 0.3}
  
  -- Confidence scores
  profile_confidence DECIMAL(3,2) DEFAULT 0.00,   -- Overall confidence 0-1
  signal_count INTEGER DEFAULT 0,                 -- Number of signals analyzed
  
  -- Timestamps
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- AI Recommendations Table
-- Stores generated recommendations for each user
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES scraped_properties(id) ON DELETE CASCADE,
  
  -- Recommendation details
  match_score DECIMAL(5,2) NOT NULL,              -- 0-100 match percentage
  match_reasons JSONB NOT NULL,                   -- ['ocean_view', 'price_match', 'destination']
  recommendation_type VARCHAR(50) DEFAULT 'ai',   -- 'ai', 'trending', 'similar', 'new'
  
  -- User interaction tracking
  was_shown BOOLEAN DEFAULT false,
  shown_at TIMESTAMPTZ,
  was_clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  was_booked BOOLEAN DEFAULT false,
  booked_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  
  -- Prevent duplicate recommendations
  UNIQUE(user_id, property_id)
);

-- Social Profiles Table
-- Stores linked social account data (with user consent)
CREATE TABLE IF NOT EXISTS user_social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- OAuth provider info
  provider VARCHAR(50) NOT NULL,                  -- 'google', 'apple'
  provider_user_id VARCHAR(255) NOT NULL,
  
  -- Profile data (with consent)
  profile_data JSONB DEFAULT '{}',                -- Name, avatar, etc.
  
  -- Timestamps
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  
  UNIQUE(user_id, provider)
);

-- Post-Booking Follow-up Queue
-- Manages automated personalized follow-ups
CREATE TABLE IF NOT EXISTS booking_followup_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Follow-up type and timing
  followup_type VARCHAR(50) NOT NULL,             -- 'welcome', 'pre_arrival', 'itinerary', 'review_request'
  scheduled_for TIMESTAMPTZ NOT NULL,
  
  -- Content
  content_data JSONB NOT NULL,                    -- Personalized content for the email
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',           -- 'pending', 'sent', 'failed', 'cancelled'
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_preference_signals_user ON user_preference_signals(user_id);
CREATE INDEX IF NOT EXISTS idx_preference_signals_type ON user_preference_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_preference_signals_created ON user_preference_signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_active ON ai_recommendations(user_id, expires_at) WHERE was_shown = false;
CREATE INDEX IF NOT EXISTS idx_followup_queue_scheduled ON booking_followup_queue(scheduled_for) WHERE status = 'pending';

-- RLS Policies
ALTER TABLE user_privacy_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preference_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_followup_queue ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own consent
CREATE POLICY "Users can view own consent" ON user_privacy_consent
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update own consent" ON user_privacy_consent
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own consent" ON user_privacy_consent
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own preference signals
CREATE POLICY "Users can view own signals" ON user_preference_signals
  FOR SELECT USING (auth.uid() = user_id);
  
-- Service role can insert signals
CREATE POLICY "Service can insert signals" ON user_preference_signals
  FOR INSERT WITH CHECK (true);

-- Users can view their own AI profile
CREATE POLICY "Users can view own AI profile" ON ai_user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own recommendations
CREATE POLICY "Users can view own recommendations" ON ai_recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own social profiles
CREATE POLICY "Users can view own social profiles" ON user_social_profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own social profiles" ON user_social_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Users can view their own follow-ups
CREATE POLICY "Users can view own followups" ON booking_followup_queue
  FOR SELECT USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_consent_updated_at ON user_privacy_consent;
CREATE TRIGGER update_consent_updated_at
  BEFORE UPDATE ON user_privacy_consent
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_profile_updated_at ON ai_user_profiles;
CREATE TRIGGER update_ai_profile_updated_at
  BEFORE UPDATE ON ai_user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
