-- RLS Policies for admin and operational tables
-- Only service role can access these

-- Villa Owners
DROP POLICY IF EXISTS "Anyone can create villa owner inquiries" ON public.villa_owners;
DROP POLICY IF EXISTS "Service role has full access to villa owners" ON public.villa_owners;

-- Allow anyone to submit owner inquiries (similar to contact messages)
CREATE POLICY "Anyone can create villa owner inquiries"
ON public.villa_owners
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role has full access to villa owners"
ON public.villa_owners
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Collaborations
DROP POLICY IF EXISTS "Service role has full access to collaborations" ON public.collaborations;

CREATE POLICY "Service role has full access to collaborations"
ON public.collaborations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Contact Messages
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Service role has full access to contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can create contact messages"
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role has full access to contact messages"
ON public.contact_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Luxury Properties
DROP POLICY IF EXISTS "Anyone can view luxury properties" ON public.luxury_properties;
DROP POLICY IF EXISTS "Service role has full access to luxury properties" ON public.luxury_properties;

CREATE POLICY "Anyone can view luxury properties"
ON public.luxury_properties
FOR SELECT
TO public
USING (true);

CREATE POLICY "Service role has full access to luxury properties"
ON public.luxury_properties
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Property Image Cache
DROP POLICY IF EXISTS "Service role has full access to property image cache" ON public.property_image_cache;

CREATE POLICY "Service role has full access to property image cache"
ON public.property_image_cache
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Scraped Luxury Properties
DROP POLICY IF EXISTS "Service role has full access to scraped luxury properties" ON public.scraped_luxury_properties;

CREATE POLICY "Service role has full access to scraped luxury properties"
ON public.scraped_luxury_properties
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
