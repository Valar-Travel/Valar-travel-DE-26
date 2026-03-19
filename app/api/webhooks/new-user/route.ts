import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { sendWelcomeEmail, sendCustomEmail, EMAIL_CONFIG } from "@/lib/resend"

// This endpoint is called after a user successfully signs up or logs in for the first time
export async function POST(request: Request) {
  try {
    const { userId, email, name, provider } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Check if this user has already been onboarded
    const { data: existingProfile } = await supabase
      .from("user_profiles")
      .select("id, onboarded_at")
      .eq("user_id", userId)
      .single()

    if (existingProfile?.onboarded_at) {
      // User already onboarded, skip
      return NextResponse.json({ success: true, message: "User already onboarded" })
    }

    // 2. Create or update user profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: userId,
        email: email.toLowerCase(),
        display_name: name || email.split("@")[0],
        auth_provider: provider || "email",
        onboarded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" })

    if (profileError) {
      console.error("[New User Webhook] Profile error:", profileError)
    }

    // 3. Add to newsletter/mailing list (opt-in by default for account holders)
    const { error: newsletterError } = await supabase
      .from("newsletter_subscriptions")
      .upsert({
        email: email.toLowerCase(),
        status: "active",
        source: "account_signup",
        metadata: {
          user_id: userId,
          auth_provider: provider || "email",
          signup_date: new Date().toISOString(),
        },
      }, { onConflict: "email" })

    if (newsletterError) {
      console.error("[New User Webhook] Newsletter error:", newsletterError)
    }

    // 4. Send welcome email to customer
    if (process.env.RESEND_API_KEY) {
      await sendWelcomeEmail(email, name)
    }

    // 5. Send notification to Sarah (admin)
    if (process.env.RESEND_API_KEY) {
      await sendCustomEmail({
        to: EMAIL_CONFIG.COMPANY_EMAIL,
        subject: `New Customer Signup: ${name || email}`,
        preheader: `A new customer has joined Valar Travel`,
        content: `
          <h2 style="color: #0c4a6e; font-size: 24px; margin-bottom: 20px;">New Customer Signup</h2>
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Name:</strong> ${name || "Not provided"}</p>
            <p style="margin: 8px 0 0 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0 0 0;"><strong>Auth Method:</strong> ${provider || "Email/Password"}</p>
            <p style="margin: 8px 0 0 0;"><strong>Signed Up:</strong> ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            This customer has been automatically added to your mailing list and sent a welcome email.
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://valartravel.de/admin/users" style="display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">View in Admin</a>
          </p>
        `,
      })
    }

    // 6. Log the signup for analytics
    await supabase.from("analytics_events").insert({
      event_type: "user_signup",
      user_id: userId,
      metadata: {
        email,
        name,
        provider: provider || "email",
        timestamp: new Date().toISOString(),
      },
    }).catch(() => {}) // Ignore analytics errors

    return NextResponse.json({ 
      success: true, 
      message: "User onboarded successfully",
      actions: ["profile_created", "newsletter_subscribed", "welcome_email_sent", "admin_notified"]
    })
  } catch (error) {
    console.error("[New User Webhook] Error:", error)
    return NextResponse.json({ error: "Failed to process new user" }, { status: 500 })
  }
}
