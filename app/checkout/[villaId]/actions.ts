"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

interface CheckoutDetails {
  villaId: string
  villaName: string
  location: string
  checkIn: string
  checkOut: string
  guests: number
  pricePerNight: number
  currency: string
  paymentTierPercentage: number
  depositAmount: number
  totalAmount: number
}

export async function createCheckoutSession(booking: CheckoutDetails) {
  const supabase = await createClient()

  // Get user if logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Calculate number of nights
  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  if (nights < 1) {
    throw new Error("Invalid booking dates")
  }

  // Server-side price validation to prevent tampering
  const expectedTotal = booking.pricePerNight * nights
  const expectedDeposit = Math.round((expectedTotal * booking.paymentTierPercentage) / 100)

  // Verify the amounts match (with small tolerance for rounding)
  if (Math.abs(booking.depositAmount - expectedDeposit) > 1) {
    throw new Error("Invalid payment amount")
  }

  // Convert deposit to cents for Stripe
  const depositAmountCents = Math.round(booking.depositAmount * 100)
  const totalAmountCents = Math.round(expectedTotal * 100)
  const remainingAmountCents = totalAmountCents - depositAmountCents

  // Create a booking record in the database
  const { data: bookingRecord, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      villa_id: booking.villaId,
      villa_name: booking.villaName,
      user_id: user?.id || null,
      guest_name: user?.email?.split("@")[0] || "Guest",
      guest_email: user?.email || "",
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      nights: nights,
      guests: booking.guests,
      price_per_night: Math.round(booking.pricePerNight * 100),
      subtotal: totalAmountCents,
      total_amount: totalAmountCents,
      deposit_amount: depositAmountCents,
      deposit_percentage: booking.paymentTierPercentage,
      remaining_amount: remainingAmountCents,
      currency: booking.currency,
      booking_status: "pending",
      payment_status: "deposit_pending",
    })
    .select()
    .single()

  if (bookingError) {
    console.error("Error creating booking record:", bookingError)
    // Continue anyway - we can create/update the booking later via webhook
  }

  // Determine payment tier description
  const tierDescriptions: Record<number, string> = {
    30: "30% Deposit - Pay remaining 70% 30 days before arrival",
    50: "50% Deposit - Pay remaining 50% 14 days before arrival",
    70: "70% Deposit - Pay remaining 30% on arrival",
  }

  // Create Stripe Checkout session for the deposit amount
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user?.email || undefined,
    line_items: [
      {
        price_data: {
          currency: booking.currency.toLowerCase(),
          product_data: {
            name: `${booking.villaName} - ${nights} Night${nights > 1 ? "s" : ""} (${booking.paymentTierPercentage}% Deposit)`,
            description: `${booking.location} | Check-in: ${booking.checkIn} | Check-out: ${booking.checkOut} | Guests: ${booking.guests}\n\n${tierDescriptions[booking.paymentTierPercentage] || "Deposit payment"}`,
          },
          unit_amount: depositAmountCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      villaId: booking.villaId,
      villaName: booking.villaName,
      location: booking.location,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests.toString(),
      nights: nights.toString(),
      bookingId: bookingRecord?.id || "",
      userId: user?.id || "guest",
      paymentType: "deposit",
      depositPercentage: booking.paymentTierPercentage.toString(),
      depositAmountCents: depositAmountCents.toString(),
      totalAmountCents: totalAmountCents.toString(),
      remainingAmountCents: remainingAmountCents.toString(),
      currency: booking.currency,
    },
  })

  return session.client_secret
}
