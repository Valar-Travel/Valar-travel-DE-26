-- Fix Supabase Security Lints
-- Run this in your Supabase SQL Editor

-- ================================================
-- 1. FIX FUNCTION SEARCH PATH MUTABLE WARNINGS
-- ================================================

-- Fix cleanup_expired_image_cache function
CREATE OR REPLACE FUNCTION public.cleanup_expired_image_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.property_image_cache WHERE expires_at < NOW();
END;
$$;

-- Fix update_image_cache_timestamp function
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
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ================================================
-- 2. FIX OVERLY PERMISSIVE RLS POLICIES
-- ================================================

-- Fix ab_test_results policies
DROP POLICY IF EXISTS "Anyone can create A/B test results" ON public.ab_test_results;
CREATE POLICY "Service role can create A/B test results" ON public.ab_test_results
  FOR INSERT TO service_role WITH CHECK (true);

-- Fix blog_posts policies
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update their blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can create their own blog posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update their own blog posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Fix bookings policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bookings;
CREATE POLICY "Authenticated users can create their own bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix collaborations policies
DROP POLICY IF EXISTS "Anyone can create collaboration requests" ON public.collaborations;
CREATE POLICY "Authenticated users can create collaboration requests" ON public.collaborations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix contact_messages policies (public forms should allow inserts but with rate limiting at app level)
-- Keep public insert for contact forms but add basic validation
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (
    email IS NOT NULL AND 
    length(email) > 5 AND 
    length(email) < 255
  );

-- Fix contact_submissions policies
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can create contact submissions" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (
    email IS NOT NULL AND 
    length(email) > 5 AND 
    length(email) < 255
  );

-- Fix property_image_cache policies
DROP POLICY IF EXISTS "Allow service role to manage image cache" ON public.property_image_cache;
CREATE POLICY "Service role can manage image cache" ON public.property_image_cache
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public can read image cache" ON public.property_image_cache
  FOR SELECT TO anon, authenticated USING (true);

-- Fix property_reviews policies
DROP POLICY IF EXISTS "Allow all operations on property_reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.property_reviews;
CREATE POLICY "Anyone can read property reviews" ON public.property_reviews
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can create their own reviews" ON public.property_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON public.property_reviews
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON public.property_reviews
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Fix scraped_luxury_properties policies
DROP POLICY IF EXISTS "Allow all operations on scraped_luxury_properties" ON public.scraped_luxury_properties;
CREATE POLICY "Service role can manage scraped properties" ON public.scraped_luxury_properties
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Public can read scraped properties" ON public.scraped_luxury_properties
  FOR SELECT TO anon, authenticated USING (true);

-- Fix scraping_sessions policies
DROP POLICY IF EXISTS "Allow all operations on scraping_sessions" ON public.scraping_sessions;
CREATE POLICY "Service role can manage scraping sessions" ON public.scraping_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Fix villa_owners policies
DROP POLICY IF EXISTS "Anyone can apply as villa owner" ON public.villa_owners;
CREATE POLICY "Authenticated users can apply as villa owner" ON public.villa_owners
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Fix villas policies
DROP POLICY IF EXISTS "Authenticated users can create villas" ON public.villas;
DROP POLICY IF EXISTS "Villa owners can update their villas" ON public.villas;
CREATE POLICY "Authenticated users can create their own villas" ON public.villas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Villa owners can update their own villas" ON public.villas
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- ================================================
-- 3. GRANT SERVICE ROLE ACCESS TO ADMIN TABLES
-- ================================================

-- Ensure service role has access to admin tables
GRANT ALL ON public.admin_users TO service_role;
GRANT ALL ON public.admin_sessions TO service_role;

-- ================================================
-- DONE - Run the linter again to verify fixes
-- ================================================
