-- Create contact_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  travel_type text, -- 'business', 'leisure', 'group', 'other'
  preferred_contact text, -- 'email', 'phone'
  created_at timestamp DEFAULT now()
);

-- Insert some sample contact messages for testing
INSERT INTO contact_messages (name, email, phone, subject, message, travel_type, preferred_contact) VALUES
('John Smith', 'john@example.com', '+1-555-0123', 'Question about Paris deals', 'Hi, I am interested in the Paris vacation packages. Can you provide more details about the current offers?', 'leisure', 'email'),
('Sarah Johnson', 'sarah@example.com', '+1-555-0456', 'Group booking inquiry', 'We are planning a group trip for 15 people to Tokyo. Do you have any group discounts available?', 'group', 'phone'),
('Mike Wilson', 'mike@example.com', NULL, 'Business travel assistance', 'I need help with frequent business travel arrangements to London. What corporate packages do you offer?', 'business', 'email'),
('Emma Davis', 'emma@example.com', '+1-555-0789', 'Last-minute deal question', 'Are there any last-minute deals available for Barcelona this weekend?', 'leisure', 'email');
