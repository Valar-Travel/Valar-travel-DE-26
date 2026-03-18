import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

// Company email configuration
const FROM_EMAIL = "Sarah at Valar Travel <hello@valartravel.de>"
const REPLY_TO = "hello@valartravel.de"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://valartravel.de"

// Email types
type EmailType = 
  | "welcome"
  | "contact"
  | "booking_inquiry"
  | "booking_confirmation"
  | "booking_reminder"
  | "newsletter"
  | "password_reset"
  | "custom"

interface MailRequest {
  type: EmailType
  to: string
  subject?: string
  data?: Record<string, unknown>
  html?: string // For custom emails
}

// Email styling
const styles = {
  container: `font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;`,
  header: `background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 40px 30px; text-align: center;`,
  headerLogo: `color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 1px;`,
  headerTagline: `color: #a7f3d0; font-size: 14px; margin-top: 8px; letter-spacing: 2px;`,
  body: `padding: 40px 30px;`,
  heading: `color: #064e3b; font-size: 24px; margin-bottom: 20px;`,
  text: `color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 16px;`,
  highlight: `background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; margin: 24px 0;`,
  button: `display: inline-block; background-color: #059669; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; letter-spacing: 0.5px;`,
  footer: `background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;`,
  footerText: `color: #64748b; font-size: 14px; margin: 8px 0;`,
}

// Base email template
function createEmailTemplate(content: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9;">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerLogo}">VALAR TRAVEL</h1>
          <p style="${styles.headerTagline}">LUXURY CARIBBEAN VILLAS</p>
        </div>
        
        <div style="${styles.body}">
          ${content}
          
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
            <p style="${styles.text}">Warm regards,</p>
            <p style="${styles.text}; margin-bottom: 0;"><strong>Sarah Kuhmichel</strong><br>
            <span style="color: #6b7280;">Founder, Valar Travel</span><br>
            <a href="mailto:hello@valartravel.de" style="color: #059669;">hello@valartravel.de</a></p>
          </div>
        </div>
        
        <div style="${styles.footer}">
          <p style="${styles.footerText}">Valar Travel GmbH | Luxury Caribbean Villas</p>
          <p style="${styles.footerText}">
            <a href="${SITE_URL}" style="color: #059669; text-decoration: none;">Website</a> · 
            <a href="https://wa.me/4916092527436" style="color: #059669; text-decoration: none;">WhatsApp</a> · 
            <a href="mailto:hello@valartravel.de" style="color: #059669; text-decoration: none;">Email</a>
          </p>
          <p style="${styles.footerText}; font-size: 12px; margin-top: 16px;">
            © ${new Date().getFullYear()} Valar Travel. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Email templates by type
function getEmailContent(type: EmailType, data: Record<string, unknown> = {}): { subject: string; html: string } {
  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to Valar Travel - Your Caribbean Adventure Awaits",
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">Welcome${data.name ? `, ${data.name}` : ""}!</h2>
          <p style="${styles.text}">
            Thank you for joining our exclusive community of luxury Caribbean villa enthusiasts. 
            You're now part of a select group who receives first access to our most exceptional properties.
          </p>
          <div style="${styles.highlight}">
            <strong style="color: #064e3b;">What to expect:</strong>
            <ul style="color: #374151; margin: 10px 0 0 0; padding-left: 20px; line-height: 1.8;">
              <li>Exclusive villa listings before they go public</li>
              <li>Insider tips for Caribbean travel</li>
              <li>Special offers and seasonal deals</li>
              <li>Curated destination guides</li>
            </ul>
          </div>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${SITE_URL}/villas" style="${styles.button}">Browse Our Villas</a>
          </p>
        `, "Welcome to exclusive Caribbean luxury villa experiences"),
      }

    case "booking_confirmation":
      return {
        subject: `Booking Confirmed - ${data.villaName || "Your Caribbean Villa"}`,
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">Your Booking is Confirmed!</h2>
          <p style="${styles.text}">
            Great news, ${data.name || "valued guest"}! Your stay at <strong>${data.villaName}</strong> is confirmed.
          </p>
          <div style="${styles.highlight}">
            <p style="margin: 0;"><strong>Booking Details:</strong></p>
            <p style="margin: 8px 0 0 0;">Property: ${data.villaName}</p>
            <p style="margin: 8px 0 0 0;">Check-in: ${data.checkIn}</p>
            <p style="margin: 8px 0 0 0;">Check-out: ${data.checkOut}</p>
            <p style="margin: 8px 0 0 0;">Guests: ${data.guests}</p>
            ${data.totalAmount ? `<p style="margin: 8px 0 0 0;"><strong>Total: ${data.totalAmount}</strong></p>` : ""}
          </div>
          <p style="${styles.text}">
            I'll be in touch shortly with your personalized travel itinerary and local recommendations.
          </p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="https://wa.me/4916092527436" style="${styles.button}">Contact Your Concierge</a>
          </p>
        `, `Your booking at ${data.villaName} is confirmed`),
      }

    case "booking_reminder":
      return {
        subject: `Your Trip to ${data.destination || "the Caribbean"} is Coming Up!`,
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">Your Caribbean Escape Awaits!</h2>
          <p style="${styles.text}">
            Hi ${data.name || "there"}, just a friendly reminder that your stay at <strong>${data.villaName}</strong> 
            is coming up in <strong>${data.daysUntil} days</strong>.
          </p>
          <div style="${styles.highlight}">
            <p style="margin: 0;"><strong>Pre-Arrival Checklist:</strong></p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; line-height: 1.8;">
              <li>Passport and travel documents ready</li>
              <li>Flight details confirmed</li>
              <li>Airport transfer arranged</li>
              <li>Special requests communicated</li>
            </ul>
          </div>
          <p style="${styles.text}">
            Need anything before your trip? Don't hesitate to reach out - I'm here to ensure your 
            Caribbean experience is absolutely perfect.
          </p>
        `, `${data.daysUntil} days until your Caribbean villa experience`),
      }

    case "contact":
      return {
        subject: `Thank you for contacting Valar Travel`,
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">Thank you for reaching out, ${data.name}!</h2>
          <p style="${styles.text}">
            I've received your message and will personally respond within 24 hours. 
            For urgent inquiries, please reach me directly via WhatsApp.
          </p>
          <div style="${styles.highlight}">
            <p style="margin: 0;"><strong>Your Message:</strong></p>
            <p style="margin: 12px 0 0 0; white-space: pre-wrap;">${data.message}</p>
          </div>
          <p style="text-align: center; margin: 32px 0;">
            <a href="https://wa.me/4916092527436" style="${styles.button}">WhatsApp Me</a>
          </p>
        `, "We've received your message and will respond shortly"),
      }

    case "booking_inquiry":
      return {
        subject: `Your Inquiry - ${data.villaName || "Luxury Villa"} | Valar Travel`,
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">Thank you for your inquiry, ${data.name}!</h2>
          <p style="${styles.text}">
            I'm excited to help you plan your Caribbean escape${data.villaName ? ` at <strong>${data.villaName}</strong>` : ""}.
          </p>
          ${data.checkIn || data.checkOut ? `
            <div style="${styles.highlight}">
              <p style="margin: 0;"><strong>Requested Dates:</strong></p>
              ${data.checkIn ? `<p style="margin: 8px 0 0 0;">Check-in: ${data.checkIn}</p>` : ""}
              ${data.checkOut ? `<p style="margin: 8px 0 0 0;">Check-out: ${data.checkOut}</p>` : ""}
            </div>
          ` : ""}
          <h3 style="color: #064e3b; margin-top: 24px;">What happens next?</h3>
          <ol style="color: #374151; line-height: 1.8;">
            <li><strong>Availability Check:</strong> I'll verify the property's availability</li>
            <li><strong>Personalized Quote:</strong> You'll receive a detailed pricing breakdown</li>
            <li><strong>Easy Booking:</strong> Simple reservation process with flexible options</li>
          </ol>
          <p style="${styles.text}">
            I typically respond within 2-4 hours. For immediate assistance, message me on WhatsApp.
          </p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="https://wa.me/4916092527436" style="${styles.button}">Chat on WhatsApp</a>
          </p>
        `, "We're checking availability for your dream Caribbean villa"),
      }

    case "newsletter":
      return {
        subject: data.subject as string || "News from Valar Travel",
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">${data.title || "Latest from Valar Travel"}</h2>
          ${data.content || ""}
          <p style="text-align: center; margin: 32px 0;">
            <a href="${SITE_URL}/villas" style="${styles.button}">Explore Villas</a>
          </p>
        `, data.preheader as string || "News and updates from Valar Travel"),
      }

    case "password_reset":
      return {
        subject: "Reset Your Valar Travel Password",
        html: createEmailTemplate(`
          <h2 style="${styles.heading}">Password Reset Request</h2>
          <p style="${styles.text}">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          <p style="text-align: center; margin: 32px 0;">
            <a href="${data.resetLink}" style="${styles.button}">Reset Password</a>
          </p>
          <p style="${styles.text}; color: #6b7280; font-size: 14px;">
            If you didn't request this, you can safely ignore this email. The link expires in 1 hour.
          </p>
        `, "Reset your Valar Travel password"),
      }

    default:
      return {
        subject: data.subject as string || "Message from Valar Travel",
        html: createEmailTemplate(data.content as string || "", data.preheader as string),
      }
  }
}

