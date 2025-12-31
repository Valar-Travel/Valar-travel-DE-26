-- RLS Policies for contact forms and submissions
-- Users can create submissions, but only service role can read them

-- Contact Messages
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can view all contact messages"
  ON contact_messages FOR SELECT
  TO service_role
  USING (true);

-- Contact Submissions
CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage contact submissions"
  ON contact_submissions FOR ALL
  TO service_role
  USING (true);

-- Collaborations
CREATE POLICY "Anyone can create collaboration requests"
  ON collaborations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage collaborations"
  ON collaborations FOR ALL
  TO service_role
  USING (true);

-- Villa Owners
CREATE POLICY "Anyone can apply as villa owner"
  ON villa_owners FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage villa owners"
  ON villa_owners FOR ALL
  TO service_role
  USING (true);
