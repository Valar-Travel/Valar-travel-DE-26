-- Fix bookings.villa_id column type
-- The column was likely created as INTEGER but needs to be TEXT to support UUIDs
-- Using TEXT instead of UUID for flexibility with different ID formats

-- First, drop any existing constraints on villa_id
DO $$ 
BEGIN
  -- Try to drop foreign key if it exists (it may not)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name LIKE '%villa_id%' 
    AND table_name = 'bookings'
    AND constraint_type = 'FOREIGN KEY'
  ) THEN
    EXECUTE (
      SELECT 'ALTER TABLE public.bookings DROP CONSTRAINT ' || constraint_name
      FROM information_schema.table_constraints 
      WHERE constraint_name LIKE '%villa_id%' 
      AND table_name = 'bookings'
      AND constraint_type = 'FOREIGN KEY'
      LIMIT 1
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore if constraint doesn't exist
END $$;

-- Alter the column type from INTEGER to TEXT
-- This handles both UUID strings and any legacy integer IDs
ALTER TABLE public.bookings 
  ALTER COLUMN villa_id TYPE TEXT 
  USING villa_id::TEXT;

-- Add a comment for documentation
COMMENT ON COLUMN public.bookings.villa_id IS 'Property/villa ID as text to support UUID format';
