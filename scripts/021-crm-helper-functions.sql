-- Helper functions for CRM analytics

-- Function to increment session metrics
CREATE OR REPLACE FUNCTION increment_session_metrics(
    p_session_id TEXT,
    p_page_views INTEGER DEFAULT 0,
    p_searches INTEGER DEFAULT 0,
    p_property_views INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
    UPDATE user_journey_sessions
    SET 
        page_views = page_views + p_page_views,
        events_count = events_count + p_page_views + p_searches + p_property_views,
        searches_count = searches_count + p_searches,
        properties_viewed = properties_viewed + p_property_views
    WHERE session_id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get customer by email or create new
CREATE OR REPLACE FUNCTION get_or_create_customer(
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_source TEXT DEFAULT 'organic'
)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    -- Try to find existing customer
    SELECT id INTO v_customer_id
    FROM customer_profiles
    WHERE email = LOWER(p_email);
    
    -- Create if not exists
    IF v_customer_id IS NULL THEN
        INSERT INTO customer_profiles (email, first_name, last_name, acquisition_source)
        VALUES (LOWER(p_email), p_first_name, p_last_name, p_source)
        RETURNING id INTO v_customer_id;
    END IF;
    
    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update engagement score
CREATE OR REPLACE FUNCTION update_all_engagement_scores()
RETURNS void AS $$
BEGIN
    UPDATE customer_profiles
    SET 
        engagement_score = calculate_engagement_score(id),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-segment customers
CREATE OR REPLACE FUNCTION auto_segment_customer(p_customer_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_customer RECORD;
    v_segment TEXT := 'prospect';
BEGIN
    SELECT * INTO v_customer FROM customer_profiles WHERE id = p_customer_id;
    
    IF v_customer IS NULL THEN
        RETURN 'prospect';
    END IF;
    
    -- VIP: High value or 3+ bookings
    IF v_customer.lifetime_value >= 10000 OR v_customer.total_bookings >= 3 THEN
        v_segment := 'vip';
    -- Loyal: 2+ bookings
    ELSIF v_customer.total_bookings >= 2 THEN
        v_segment := 'loyal';
    -- Engaged: High engagement score
    ELSIF v_customer.engagement_score >= 30 THEN
        v_segment := 'engaged';
    -- Dormant: No activity in 90 days
    ELSIF v_customer.last_seen_at < NOW() - INTERVAL '90 days' THEN
        v_segment := 'dormant';
    END IF;
    
    -- Update customer segment
    UPDATE customer_profiles
    SET customer_segment = v_segment, updated_at = NOW()
    WHERE id = p_customer_id;
    
    RETURN v_segment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-segment on profile update
CREATE OR REPLACE FUNCTION trigger_auto_segment()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM auto_segment_customer(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS auto_segment_on_update ON customer_profiles;
CREATE TRIGGER auto_segment_on_update
    AFTER UPDATE OF total_bookings, lifetime_value, engagement_score, last_seen_at
    ON customer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_auto_segment();
