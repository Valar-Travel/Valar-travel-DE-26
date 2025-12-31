-- RLS Policies for user-specific data
-- Users can only access their own data

-- User Subscriptions: Users can only see their own
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions FOR ALL
  TO service_role
  USING (true);

-- Enhanced bookings policies to support both authenticated and anonymous users
-- Bookings: Users can view and create their own bookings
CREATE POLICY "Authenticated users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anonymous users can create bookings"
  ON bookings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Service role can manage all bookings"
  ON bookings FOR ALL
  TO service_role
  USING (true);

-- Luxury Analytics Events: Users can create their own events
CREATE POLICY "Users can create their own analytics events"
  ON luxury_analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics events"
  ON luxury_analytics_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all analytics events"
  ON luxury_analytics_events FOR ALL
  TO service_role
  USING (true);

-- Affiliate Clicks: Users can create their own clicks
CREATE POLICY "Users can create affiliate clicks"
  ON affiliate_clicks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own affiliate clicks"
  ON affiliate_clicks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all affiliate clicks"
  ON affiliate_clicks FOR ALL
  TO service_role
  USING (true);

-- Luxury Conversions: Service role only
CREATE POLICY "Service role can manage luxury conversions"
  ON luxury_conversions FOR ALL
  TO service_role
  USING (true);
