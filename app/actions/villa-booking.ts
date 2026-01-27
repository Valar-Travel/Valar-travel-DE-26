"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

interface BookingDetails {
  villaId: string
  villaName: string
  location: string
  checkIn: string
  checkOut: string
  guests: number
  pricePerNight: number
  currency: string
}

export async function createVillaBookingSession(booking: BookingDetails) {
  const supabase = await createClient()
  
  // Get user if logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  // Calculate number of nights
  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (nights < 1) {
    throw new Error("Invalid booking dates")
  }
  
  // Calculate total price in cents
  const totalPriceCents = Math.round(booking.pricePerNight * nights * 100)
  
  // Create a booking record in the database
  const { data: bookingRecord, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      villa_id: booking.villaId,
      user_id: user?.id || null,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      guests: booking.guests,
      total_price: totalPriceCents / 100,
      currency: booking.currency,
      status: "pending",
      payment_status: "pending"
    })
    .select()
    .single()
  
  if (bookingError) {
    console.error("Error creating booking record:", bookingError)
    // Continue anyway - we can create the booking later via webhook
  }
  
  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: user?.email || undefined,
    line_items: [
      {
        price_data: {
          currency: booking.currency.toLowerCase(),
          product_data: {
            name: `${booking.villaName} - ${nights} Night${nights > 1 ? "s" : ""}`,
            description: `${booking.location} | Check-in: ${booking.checkIn} | Check-out: ${booking.checkOut} | Guests: ${booking.guests}`,
          },
          unit_amount: totalPriceCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      villaId: booking.villaId,
      villaName: booking.villaName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests.toString(),
      nights: nights.toString(),
      bookingId: bookingRecord?.id || "",
      userId: user?.id || "guest",
    },
  })

  return session.client_secret
}

export async function getBookingSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
  }
}
