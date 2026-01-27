-- Enhanced CRM and Analytics Tables for ValarTravel
-- User Journey Tracking, Audience Segmentation, and Unified Customer Data

-- ============================================
-- Customer Profile Enhancement Table
-- ============================================
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    
    -- Basic Info
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    
    -- Engagement Scores
    engagement_score INTEGER DEFAULT 0,
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    lead_score INTEGER DEFAULT 0,
    
    -- Segmentation
    customer_segment TEXT DEFAULT 'prospect', -- prospect, engaged, loyal, vip, dormant
    acquisition_source TEXT, -- organic, paid, referral, social, email
    acquisition_campaign TEXT,
    
    -- Travel Preferences (from behavior)
    preferred_destinations JSONB DEFAULT '[]'::jsonb,
    preferred_property_types JSONB DEFAULT '[]'::jsonb, -- villa, hotel, resort
    budget_range TEXT, -- budget, mid-range, luxury, ultra-luxury
    travel_frequency TEXT, -- occasional, regular, frequent
    party_size_preference TEXT, -- solo, couple, family, group
    
    -- Behavioral Data
    total_sessions INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_searches INTEGER DEFAULT 0,
    total_property_views INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    total_booking_value DECIMAL(12,2) DEFAULT 0,
    
    -- Engagement Timestamps
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_booking_at TIMESTAMPTZ,
    
    -- Marketing Preferences
    email_subscribed BOOLEAN DEFAULT false,
    email_frequency TEXT DEFAULT 'weekly', -- daily, weekly, monthly, never
    sms_subscribed BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT false,
    
    -- Tags for custom segmentation
    tags JSONB DEFAULT '[]'::jsonb,
    custom_attributes JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(email)
);

