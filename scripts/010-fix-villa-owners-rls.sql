-- Fix RLS policy for villa_owners to allow public submissions
-- This allows anyone to submit owner inquiries through the form

DROP POLICY IF EXISTS "Anyone can create villa owner inquiries" ON public.villa_owners;

CREATE POLICY "Anyone can create villa owner inquiries"
ON public.villa_owners
FOR INSERT
TO public
WITH CHECK (true);
