-- Add deposit/payment tier columns to bookings table
-- This supports the flexible payment tiers (30%, 50%, 70% deposits)

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Villa name (denormalized for easy display)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'villa_name') THEN
    ALTER TABLE public.bookings ADD COLUMN villa_name TEXT;
  END IF;
  
  -- Number of nights
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'nights') THEN
    ALTER TABLE public.bookings ADD COLUMN nights INTEGER;
  END IF;
  
  -- Price per night (in cents)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'price_per_night') THEN
    ALTER TABLE public.bookings ADD COLUMN price_per_night INTEGER;
  END IF;
  
  -- Subtotal (in cents)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'subtotal') THEN
    ALTER TABLE public.bookings ADD COLUMN subtotal INTEGER;
  END IF;
  
  -- Total amount (in cents) - use this instead of total_price for cents
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'total_amount') THEN
    ALTER TABLE public.bookings ADD COLUMN total_amount INTEGER;
  END IF;
  
  -- Deposit amount (in cents)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'deposit_amount') THEN
    ALTER TABLE public.bookings ADD COLUMN deposit_amount INTEGER;
  END IF;
  
  -- Deposit percentage (30, 50, or 70)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'deposit_percentage') THEN
    ALTER TABLE public.bookings ADD COLUMN deposit_percentage INTEGER;
  END IF;
  
  -- Remaining amount (in cents)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'remaining_amount') THEN
    ALTER TABLE public.bookings ADD COLUMN remaining_amount INTEGER;
  END IF;
  
  -- Booking status (pending, deposit_received, confirmed, completed, cancelled)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'booking_status') THEN
    ALTER TABLE public.bookings ADD COLUMN booking_status VARCHAR(50) DEFAULT 'pending';
  END IF;
  
  -- When deposit was paid
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'deposit_paid_at') THEN
    ALTER TABLE public.bookings ADD COLUMN deposit_paid_at TIMESTAMPTZ;
  END IF;
  
  -- When final balance was paid
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'balance_paid_at') THEN
    ALTER TABLE public.bookings ADD COLUMN balance_paid_at TIMESTAMPTZ;
  END IF;
  
  -- Location (denormalized)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'location') THEN
    ALTER TABLE public.bookings ADD COLUMN location TEXT;
  END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_deposit_paid_at ON public.bookings(deposit_paid_at);

-- Add comments for documentation
COMMENT ON COLUMN public.bookings.total_amount IS 'Total booking amount in cents';
COMMENT ON COLUMN public.bookings.deposit_amount IS 'Deposit amount in cents';
COMMENT ON COLUMN public.bookings.deposit_percentage IS 'Deposit tier percentage (30, 50, or 70)';
COMMENT ON COLUMN public.bookings.remaining_amount IS 'Remaining balance after deposit in cents';
COMMENT ON COLUMN public.bookings.booking_status IS 'Booking workflow status: pending, deposit_received, confirmed, completed, cancelled';
COMMENT ON COLUMN public.bookings.payment_status IS 'Payment status: deposit_pending, deposit_paid, paid, refunded, expired';
