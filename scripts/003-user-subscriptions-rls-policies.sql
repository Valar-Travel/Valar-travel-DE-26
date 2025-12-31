-- RLS Policies for user_subscriptions table
-- Users can only see and manage their own subscriptions

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON public.user_subscriptions;

CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own subscriptions"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own subscriptions"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Service role has full access to subscriptions"
ON public.user_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
