-- RLS Policies for analytics and tracking tables
-- Users can create events, service role can read all

-- AB Testing Events
DROP POLICY IF EXISTS "Anyone can create ab testing events" ON public.ab_testing_events;
DROP POLICY IF EXISTS "Service role has full access to ab testing events" ON public.ab_testing_events;

CREATE POLICY "Anyone can create ab testing events"
ON public.ab_testing_events
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role has full access to ab testing events"
ON public.ab_testing_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Affiliate Clicks
DROP POLICY IF EXISTS "Anyone can create affiliate clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Service role has full access to affiliate clicks" ON public.affiliate_clicks;

CREATE POLICY "Anyone can create affiliate clicks"
ON public.affiliate_clicks
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role has full access to affiliate clicks"
ON public.affiliate_clicks
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Luxury Analytics Events
DROP POLICY IF EXISTS "Anyone can create luxury analytics events" ON public.luxury_analytics_events;
DROP POLICY IF EXISTS "Service role has full access to luxury analytics events" ON public.luxury_analytics_events;

CREATE POLICY "Anyone can create luxury analytics events"
ON public.luxury_analytics_events
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role has full access to luxury analytics events"
ON public.luxury_analytics_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Conversions
DROP POLICY IF EXISTS "Anyone can create conversions" ON public.conversions;
DROP POLICY IF EXISTS "Service role has full access to conversions" ON public.conversions;

CREATE POLICY "Anyone can create conversions"
ON public.conversions
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Service role has full access to conversions"
ON public.conversions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
