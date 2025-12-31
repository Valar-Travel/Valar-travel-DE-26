-- Fix all Supabase Security Advisor warnings
-- This script addresses:
-- 1. Auth RLS Initialization Plan warnings (wrap auth.uid() in subqueries)
-- 2. Multiple Permissive Policies warnings (consolidate duplicate policies)

-- ============================================================================
-- PART 1: Fix Auth RLS Initialization Plan Issues
-- Replace auth.uid() with (select auth.uid()) for better performance
-- ============================================================================

-- Fix profiles table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

-- Fix admin_users table policies
DROP POLICY IF EXISTS "Admins can view their own admin record" ON admin_users;

CREATE POLICY "Admins can view their own admin record"
  ON admin_users FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Fix user_subscriptions table policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON user_subscriptions;

CREATE POLICY "Users can view own subscriptions" 
  ON user_subscriptions
  FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own subscriptions" 
  ON user_subscriptions
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own subscriptions" 
  ON user_subscriptions
  FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

-- Fix luxury_analytics_events table policies
DROP POLICY IF EXISTS "Users can view their own analytics events" ON luxury_analytics_events;
DROP POLICY IF EXISTS "Users can insert their own analytics events" ON luxury_analytics_events;

CREATE POLICY "Users can view their own analytics events" 
  ON luxury_analytics_events
  FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own analytics events" 
  ON luxury_analytics_events
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- Fix affiliate_clicks table policies
DROP POLICY IF EXISTS "Users can view their own affiliate clicks" ON affiliate_clicks;
DROP POLICY IF EXISTS "Users can insert their own affiliate clicks" ON affiliate_clicks;

CREATE POLICY "Users can view their own affiliate clicks" 
  ON affiliate_clicks
  FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own affiliate clicks" 
  ON affiliate_clicks
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- Fix luxury_conversions table policies
DROP POLICY IF EXISTS "Users can view their own conversions" ON luxury_conversions;
DROP POLICY IF EXISTS "Users can insert their own conversions" ON luxury_conversions;

CREATE POLICY "Users can view their own conversions" 
  ON luxury_conversions
  FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert their own conversions" 
  ON luxury_conversions
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- ============================================================================
-- PART 2: Fix Multiple Permissive Policies Issues
-- Consolidate duplicate policies into single policies
-- ============================================================================

-- Fix ab_test_configs - Remove duplicate SELECT policies
DROP POLICY IF EXISTS "Active A/B tests are viewable by everyone" ON ab_test_configs;
DROP POLICY IF EXISTS "Enable read access for all users" ON ab_test_configs;

-- Create single consolidated SELECT policy
CREATE POLICY "Enable read access for all users" 
  ON ab_test_configs 
  FOR SELECT 
  USING (status = 'active' OR status = 'running');

-- Fix property_image_cache - Remove duplicate SELECT policies
DROP POLICY IF EXISTS "Allow public read access to image cache" ON property_image_cache;
DROP POLICY IF EXISTS "Anyone can view cached property images" ON property_image_cache;
DROP POLICY IF EXISTS "Allow service role to manage image cache" ON property_image_cache;

-- Create single consolidated SELECT policy for public
CREATE POLICY "Anyone can view cached property images" 
  ON property_image_cache 
  FOR SELECT 
  USING (true);

-- Keep service role policy separate for ALL operations
CREATE POLICY "Service role can manage image cache" 
  ON property_image_cache 
  FOR ALL 
  TO service_role
  USING (true);

-- Fix property_reviews - Remove duplicate policies
DROP POLICY IF EXISTS "Allow all operations on property_reviews" ON property_reviews;
DROP POLICY IF EXISTS "Property reviews are viewable by everyone" ON property_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON property_reviews;

-- Create single SELECT policy
CREATE POLICY "Property reviews are viewable by everyone" 
  ON property_reviews 
  FOR SELECT 
  USING (true);

-- Create single INSERT policy
CREATE POLICY "Authenticated users can create reviews" 
  ON property_reviews 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Keep service role policy for full management
CREATE POLICY "Service role can manage property reviews" 
  ON property_reviews 
  FOR ALL 
  TO service_role
  USING (true);

-- Fix scraped_luxury_properties - Remove duplicate policies
DROP POLICY IF EXISTS "Allow all operations on scraped_luxury_properties" ON scraped_luxury_properties;
DROP POLICY IF EXISTS "Luxury properties are viewable by everyone" ON scraped_luxury_properties;
DROP POLICY IF EXISTS "Service role can manage luxury properties" ON scraped_luxury_properties;

-- Create single SELECT policy
CREATE POLICY "Luxury properties are viewable by everyone" 
  ON scraped_luxury_properties 
  FOR SELECT 
  USING (true);

-- Keep service role policy for full management
CREATE POLICY "Service role can manage luxury properties" 
  ON scraped_luxury_properties 
  FOR ALL 
  TO service_role
  USING (true);
