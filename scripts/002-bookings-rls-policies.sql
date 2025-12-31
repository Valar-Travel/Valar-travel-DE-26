-- RLS Policies for bookings table
-- Allows users to manage their own bookings and anonymous users to create bookings

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Service role has full access to bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anonymous users can create bookings" ON public.bookings;

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);

-- Allow authenticated users to create bookings
CREATE POLICY "Users can create their own bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email)
WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_email);

-- Allow anonymous users to create bookings (for guest checkouts)
CREATE POLICY "Anonymous users can create bookings"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (true);

-- Service role has full access for admin operations
CREATE POLICY "Service role has full access to bookings"
ON public.bookings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