export async function POST(request: Request) {
  try {
    // Check API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    const body: MailRequest = await request.json()
    const { type, to, subject: customSubject, data = {}, html: customHtml } = body

    // Validate required fields
    if (!to || !type) {
      return NextResponse.json(
        { error: "Missing required fields: to, type" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Get email content
    let emailContent: { subject: string; html: string }
    
    if (type === "custom" && customHtml) {
      emailContent = {
        subject: customSubject || "Message from Valar Travel",
        html: createEmailTemplate(customHtml),
      }
    } else {
      emailContent = getEmailContent(type, data)
    }

    // Override subject if provided
    if (customSubject) {
      emailContent.subject = customSubject
    }

    // Send email
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      replyTo: REPLY_TO,
      subject: emailContent.subject,
      html: emailContent.html,
    })

    // Log email sent (optional: store in database)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Optionally log to database for analytics
    await supabase.from("email_logs").insert({
      email_type: type,
      recipient: to,
      subject: emailContent.subject,
      sent_by: user?.id || null,
      metadata: data,
    }).catch(() => {
      // Silently fail if table doesn't exist
    })

    return NextResponse.json({
      success: true,
      messageId: result.data?.id,
    })
  } catch (error) {
    console.error("Mail API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    )
  }
}

// GET endpoint to check email service status
export async function GET() {
  const configured = !!process.env.RESEND_API_KEY
  
  return NextResponse.json({
    service: "Resend",
    configured,
    fromEmail: FROM_EMAIL,
    supportedTypes: [
      "welcome",
      "contact", 
      "booking_inquiry",
      "booking_confirmation",
      "booking_reminder",
      "newsletter",
      "password_reset",
      "custom"
    ],
  })
}
