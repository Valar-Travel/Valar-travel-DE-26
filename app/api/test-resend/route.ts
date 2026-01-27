import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY not found in environment variables",
        },
        { status: 500 },
      )
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Send a test email
    const { data, error } = await resend.emails.send({
      from: "Valar Travel <hello@valartravel.de>",
      to: "hello@valartravel.de", // Send to yourself for testing
      subject: "Resend Connection Test - Valar Travel",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">✅ Resend Connected!</h1>
            </div>
            <div style="padding: 30px; background-color: #f8fafc;">
              <h2 style="color: #0c4a6e;">Your Resend integration is working perfectly!</h2>
              <p style="color: #374151; line-height: 1.6;">
                This test email confirms that:
              </p>
              <ul style="color: #374151; line-height: 1.8;">
                <li>RESEND_API_KEY is properly configured</li>
                <li>Domain authentication is set up correctly</li>
                <li>Emails can be sent from hello@valartravel.de</li>
                <li>Your email templates are ready to use</li>
              </ul>
              <p style="color: #374151; line-height: 1.6;">
                <strong>Test sent at:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Resend test error:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Failed to send test email",
          details: error,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Resend test successful:", data)
    return NextResponse.json({
      success: true,
      message: "Test email sent successfully! Check hello@valartravel.de inbox.",
      emailId: data?.id,
      data,
    })
  } catch (error) {
    console.error("[v0] Resend test exception:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        details: error,
      },
      { status: 500 },
    )
  }
}
