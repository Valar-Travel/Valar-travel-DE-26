-- Create comprehensive luxury analytics tables for tracking

-- Luxury analytics events table
CREATE TABLE IF NOT EXISTS luxury_analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate clicks tracking table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    click_value DECIMAL(10,2),
    potential_commission DECIMAL(10,2),
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Luxury conversions tracking table
CREATE TABLE IF NOT EXISTS luxury_conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id TEXT UNIQUE NOT NULL,
    property_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    booking_value DECIMAL(10,2) NOT NULL,
    commission_earned DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    session_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    converted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_luxury_analytics_events_user_id ON luxury_analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_luxury_analytics_events_event_name ON luxury_analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_luxury_analytics_events_created_at ON luxury_analytics_events(created_at);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_property_id ON affiliate_clicks(property_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_partner_name ON affiliate_clicks(partner_name);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);

CREATE INDEX IF NOT EXISTS idx_luxury_conversions_partner_name ON luxury_conversions(partner_name);
CREATE INDEX IF NOT EXISTS idx_luxury_conversions_converted_at ON luxury_conversions(converted_at);
CREATE INDEX IF NOT EXISTS idx_luxury_conversions_transaction_id ON luxury_conversions(transaction_id);

-- Enable RLS (Row Level Security)
ALTER TABLE luxury_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE luxury_conversions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own analytics events" ON luxury_analytics_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics events" ON luxury_analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own affiliate clicks" ON affiliate_clicks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affiliate clicks" ON affiliate_clicks
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own conversions" ON luxury_conversions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversions" ON luxury_conversions
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
