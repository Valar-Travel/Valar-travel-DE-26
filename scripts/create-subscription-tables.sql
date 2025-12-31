-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL,
  price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  stripe_price_id TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  interval TEXT NOT NULL, -- 'month' or 'year'
  features JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO subscription_plans (name, description, stripe_price_id, price, interval, features) VALUES
('Starter', 'Perfect for individuals getting started', 'price_starter_monthly', 9.99, 'month', '["Up to 5 projects", "Basic support", "1GB storage"]'),
('Pro', 'Great for growing businesses', 'price_pro_monthly', 29.99, 'month', '["Unlimited projects", "Priority support", "10GB storage", "Advanced analytics"]'),
('Enterprise', 'For large organizations', 'price_enterprise_monthly', 99.99, 'month', '["Everything in Pro", "Custom integrations", "Dedicated support", "Unlimited storage"]');
