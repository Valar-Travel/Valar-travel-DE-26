import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { getURL } from "@/lib/stripe"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured")
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase environment variables are not configured")
      return NextResponse.json({ error: "Authentication system not configured" }, { status: 500 })
    }

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email || undefined,
      billing_address_collection: "required",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId: user?.id || "anonymous",
        },
      },
      success_url: `${getURL()}dashboard?success=true`,
      cancel_url: `${getURL()}pricing?canceled=true`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
