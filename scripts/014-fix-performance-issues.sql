-- Fix Performance Issues
-- This script addresses Supabase performance suggestions:
-- 1. Adds missing indexes on foreign keys
-- 2. Removes unused indexes to improve write performance

-- ============================================
-- PART 1: Add Missing Foreign Key Indexes
-- ============================================

-- Add index on affiliate_clicks.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id 
ON public.affiliate_clicks(user_id);

-- Add index on luxury_conversions.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_luxury_conversions_user_id 
ON public.luxury_conversions(user_id);

-- Add index on user_subscriptions.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
ON public.user_subscriptions(user_id);

-- ============================================
-- PART 2: Remove Unused Indexes
-- ============================================

-- ab_test_results table - Remove 4 unused indexes
DROP INDEX IF EXISTS public.idx_ab_test_results_test_id;
DROP INDEX IF EXISTS public.idx_ab_test_results_user_id;
DROP INDEX IF EXISTS public.idx_ab_test_results_event;
DROP INDEX IF EXISTS public.idx_ab_test_results_timestamp;

-- property_image_cache table - Remove 2 unused indexes
DROP INDEX IF EXISTS public.idx_property_image_cache_expires;
DROP INDEX IF EXISTS public.idx_property_image_cache_source;

-- luxury_analytics_events table - Remove 3 unused indexes
DROP INDEX IF EXISTS public.idx_luxury_analytics_events_user_id;
DROP INDEX IF EXISTS public.idx_luxury_analytics_events_event_name;
DROP INDEX IF EXISTS public.idx_luxury_analytics_events_created_at;

-- affiliate_clicks table - Remove 3 unused indexes
DROP INDEX IF EXISTS public.idx_affiliate_clicks_property_id;
DROP INDEX IF EXISTS public.idx_affiliate_clicks_partner_name;
DROP INDEX IF EXISTS public.idx_affiliate_clicks_clicked_at;

-- luxury_conversions table - Remove 4 unused indexes
DROP INDEX IF EXISTS public.idx_luxury_conversions_partner_name;
DROP INDEX IF EXISTS public.idx_luxury_conversions_converted_at;
DROP INDEX IF EXISTS public.idx_luxury_conversions_transaction_id;

-- scraped_luxury_properties table - Remove 4 unused indexes
DROP INDEX IF EXISTS public.idx_luxury_properties_rating;
DROP INDEX IF EXISTS public.idx_luxury_properties_location;
DROP INDEX IF EXISTS public.idx_luxury_properties_scraped_at;
DROP INDEX IF EXISTS public.idx_luxury_properties_price;

-- property_reviews table - Remove 1 unused index
DROP INDEX IF EXISTS public.idx_property_reviews_property_id;

-- scraping_sessions table - Remove 1 unused index
DROP INDEX IF EXISTS public.idx_scraping_sessions_status;

-- villas table - Remove 3 unused indexes
DROP INDEX IF EXISTS public.idx_villas_location;
DROP INDEX IF EXISTS public.idx_villas_country;
DROP INDEX IF EXISTS public.idx_villas_featured;

-- bookings table - Remove 2 unused indexes
DROP INDEX IF EXISTS public.idx_bookings_villa_id;
DROP INDEX IF EXISTS public.idx_bookings_dates;

-- blog_posts table - Remove 2 unused indexes
DROP INDEX IF EXISTS public.idx_blog_posts_slug;
DROP INDEX IF EXISTS public.idx_blog_posts_published;

-- admin_users table - Remove 1 unused index
DROP INDEX IF EXISTS public.idx_admin_users_user_id;

-- profiles table - Remove 1 unused index
DROP INDEX IF EXISTS public.idx_profiles_membership_tier;

-- ============================================
-- Summary
-- ============================================
-- Added 3 indexes on foreign keys for better query performance
-- Removed 33 unused indexes to improve write performance and reduce storage
