-- Fix Function Search Path Mutable security warnings
-- This script adds SET search_path to all functions to prevent SQL injection vulnerabilities
-- Addresses Supabase Security Advisor warnings

-- Fix cleanup_expired_image_cache function
-- Adding SET search_path = public to secure the function
CREATE OR REPLACE FUNCTION public.cleanup_expired_image_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.property_image_cache 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Fix update_image_cache_timestamp function
-- Adding SET search_path = public to secure the function
CREATE OR REPLACE FUNCTION public.update_image_cache_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
-- Adding SET search_path = public to secure the function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix handle_new_user function
-- Adding SET search_path = public to secure the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
END;
$$;

-- Verify all functions have secure search_path
COMMENT ON FUNCTION public.cleanup_expired_image_cache() IS 'Cleans up expired image cache entries - secured with search_path';
COMMENT ON FUNCTION public.update_image_cache_timestamp() IS 'Updates timestamp on image cache - secured with search_path';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates updated_at column - secured with search_path';
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates profile for new users - secured with search_path';
