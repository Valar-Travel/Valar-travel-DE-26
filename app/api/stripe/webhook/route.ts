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
        userId,
        paymentType,
        depositPercentage,
        depositAmountCents,
        totalAmountCents,
        remainingAmountCents,
        currency: metadataCurrency
      } = session.metadata || {}

      // Determine if this is a deposit payment
      const isDepositPayment = paymentType === "deposit"
      const depositPct = depositPercentage ? parseInt(depositPercentage) : 100
      const paymentStatus = isDepositPayment ? "deposit_paid" : "paid"
      const bookingStatus = isDepositPayment ? "deposit_received" : "confirmed"
      
      if (bookingId) {
        // Update existing booking record
        const updateData: Record<string, any> = {
          booking_status: bookingStatus,
          payment_status: paymentStatus,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          guest_email: session.customer_details?.email || undefined,
          guest_name: session.customer_details?.name || undefined,
          updated_at: new Date().toISOString(),
        }

        // Add deposit-specific fields if applicable
        if (isDepositPayment) {
          updateData.deposit_paid_at = new Date().toISOString()
          updateData.deposit_percentage = depositPct
          if (depositAmountCents) updateData.deposit_amount = parseInt(depositAmountCents)
          if (remainingAmountCents) updateData.remaining_amount = parseInt(remainingAmountCents)
        }

        const { error: updateError } = await supabase
          .from("bookings")
          .update(updateData)
          .eq("id", bookingId)

        if (updateError) {
          console.error("Error updating booking:", updateError)
        }
      } else if (villaId) {
        // Create new booking record if one wasn't created earlier
        const insertData: Record<string, any> = {
          villa_id: villaId,
          villa_name: villaName,
          user_id: userId !== "guest" ? userId : null,
          check_in: checkIn,
          check_out: checkOut,
          nights: nights ? parseInt(nights) : null,
          guests: parseInt(guests || "2"),
          currency: metadataCurrency || session.currency?.toUpperCase() || "USD",
          booking_status: bookingStatus,
          payment_status: paymentStatus,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          guest_email: session.customer_details?.email,
          guest_name: session.customer_details?.name,
        }

        // Add payment amounts based on payment type
        if (isDepositPayment && totalAmountCents && depositAmountCents) {
          insertData.total_amount = parseInt(totalAmountCents)
          insertData.deposit_amount = parseInt(depositAmountCents)
          insertData.deposit_percentage = depositPct
          insertData.remaining_amount = parseInt(remainingAmountCents || "0")
          insertData.deposit_paid_at = new Date().toISOString()
        } else {
          insertData.total_amount = (session.amount_total || 0)
        }

        const { error: insertError } = await supabase
          .from("bookings")
          .insert(insertData)

        if (insertError) {
          console.error("Error creating booking:", insertError)
        }
      }

      // Log payment confirmation
      const paymentDescription = isDepositPayment 
        ? `${depositPct}% deposit payment` 
        : "full payment"
      console.log(`Booking ${paymentDescription} confirmed for ${villaName}: ${checkIn} to ${checkOut}`)
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