-- ============================================
-- User Journey Sessions Table
-- ============================================
CREATE TABLE IF NOT EXISTS user_journey_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customer_profiles(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL UNIQUE,
    
    -- Session Info
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    
    -- Traffic Source
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    referrer TEXT,
    landing_page TEXT,
    
    -- Device Info
    device_type TEXT, -- desktop, mobile, tablet
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    
    -- Location
    country TEXT,
    region TEXT,
    city TEXT,
    
    -- Session Metrics
    page_views INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    searches_count INTEGER DEFAULT 0,
    properties_viewed INTEGER DEFAULT 0,
    
    -- Conversion
    converted BOOLEAN DEFAULT false,
    conversion_type TEXT, -- booking, signup, newsletter, inquiry
    conversion_value DECIMAL(12,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- User Journey Events Table (Detailed Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS user_journey_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    customer_id UUID REFERENCES customer_profiles(id) ON DELETE SET NULL,
    
    -- Event Details
    event_name TEXT NOT NULL,
    event_category TEXT, -- navigation, engagement, conversion, search, property
    event_action TEXT,
    event_label TEXT,
    event_value DECIMAL(12,2),
    
    -- Page Context
    page_url TEXT,
    page_title TEXT,
    page_type TEXT, -- home, search, property, checkout, blog
    
    -- Property Context (if applicable)
    property_id TEXT,
    property_name TEXT,
    property_destination TEXT,
    property_price DECIMAL(12,2),
    
    -- Search Context (if applicable)
    search_query TEXT,
    search_filters JSONB,
    search_results_count INTEGER,
    
    -- Additional Data
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Audience Segments Table
-- ============================================
CREATE TABLE IF NOT EXISTS audience_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    
    -- Segment Rules (JSON query format)
    rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Segment Stats
    member_count INTEGER DEFAULT 0,
    avg_engagement_score DECIMAL(5,2) DEFAULT 0,
    avg_lifetime_value DECIMAL(12,2) DEFAULT 0,
    
    -- Automation
    auto_update BOOLEAN DEFAULT true,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Segment Membership Table
-- ============================================
CREATE TABLE IF NOT EXISTS segment_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID REFERENCES audience_segments(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
    
    added_at TIMESTAMPTZ DEFAULT NOW(),
    removed_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(segment_id, customer_id)
);

-- ============================================
-- Marketing Campaigns Table
-- ============================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Campaign Type
    campaign_type TEXT NOT NULL, -- email, push, sms, retargeting
    
    -- Targeting
    target_segment_id UUID REFERENCES audience_segments(id),
    target_rules JSONB,
    
    -- Content
    subject TEXT,
    content_template TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    
    -- Schedule
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    
    -- Performance Metrics
    recipients_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    converted_count INTEGER DEFAULT 0,
    
    -- Revenue Attribution
    attributed_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'draft', -- draft, scheduled, sent, completed
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Customer Interactions Log (CRM Activity)
-- ============================================
CREATE TABLE IF NOT EXISTS customer_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
    
    -- Interaction Type
    interaction_type TEXT NOT NULL, -- email_sent, email_opened, booking, inquiry, support, note
    
    -- Details
    subject TEXT,
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Attribution
    campaign_id UUID REFERENCES marketing_campaigns(id),
    
    -- Agent/System
    created_by UUID REFERENCES auth.users(id),
    is_automated BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Customer Profiles
CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_segment ON customer_profiles(customer_segment);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_lead_score ON customer_profiles(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_last_seen ON customer_profiles(last_seen_at DESC);

-- User Journey Sessions
CREATE INDEX IF NOT EXISTS idx_journey_sessions_customer ON user_journey_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_journey_sessions_session ON user_journey_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_journey_sessions_started ON user_journey_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_sessions_utm ON user_journey_sessions(utm_source, utm_medium, utm_campaign);

-- User Journey Events
CREATE INDEX IF NOT EXISTS idx_journey_events_session ON user_journey_events(session_id);
CREATE INDEX IF NOT EXISTS idx_journey_events_customer ON user_journey_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_journey_events_name ON user_journey_events(event_name);
CREATE INDEX IF NOT EXISTS idx_journey_events_created ON user_journey_events(created_at DESC);

-- Segment Memberships
CREATE INDEX IF NOT EXISTS idx_segment_memberships_segment ON segment_memberships(segment_id);
CREATE INDEX IF NOT EXISTS idx_segment_memberships_customer ON segment_memberships(customer_id);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Customer Profiles - Users can see their own, admins can see all
CREATE POLICY "Users view own profile" ON customer_profiles 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role manages profiles" ON customer_profiles 
    FOR ALL TO service_role USING (true);

-- Journey Sessions - Service role only for analytics
CREATE POLICY "Service role manages sessions" ON user_journey_sessions 
    FOR ALL TO service_role USING (true);

CREATE POLICY "Insert sessions anonymously" ON user_journey_sessions 
    FOR INSERT WITH CHECK (true);

-- Journey Events - Service role and anonymous insert
CREATE POLICY "Service role manages events" ON user_journey_events 
    FOR ALL TO service_role USING (true);

CREATE POLICY "Insert events anonymously" ON user_journey_events 
    FOR INSERT WITH CHECK (true);

-- Audience Segments - Service role only
CREATE POLICY "Service role manages segments" ON audience_segments 
    FOR ALL TO service_role USING (true);

-- Segment Memberships - Service role only
CREATE POLICY "Service role manages memberships" ON segment_memberships 
    FOR ALL TO service_role USING (true);

-- Marketing Campaigns - Service role only
CREATE POLICY "Service role manages campaigns" ON marketing_campaigns 
    FOR ALL TO service_role USING (true);

-- Customer Interactions - Service role only
CREATE POLICY "Service role manages interactions" ON customer_interactions 
    FOR ALL TO service_role USING (true);

-- ============================================
-- Default Audience Segments
-- ============================================
INSERT INTO audience_segments (name, description, rules) VALUES
('High-Value Prospects', 'Users with high engagement but no booking', 
 '[{"field": "engagement_score", "operator": ">=", "value": 50}, {"field": "total_bookings", "operator": "=", "value": 0}]'),
 
('Loyal Customers', 'Customers with 2+ bookings', 
 '[{"field": "total_bookings", "operator": ">=", "value": 2}]'),
 
('VIP Travelers', 'High lifetime value customers', 
 '[{"field": "lifetime_value", "operator": ">=", "value": 10000}]'),
 
('Luxury Seekers', 'Users viewing luxury properties', 
 '[{"field": "budget_range", "operator": "=", "value": "luxury"}]'),
 
('Dormant Users', 'No activity in 90 days', 
 '[{"field": "last_seen_at", "operator": "<=", "value": "90_days_ago"}]'),
 
('Newsletter Subscribers', 'Email subscribed users', 
 '[{"field": "email_subscribed", "operator": "=", "value": true}]'),
 
('Caribbean Enthusiasts', 'Users frequently viewing Caribbean destinations', 
 '[{"field": "preferred_destinations", "operator": "contains", "value": "caribbean"}]')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Function to Update Customer Profile from Events
-- ============================================
CREATE OR REPLACE FUNCTION update_customer_from_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Update last seen and event counts
    UPDATE customer_profiles
    SET 
        last_seen_at = NOW(),
        total_page_views = total_page_views + CASE WHEN NEW.event_name = 'page_view' THEN 1 ELSE 0 END,
        total_searches = total_searches + CASE WHEN NEW.event_name = 'search' THEN 1 ELSE 0 END,
        total_property_views = total_property_views + CASE WHEN NEW.event_name = 'property_view' THEN 1 ELSE 0 END,
        updated_at = NOW()
    WHERE id = NEW.customer_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update customer profiles
DROP TRIGGER IF EXISTS update_customer_on_event ON user_journey_events;
CREATE TRIGGER update_customer_on_event
    AFTER INSERT ON user_journey_events
    FOR EACH ROW
    WHEN (NEW.customer_id IS NOT NULL)
    EXECUTE FUNCTION update_customer_from_event();

-- ============================================
-- Function to Calculate Engagement Score
-- ============================================
CREATE OR REPLACE FUNCTION calculate_engagement_score(customer_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    customer RECORD;
BEGIN
    SELECT * INTO customer FROM customer_profiles WHERE id = customer_id_param;
    
    IF customer IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Base score from activity
    score := score + LEAST(customer.total_page_views / 10, 20);  -- Max 20 points
    score := score + LEAST(customer.total_searches * 2, 15);     -- Max 15 points
    score := score + LEAST(customer.total_property_views * 3, 25); -- Max 25 points
    score := score + customer.total_bookings * 20;                -- 20 points per booking
    
    -- Recency bonus
    IF customer.last_seen_at > NOW() - INTERVAL '7 days' THEN
        score := score + 15;
    ELSIF customer.last_seen_at > NOW() - INTERVAL '30 days' THEN
        score := score + 10;
    ELSIF customer.last_seen_at > NOW() - INTERVAL '90 days' THEN
        score := score + 5;
    END IF;
    
    -- Email engagement bonus
    IF customer.email_subscribed THEN
        score := score + 5;
    END IF;
    
    RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
