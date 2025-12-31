-- Fix Function Search Path Mutable security warnings
-- This script sets secure search_path for all functions to prevent SQL injection

-- Fix update_user_total_points function
CREATE OR REPLACE FUNCTION public.update_user_total_points()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE profiles 
  SET total_points = (
    SELECT COALESCE(SUM(points), 0) 
    FROM loyalty_points 
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Fix cleanup_expired_image_cache function
CREATE OR REPLACE FUNCTION public.cleanup_expired_image_cache()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM property_image_cache 
  WHERE expires_at < NOW();
END;
$$;

-- Fix update_image_cache_timestamp function
CREATE OR REPLACE FUNCTION public.update_image_cache_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers with proper security
DROP TRIGGER IF EXISTS update_user_points_trigger ON loyalty_points;
CREATE TRIGGER update_user_points_trigger
  AFTER INSERT OR UPDATE OR DELETE ON loyalty_points
  FOR EACH ROW EXECUTE FUNCTION update_user_total_points();

DROP TRIGGER IF EXISTS update_image_cache_timestamp_trigger ON property_image_cache;
CREATE TRIGGER update_image_cache_timestamp_trigger
  BEFORE UPDATE ON property_image_cache
  FOR EACH ROW EXECUTE FUNCTION update_image_cache_timestamp();

-- Add triggers for tables that need updated_at timestamps
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saved_trips_updated_at ON saved_trips;
CREATE TRIGGER update_saved_trips_updated_at
  BEFORE UPDATE ON saved_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
