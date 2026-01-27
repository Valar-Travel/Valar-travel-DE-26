import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription, supabase)
        break
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(deletedSubscription, supabase)
        break
      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice, supabase)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, supabase: any) {
  const userId = subscription.metadata.userId
  if (!userId) return

  const { error } = await supabase.from("user_subscriptions").upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    status: subscription.status,
    price_id: subscription.items.data[0]?.price.id,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error("Error updating subscription:", error)
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription, supabase: any) {
  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)

  if (error) {
    console.error("Error canceling subscription:", error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  if (invoice.subscription) {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", invoice.subscription)

    if (error) {
      console.error("Error updating payment status:", error)
    }
  }
}
