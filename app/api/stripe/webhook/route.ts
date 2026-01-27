import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Extract booking metadata
      const { 
        villaId, 
        villaName, 
        checkIn, 
        checkOut, 
        guests, 
        nights,
        bookingId,
        userId 
      } = session.metadata || {}
      
      if (bookingId) {
        // Update existing booking record
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            payment_status: "paid",
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            guest_email: session.customer_details?.email,
            guest_name: session.customer_details?.name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId)

        if (updateError) {
          console.error("Error updating booking:", updateError)
        }
      } else if (villaId) {
        // Create new booking record if one wasn't created earlier
        const { error: insertError } = await supabase
          .from("bookings")
          .insert({
            villa_id: villaId,
            user_id: userId !== "guest" ? userId : null,
            check_in: checkIn,
            check_out: checkOut,
            guests: parseInt(guests || "2"),
            total_price: (session.amount_total || 0) / 100,
            currency: session.currency?.toUpperCase() || "USD",
            status: "confirmed",
            payment_status: "paid",
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            guest_email: session.customer_details?.email,
            guest_name: session.customer_details?.name,
          })

        if (insertError) {
          console.error("Error creating booking:", insertError)
        }
      }

      // TODO: Send confirmation email to guest
      console.log(`Booking confirmed for ${villaName}: ${checkIn} to ${checkOut}`)
      break
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session
      const { bookingId } = session.metadata || {}
      
      if (bookingId) {
        // Update booking status to cancelled
        await supabase
          .from("bookings")
          .update({
            status: "cancelled",
            payment_status: "expired",
            updated_at: new Date().toISOString(),
          })
          .eq("id", bookingId)
      }
      break
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error("Payment failed:", paymentIntent.last_payment_error?.message)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
