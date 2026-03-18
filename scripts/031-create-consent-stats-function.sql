-- Create function to get consent statistics
CREATE OR REPLACE FUNCTION get_consent_statistics()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'basic', COALESCE(SUM(CASE WHEN basic_personalization THEN 1 ELSE 0 END), 0),
    'ai', COALESCE(SUM(CASE WHEN ai_recommendations THEN 1 ELSE 0 END), 0),
    'marketing', COALESCE(SUM(CASE WHEN marketing_communications THEN 1 ELSE 0 END), 0),
    'social', COALESCE(SUM(CASE WHEN social_data_analysis THEN 1 ELSE 0 END), 0),
    'total', COUNT(*)
  ) INTO result
  FROM user_privacy_consent;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
