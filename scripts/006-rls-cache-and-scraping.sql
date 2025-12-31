-- RLS Policies for caching and scraping
-- Service role only for these internal tables

-- Property Image Cache
CREATE POLICY "Service role can manage property image cache"
  ON property_image_cache FOR ALL
  TO service_role
  USING (true);

-- Allow public read access to cached images
CREATE POLICY "Anyone can view cached property images"
  ON property_image_cache FOR SELECT
  USING (true);

-- Scraping Sessions
CREATE POLICY "Service role can manage scraping sessions"
  ON scraping_sessions FOR ALL
  TO service_role
  USING (true);
