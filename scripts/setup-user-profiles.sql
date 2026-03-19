-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'email',
  preferences JSONB DEFAULT '{}',
  onboarded_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Create newsletter_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source TEXT DEFAULT 'website',
  metadata JSONB DEFAULT '{}',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for newsletter lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

-- Create analytics_events table for tracking signups
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (for webhooks/admin)
CREATE POLICY IF NOT EXISTS "Service role full access to profiles" ON user_profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role full access to newsletter" ON newsletter_subscriptions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY IF NOT EXISTS "Service role full access to analytics" ON analytics_events
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
