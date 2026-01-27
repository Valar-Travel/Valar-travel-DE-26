import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { subject, preview_text, content, audience } = await request.json()

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Get subscribers based on audience
    let query = supabase
      .from("newsletter_subscriptions")
      .select("email")
      .eq("status", "active")

    if (audience === "recent") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      query = query.gte("subscribed_at", thirtyDaysAgo.toISOString())
    }

    const { data: subscribers, error: subError } = await query

    if (subError) {
      console.error("Fetch subscribers error:", subError)
      return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 })
    }

    // Build HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Georgia', serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #047857; font-size: 28px; margin: 0;">Valar Travel</h1>
            <p style="color: #666; font-size: 12px; letter-spacing: 2px; margin-top: 5px;">LUXURY CARIBBEAN VILLAS</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 8px;">
            ${content.replace(/\n/g, '<br>')}
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; font-size: 12px;">
              You're receiving this because you subscribed to Valar Travel updates.
            </p>
            <p style="color: #666; font-size: 12px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #047857;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `

    // Send emails in batches
    const batchSize = 50
    let sentCount = 0
    const errors: string[] = []

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize)
      
      const emailPromises = batch.map((sub) =>
        resend.emails.send({
          from: "Valar Travel <hello@valartravel.de>",
          to: sub.email,
          subject: subject,
          html: htmlContent,
          text: content,
        }).catch((err) => {
          errors.push(`${sub.email}: ${err.message}`)
          return null
        })
      )

      const results = await Promise.all(emailPromises)
      sentCount += results.filter((r) => r !== null).length
    }

    // Log campaign to database (create table if needed)
    try {
      await supabase.from("email_campaigns").insert({
        subject,
        preview_text,
        content,
        status: "sent",
        sent_at: new Date().toISOString(),
        recipients_count: sentCount,
        opens_count: 0,
        clicks_count: 0,
      })
    } catch (e) {
      // Table might not exist, that's okay
      console.log("Could not log campaign:", e)
    }

    return NextResponse.json({
      success: true,
      recipients: sentCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Send campaign error:", error)
    return NextResponse.json(
      { error: "Failed to send campaign" },
      { status: 500 }
    )
  }
}
