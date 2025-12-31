-- Create newsletter_subscriptions table for email list signups
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT DEFAULT 'footer_form',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (public insert)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscriptions
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can view subscriptions
CREATE POLICY "Authenticated users can view newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (true);

-- Service role has full access
CREATE POLICY "Service role has full access to newsletter subscriptions"
ON public.newsletter_subscriptions
FOR ALL
TO service_role
USING (true);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email 
ON public.newsletter_subscriptions(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status 
ON public.newsletter_subscriptions(status);
