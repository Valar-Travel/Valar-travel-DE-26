-- RLS Policies for public content tables
-- Blog posts, villas, reviews, subscription plans are publicly readable

-- Blog Posts
DROP POLICY IF EXISTS "Anyone can view blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Service role has full access to blog posts" ON public.blog_posts;

CREATE POLICY "Anyone can view blog posts"
ON public.blog_posts
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Service role has full access to blog posts"
ON public.blog_posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Villas
DROP POLICY IF EXISTS "Anyone can view villas" ON public.villas;
DROP POLICY IF EXISTS "Service role has full access to villas" ON public.villas;

CREATE POLICY "Anyone can view villas"
ON public.villas
FOR SELECT
TO public
USING (true);

CREATE POLICY "Service role has full access to villas"
ON public.villas
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Service role has full access to reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews"
ON public.reviews
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Service role has full access to reviews"
ON public.reviews
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Subscription Plans
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Service role has full access to subscription plans" ON public.subscription_plans;

CREATE POLICY "Anyone can view subscription plans"
ON public.subscription_plans
FOR SELECT
TO public
USING (true);

CREATE POLICY "Service role has full access to subscription plans"
ON public.subscription_plans
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
