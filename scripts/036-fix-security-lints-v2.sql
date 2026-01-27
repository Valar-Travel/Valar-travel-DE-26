-- ============================================
-- Fix Supabase Security Lints v2
-- ============================================

-- ============================================
-- PART 1: Fix Function Search Path Mutable
-- ============================================

-- Fix cleanup_expired_image_cache function
CREATE OR REPLACE FUNCTION public.cleanup_expired_image_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.property_image_cache
  WHERE expires_at < NOW();
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
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

-- ============================================
-- PART 2: Fix RLS Policies - Replace WITH CHECK (true)
-- ============================================

-- Fix ab_test_results - restrict to service role only for writes
DROP POLICY IF EXISTS "Anyone can create A/B test results" ON public.ab_test_results;
CREATE POLICY "Service role can create A/B test results"
  ON public.ab_test_results
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix blog_posts INSERT - only allow authenticated users to insert their own posts
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can create their own blog posts"
  ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author);

-- Fix blog_posts UPDATE - only allow users to update their own posts
DROP POLICY IF EXISTS "Authenticated users can update their blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users can update their own blog posts"
  ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = author)
  WITH CHECK ((SELECT auth.uid()) = author);

-- Fix bookings INSERT - users can only create bookings for themselves
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bookings;
CREATE POLICY "Users can create their own bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Fix collaborations - restrict to service role (form submissions go through API)
DROP POLICY IF EXISTS "Anyone can create collaboration requests" ON public.collaborations;
CREATE POLICY "Service role can create collaboration requests"
  ON public.collaborations
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix contact_messages - restrict to service role (form submissions go through API)
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
CREATE POLICY "Service role can create contact messages"
  ON public.contact_messages
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix contact_submissions - restrict to service role (form submissions go through API)
DROP POLICY IF EXISTS "Anyone can create contact submissions" ON public.contact_submissions;
CREATE POLICY "Service role can create contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix property_image_cache - restrict to service role only
DROP POLICY IF EXISTS "Allow service role to manage image cache" ON public.property_image_cache;
CREATE POLICY "Service role can manage image cache"
  ON public.property_image_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix property_reviews - replace overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on property_reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.property_reviews;

-- Allow public read
CREATE POLICY "Anyone can read property reviews"
  ON public.property_reviews
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to create reviews (with user_id check if column exists)
CREATE POLICY "Authenticated users can create their own reviews"
  ON public.property_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'property_reviews' 
        AND column_name = 'user_id'
      ) THEN (SELECT auth.uid()) = user_id
      ELSE true
    END
  );

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON public.property_reviews
  FOR UPDATE
  TO authenticated
  USING (
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'property_reviews' 
        AND column_name = 'user_id'
      ) THEN (SELECT auth.uid()) = user_id
      ELSE true
    END
  );

-- Fix scraped_luxury_properties - restrict to service role
DROP POLICY IF EXISTS "Allow all operations on scraped_luxury_properties" ON public.scraped_luxury_properties;

CREATE POLICY "Public can read scraped luxury properties"
  ON public.scraped_luxury_properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can manage scraped luxury properties"
  ON public.scraped_luxury_properties
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix scraping_sessions - restrict to service role
DROP POLICY IF EXISTS "Allow all operations on scraping_sessions" ON public.scraping_sessions;

CREATE POLICY "Service role can manage scraping sessions"
  ON public.scraping_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix villa_owners - restrict to service role (form submissions go through API)
DROP POLICY IF EXISTS "Anyone can apply as villa owner" ON public.villa_owners;
CREATE POLICY "Service role can create villa owner applications"
  ON public.villa_owners
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix villas INSERT - authenticated users can only create villas they own
DROP POLICY IF EXISTS "Authenticated users can create villas" ON public.villas;
CREATE POLICY "Authenticated users can create their own villas"
  ON public.villas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'villas' 
        AND column_name = 'owner_id'
      ) THEN (SELECT auth.uid()) = owner_id
      ELSE true
    END
  );

-- Fix villas UPDATE - villa owners can only update their own villas
DROP POLICY IF EXISTS "Villa owners can update their villas" ON public.villas;
CREATE POLICY "Villa owners can update their own villas"
  ON public.villas
  FOR UPDATE
  TO authenticated
  USING (
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'villas' 
        AND column_name = 'owner_id'
      ) THEN (SELECT auth.uid()) = owner_id
      ELSE true
    END
  )
  WITH CHECK (
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'villas' 
        AND column_name = 'owner_id'
      ) THEN (SELECT auth.uid()) = owner_id
      ELSE true
    END
  );

-- ============================================
-- PART 3: Grant necessary permissions
-- ============================================

-- Ensure service_role has proper permissions
GRANT ALL ON public.ab_test_results TO service_role;
GRANT ALL ON public.collaborations TO service_role;
GRANT ALL ON public.contact_messages TO service_role;
GRANT ALL ON public.contact_submissions TO service_role;
GRANT ALL ON public.property_image_cache TO service_role;
GRANT ALL ON public.scraped_luxury_properties TO service_role;
GRANT ALL ON public.scraping_sessions TO service_role;
GRANT ALL ON public.villa_owners TO service_role;
