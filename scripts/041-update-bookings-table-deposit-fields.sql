-- Add deposit/payment tier columns to bookings table
-- This supports the flexible payment tiers (30%, 50%, 70% deposits)
-- Run this in your Supabase SQL Editor if the automatic migration fails

-- Add columns (use ADD COLUMN IF NOT EXISTS if using PostgreSQL 11+)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS villa_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS nights INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_per_night INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS subtotal INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS total_amount INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deposit_amount INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deposit_percentage INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS remaining_amount INTEGER;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deposit_paid_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS balance_paid_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS location TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_booking_status ON public.bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_deposit_paid_at ON public.bookings(deposit_paid_at);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_villa_id ON public.bookings(villa_id);

-- Add comments for documentation
COMMENT ON COLUMN public.bookings.total_amount IS 'Total booking amount in cents';
COMMENT ON COLUMN public.bookings.deposit_amount IS 'Deposit amount in cents';
COMMENT ON COLUMN public.bookings.deposit_percentage IS 'Deposit tier percentage (30, 50, or 70)';
COMMENT ON COLUMN public.bookings.remaining_amount IS 'Remaining balance after deposit in cents';
COMMENT ON COLUMN public.bookings.booking_status IS 'Booking workflow status: pending, deposit_received, confirmed, completed, cancelled';
COMMENT ON COLUMN public.bookings.payment_status IS 'Payment status: deposit_pending, deposit_paid, paid, refunded, expired';
