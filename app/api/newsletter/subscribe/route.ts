import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/resend"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscriptions")
      .select("id, status")
      .eq("email", email.toLowerCase())
      .single()

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({ error: "This email is already subscribed" }, { status: 409 })
      } else {
        // Reactivate subscription
        const { error: updateError } = await supabase
          .from("newsletter_subscriptions")
          .update({
            status: "active",
            subscribed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)

        if (updateError) {
          console.error("Error reactivating subscription:", updateError)
          return NextResponse.json({ error: "Failed to reactivate subscription" }, { status: 500 })
        }

        if (process.env.RESEND_API_KEY) {
          await sendWelcomeEmail(email.toLowerCase())
        }

        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        })
      }
    }

    // Insert new subscription
    const { error: insertError } = await supabase.from("newsletter_subscriptions").insert({
      email: email.toLowerCase(),
      status: "active",
      source: "footer_form",
      metadata: {
        user_agent: request.headers.get("user-agent"),
        subscribed_from: request.headers.get("referer") || "direct",
      },
    })

    if (insertError) {
      console.error("Error inserting subscription:", insertError)
      return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
    }

    if (process.env.RESEND_API_KEY) {
      await sendWelcomeEmail(email.toLowerCase())
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to our newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
