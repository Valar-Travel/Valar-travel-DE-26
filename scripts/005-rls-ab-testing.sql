-- RLS Policies for A/B testing
-- Public can read active tests, service role manages everything

-- A/B Test Configs
CREATE POLICY "Active A/B tests are viewable by everyone"
  ON ab_test_configs FOR SELECT
  USING (status = 'active');

CREATE POLICY "Service role can manage A/B test configs"
  ON ab_test_configs FOR ALL
  TO service_role
  USING (true);

-- A/B Test Results
CREATE POLICY "Anyone can create A/B test results"
  ON ab_test_results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can view all A/B test results"
  ON ab_test_results FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage A/B test results"
  ON ab_test_results FOR ALL
  TO service_role
  USING (true);
