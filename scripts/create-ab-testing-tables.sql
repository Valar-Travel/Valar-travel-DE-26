-- Create A/B testing results table
CREATE TABLE IF NOT EXISTS ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id VARCHAR(255) NOT NULL,
  variant_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  event VARCHAR(255) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_id ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_user_id ON ab_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_event ON ab_test_results(event);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_timestamp ON ab_test_results(timestamp);

-- Create A/B test configurations table
CREATE TABLE IF NOT EXISTS ab_test_configs (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  variants JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  target_metric VARCHAR(255),
  traffic_split INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample A/B tests
INSERT INTO ab_test_configs (id, name, description, variants, status, start_date, target_metric, traffic_split)
VALUES 
  (
    'homepage-hero-v1',
    'Homepage Hero Layout',
    'Test different hero section layouts for conversion',
    '[
      {"id": "control", "name": "Current Layout", "weight": 50, "config": {"layout": "current"}},
      {"id": "minimal", "name": "Minimal Layout", "weight": 25, "config": {"layout": "minimal"}},
      {"id": "video", "name": "Video Background", "weight": 25, "config": {"layout": "video"}}
    ]'::jsonb,
    'running',
    NOW(),
    'search_initiated',
    80
  ),
  (
    'property-cards-v1',
    'Property Card Design',
    'Test different property card layouts for engagement',
    '[
      {"id": "control", "name": "Current Cards", "weight": 50, "config": {"cardStyle": "current"}},
      {"id": "compact", "name": "Compact Cards", "weight": 50, "config": {"cardStyle": "compact"}}
    ]'::jsonb,
    'running',
    NOW(),
    'property_click',
    60
  )
ON CONFLICT (id) DO NOTHING;
