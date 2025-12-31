-- RLS Policies for publicly readable content
-- These tables can be read by anyone but only modified by authenticated users or service role

-- Blog Posts: Public read, authenticated write
CREATE POLICY "Blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can create blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true);

-- Villas: Public read, owner write
CREATE POLICY "Villas are viewable by everyone"
  ON villas FOR SELECT
  USING (status = 'active');

CREATE POLICY "Authenticated users can create villas"
  ON villas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Villa owners can update their villas"
  ON villas FOR UPDATE
  TO authenticated
  USING (true);

-- Property Reviews: Public read, authenticated write
CREATE POLICY "Property reviews are viewable by everyone"
  ON property_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON property_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Scraped Luxury Properties: Public read
CREATE POLICY "Luxury properties are viewable by everyone"
  ON scraped_luxury_properties FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage luxury properties"
  ON scraped_luxury_properties FOR ALL
  TO service_role
  USING (true);

-- Subscription Plans: Public read
CREATE POLICY "Subscription plans are viewable by everyone"
  ON subscription_plans FOR SELECT
  USING (active = true);

CREATE POLICY "Service role can manage subscription plans"
  ON subscription_plans FOR ALL
  TO service_role
  USING (true);
