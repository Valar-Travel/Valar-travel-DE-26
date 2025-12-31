import { Resend } from "resend"

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Company email configuration
const COMPANY_EMAIL = "sarah@valartravel.de"
const COMPANY_NAME = "Valar Travel"
const SUPPORT_PHONE = "+49 160 92527436"
const SITE_URL = "https://valartravel.de"

// Email styling constants
const emailStyles = {
  container:
    "font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;",
  header: "background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); padding: 40px 30px; text-align: center;",
  headerLogo: "color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;",
  headerTagline: "color: #bae6fd; font-size: 14px; margin-top: 8px;",
  body: "padding: 40px 30px;",
  heading: "color: #0c4a6e; font-size: 24px; margin-bottom: 20px;",
  text: "color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 16px;",
  highlight: "background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 16px; margin: 20px 0;",
  button:
    "display: inline-block; background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;",
  footer: "background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;",
  footerText: "color: #64748b; font-size: 14px; margin: 8px 0;",
  signature: "margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;",
}

// Base email template wrapper
function emailWrapper(content: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9;">
      <div style="${emailStyles.container}">
        <div style="${emailStyles.header}">
          <h1 style="${emailStyles.headerLogo}">Valar Travel</h1>
          <p style="${emailStyles.headerTagline}">Luxury Caribbean Villa Experiences</p>
        </div>
        
        <div style="${emailStyles.body}">
          ${content}
          
          <div style="${emailStyles.signature}">
            <p style="${emailStyles.text}">Warm regards,</p>
            <p style="${emailStyles.text}"><strong>Sarah Kuhmichel</strong><br>
            Founder, Valar Travel<br>
            <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9;">${COMPANY_EMAIL}</a><br>
            <a href="tel:${SUPPORT_PHONE}" style="color: #0ea5e9;">${SUPPORT_PHONE}</a></p>
          </div>
        </div>
        
        <div style="${emailStyles.footer}">
          <p style="${emailStyles.footerText}">Valar Travel GmbH | Luxury Caribbean Villas</p>
          <p style="${emailStyles.footerText}">
            <a href="${SITE_URL}" style="color: #0ea5e9; text-decoration: none;">Website</a> · 
            <a href="https://wa.me/4916092527436" style="color: #0ea5e9; text-decoration: none;">WhatsApp</a> · 
            <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9; text-decoration: none;">Email</a>
          </p>
          <p style="${emailStyles.footerText}; font-size: 12px; margin-top: 16px;">
            © ${new Date().getFullYear()} Valar Travel. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Newsletter wrapper with unsubscribe link
function newsletterWrapper(content: string, email: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9;">
      <div style="${emailStyles.container}">
        <div style="${emailStyles.header}">
          <h1 style="${emailStyles.headerLogo}">Valar Travel</h1>
          <p style="${emailStyles.headerTagline}">Luxury Caribbean Villa Experiences</p>
        </div>
        
        <div style="${emailStyles.body}">
          ${content}
          
          <div style="${emailStyles.signature}">
            <p style="${emailStyles.text}">Warm regards,</p>
            <p style="${emailStyles.text}"><strong>Sarah Kuhmichel</strong><br>
            Founder, Valar Travel<br>
            <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9;">${COMPANY_EMAIL}</a><br>
            <a href="tel:${SUPPORT_PHONE}" style="color: #0ea5e9;">${SUPPORT_PHONE}</a></p>
          </div>
        </div>
        
        <div style="${emailStyles.footer}">
          <p style="${emailStyles.footerText}">Valar Travel GmbH | Luxury Caribbean Villas</p>
          <p style="${emailStyles.footerText}">
            <a href="${SITE_URL}" style="color: #0ea5e9; text-decoration: none;">Website</a> · 
            <a href="https://wa.me/4916092527436" style="color: #0ea5e9; text-decoration: none;">WhatsApp</a> · 
            <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9; text-decoration: none;">Email</a>
          </p>
          <p style="${emailStyles.footerText}; font-size: 12px; margin-top: 16px;">
            © ${new Date().getFullYear()} Valar Travel. All rights reserved.<br>
            <a href="${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe from newsletter</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Welcome email for newsletter subscribers
export async function sendWelcomeEmail(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const greeting = name ? `Dear ${name}` : "Welcome"

    const content = `
      <h2 style="${emailStyles.heading}">${greeting}, welcome to Valar Travel!</h2>
      
      <p style="${emailStyles.text}">
        Thank you for joining our exclusive community of luxury Caribbean villa enthusiasts. 
        You're now part of a select group who receives first access to our most exceptional properties.
      </p>
      
      <div style="${emailStyles.highlight}">
        <strong style="color: #0c4a6e;">What to expect:</strong>
        <ul style="color: #374151; margin: 10px 0 0 0; padding-left: 20px;">
          <li>Exclusive villa listings before they go public</li>
          <li>Insider tips for Caribbean travel</li>
          <li>Special offers and seasonal deals</li>
          <li>Curated destination guides</li>
        </ul>
      </div>
      
      <p style="${emailStyles.text}">
        Our destinations include <strong>Barbados, St. Lucia, Jamaica, and St. Barthélemy</strong> - 
        each offering unique luxury experiences from beachfront estates to hillside retreats.
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${SITE_URL}/villas" style="${emailStyles.button}">Browse Our Villas</a>
      </p>
      
      <p style="${emailStyles.text}">
        Have a specific villa in mind or need personalized recommendations? 
        I'm always happy to help you find your perfect Caribbean escape.
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: "Welcome to Valar Travel - Your Caribbean Adventure Awaits",
      html: newsletterWrapper(content, email, "Welcome to exclusive Caribbean luxury villa experiences"),
      headers: {
        "List-Unsubscribe": `<${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Contact form email - sends to Sarah and auto-reply to user
export async function sendContactEmail(data: {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  inquiryType?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, phone, subject, message, inquiryType } = data

    // Send notification to Sarah
    const notificationContent = `
      <h2 style="${emailStyles.heading}">New Contact Form Submission</h2>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>From:</strong> ${name}</p>
        <p style="margin: 8px 0 0 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0ea5e9;">${email}</a></p>
        ${phone ? `<p style="margin: 8px 0 0 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #0ea5e9;">${phone}</a></p>` : ""}
        ${inquiryType ? `<p style="margin: 8px 0 0 0;"><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ""}
        ${subject ? `<p style="margin: 8px 0 0 0;"><strong>Subject:</strong> ${subject}</p>` : ""}
      </div>
      
      <h3 style="color: #0c4a6e; margin-top: 24px;">Message:</h3>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;">
        <p style="${emailStyles.text}; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="mailto:${email}?subject=Re: ${subject || "Your Valar Travel Inquiry"}" style="${emailStyles.button}">Reply to ${name}</a>
      </p>
    `

    await resend.emails.send({
      from: `Valar Travel Website <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      replyTo: email,
      subject: `[Contact Form] ${subject || inquiryType || "New Inquiry"} from ${name}`,
      html: emailWrapper(notificationContent),
    })

    // Send auto-reply to customer
    const autoReplyContent = `
      <h2 style="${emailStyles.heading}">Thank you for contacting Valar Travel, ${name}!</h2>
      
      <p style="${emailStyles.text}">
        I've received your message and will personally respond within 24 hours. 
        For urgent inquiries, please don't hesitate to reach me directly via WhatsApp.
      </p>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Quick Contact:</strong></p>
        <p style="margin: 8px 0 0 0;">WhatsApp: <a href="https://wa.me/4916092527436" style="color: #0ea5e9;">${SUPPORT_PHONE}</a></p>
        <p style="margin: 8px 0 0 0;">Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9;">${COMPANY_EMAIL}</a></p>
      </div>
      
      <h3 style="color: #0c4a6e; margin-top: 24px;">Your Message:</h3>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;">
        <p style="${emailStyles.text}; margin: 0; white-space: pre-wrap;">${message}</p>
      </div>
      
      <p style="${emailStyles.text}">
        While you wait, feel free to explore our curated collection of luxury Caribbean villas:
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${SITE_URL}/villas" style="${emailStyles.button}">Browse Villas</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: "Thank you for your inquiry - Valar Travel",
      html: emailWrapper(autoReplyContent, "We've received your message and will respond shortly"),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending contact email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Booking/Availability Inquiry Response
export async function sendBookingInquiryResponse(data: {
  name: string
  email: string
  villaName?: string
  destination?: string
  dates?: { checkIn?: string; checkOut?: string }
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, villaName, destination, dates } = data

    const content = `
      <h2 style="${emailStyles.heading}">Thank you for your booking inquiry, ${name}!</h2>
      
      <p style="${emailStyles.text}">
        I'm excited to help you plan your Caribbean escape${villaName ? ` at <strong>${villaName}</strong>` : ""}${destination ? ` in <strong>${destination}</strong>` : ""}.
      </p>
      
      ${
        dates?.checkIn || dates?.checkOut
          ? `
        <div style="${emailStyles.highlight}">
          <p style="margin: 0;"><strong>Requested Dates:</strong></p>
          ${dates.checkIn ? `<p style="margin: 8px 0 0 0;">Check-in: ${dates.checkIn}</p>` : ""}
          ${dates.checkOut ? `<p style="margin: 8px 0 0 0;">Check-out: ${dates.checkOut}</p>` : ""}
        </div>
      `
          : ""
      }
      
      <h3 style="color: #0c4a6e;">What happens next?</h3>
      <ol style="color: #374151; line-height: 1.8;">
        <li><strong>Availability Check:</strong> I'll verify the property's availability for your dates</li>
        <li><strong>Personalized Quote:</strong> You'll receive a detailed breakdown including any seasonal pricing</li>
        <li><strong>Villa Details:</strong> I'll share additional photos, floor plans, and local recommendations</li>
        <li><strong>Easy Booking:</strong> Once confirmed, I'll guide you through our simple reservation process</li>
      </ol>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Our Booking Benefits:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>Best price guarantee</li>
          <li>Flexible cancellation options</li>
          <li>24/7 concierge support during your stay</li>
          <li>Complimentary airport transfers (select properties)</li>
          <li>Local restaurant and activity recommendations</li>
        </ul>
      </div>
      
      <p style="${emailStyles.text}">
        I typically respond within 2-4 hours during business hours. For immediate assistance, 
        please reach me via WhatsApp at <a href="https://wa.me/4916092527436" style="color: #0ea5e9;">${SUPPORT_PHONE}</a>.
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/4916092527436" style="${emailStyles.button}">Chat on WhatsApp</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: `Your Booking Inquiry${villaName ? ` - ${villaName}` : ""} | Valar Travel`,
      html: emailWrapper(content, "We're checking availability for your dream Caribbean villa"),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending booking inquiry response:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Destination Information
export async function sendDestinationInfo(data: {
  name: string
  email: string
  destination: "barbados" | "st-lucia" | "jamaica" | "st-barthelemy"
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, destination } = data

    const destinationInfo: Record<string, { name: string; highlights: string[]; bestFor: string; bestTime: string }> = {
      barbados: {
        name: "Barbados",
        highlights: [
          "Pristine west coast beaches with calm, crystal-clear waters",
          "World-class dining and vibrant nightlife in Holetown",
          "Historic plantation houses and rum distillery tours",
          "Excellent golf courses and water sports",
        ],
        bestFor: "Couples, families, and those seeking a blend of relaxation and culture",
        bestTime: "December to April (dry season), though beautiful year-round",
      },
      "st-lucia": {
        name: "St. Lucia",
        highlights: [
          "Iconic Pitons rising from the Caribbean Sea",
          "Natural volcanic hot springs and mud baths",
          "Lush rainforest with hiking and zip-lining",
          "Secluded beaches and world-renowned resorts",
        ],
        bestFor: "Romantic getaways, adventure seekers, and nature lovers",
        bestTime: "January to April, avoiding the rainy season",
      },
      jamaica: {
        name: "Jamaica",
        highlights: [
          "Legendary beaches from Negril to Montego Bay",
          "Rich musical heritage and vibrant local culture",
          "Blue Mountain coffee plantations and waterfalls",
          "Exceptional jerk cuisine and rum experiences",
        ],
        bestFor: "Culture enthusiasts, beach lovers, and adventure travelers",
        bestTime: "November to mid-December for fewer crowds and great weather",
      },
      "st-barthelemy": {
        name: "St. Barthélemy",
        highlights: [
          "French-Caribbean elegance and duty-free shopping",
          "14 pristine beaches, each with unique character",
          "Michelin-starred restaurants and celebrity hotspots",
          "Exclusive villas with stunning ocean views",
        ],
        bestFor: "Luxury travelers, couples, and those seeking privacy and exclusivity",
        bestTime: "December to May for optimal weather and social season",
      },
    }

    const info = destinationInfo[destination]

    const content = `
      <h2 style="${emailStyles.heading}">Discover ${info.name}, ${name}!</h2>
      
      <p style="${emailStyles.text}">
        Thank you for your interest in ${info.name}. It's one of my favorite Caribbean destinations, 
        and I'd love to help you experience its magic.
      </p>
      
      <h3 style="color: #0c4a6e;">Destination Highlights:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        ${info.highlights.map((h) => `<li>${h}</li>`).join("")}
      </ul>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Best For:</strong> ${info.bestFor}</p>
        <p style="margin: 12px 0 0 0;"><strong>Best Time to Visit:</strong> ${info.bestTime}</p>
      </div>
      
      <h3 style="color: #0c4a6e;">Our ${info.name} Villa Collection:</h3>
      <p style="${emailStyles.text}">
        We've handpicked the finest luxury villas in ${info.name}, from beachfront estates to 
        hillside retreats with panoramic views. Each property comes with:
      </p>
      <ul style="color: #374151; line-height: 1.8;">
        <li>Private pools and tropical gardens</li>
        <li>Fully equipped gourmet kitchens</li>
        <li>Dedicated concierge services</li>
        <li>Optional private chef and butler</li>
      </ul>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${SITE_URL}/destinations/${destination}" style="${emailStyles.button}">Explore ${info.name} Villas</a>
      </p>
      
      <p style="${emailStyles.text}">
        Ready to start planning? Reply to this email or message me on WhatsApp - 
        I'll help you find the perfect villa for your ${info.name} adventure.
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: `Discover ${info.name} - Your Luxury Villa Guide | Valar Travel`,
      html: emailWrapper(content, `Everything you need to know about luxury villas in ${info.name}`),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending destination info:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Pricing & Payment Information
export async function sendPricingInfo(data: {
  name: string
  email: string
  villaName?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, villaName } = data

    const content = `
      <h2 style="${emailStyles.heading}">Pricing Information${villaName ? ` for ${villaName}` : ""}</h2>
      
      <p style="${emailStyles.text}">
        Hello ${name}, thank you for your pricing inquiry. Here's everything you need to know 
        about our villa pricing and payment process.
      </p>
      
      <h3 style="color: #0c4a6e;">What's Included in Our Rates:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li>Nightly accommodation in your chosen luxury villa</li>
        <li>Daily housekeeping service</li>
        <li>Concierge support throughout your stay</li>
        <li>Welcome amenities and provisions</li>
        <li>High-speed WiFi and entertainment systems</li>
        <li>Use of all villa amenities (pool, beach access, etc.)</li>
      </ul>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Seasonal Pricing:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li><strong>Peak Season</strong> (Dec 15 - Apr 15): Premium rates apply</li>
          <li><strong>High Season</strong> (Nov - Dec 14, Apr 16 - May): Standard rates</li>
          <li><strong>Low Season</strong> (Jun - Oct): Best value rates, up to 40% savings</li>
        </ul>
      </div>
      
      <h3 style="color: #0c4a6e;">Payment Terms:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li><strong>Deposit:</strong> 50% due at booking confirmation</li>
        <li><strong>Balance:</strong> Remaining 50% due 60 days before arrival</li>
        <li><strong>Security Deposit:</strong> Refundable deposit held and returned after checkout</li>
      </ul>
      
      <h3 style="color: #0c4a6e;">Accepted Payment Methods:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li>Major credit cards (Visa, Mastercard, Amex)</li>
        <li>Bank transfer (EUR, USD, GBP)</li>
        <li>PayPal for deposits</li>
      </ul>
      
      <p style="${emailStyles.text}">
        Would you like a personalized quote? Share your preferred dates and I'll prepare 
        a detailed breakdown including any applicable discounts or special offers.
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/4916092527436" style="${emailStyles.button}">Request a Quote</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: `Pricing Information${villaName ? ` - ${villaName}` : ""} | Valar Travel`,
      html: emailWrapper(content, "Villa pricing, payment terms, and what's included"),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending pricing info:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Cancellation Policy Information
export async function sendCancellationPolicy(data: {
  name: string
  email: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email } = data

    const content = `
      <h2 style="${emailStyles.heading}">Cancellation & Refund Policy</h2>
      
      <p style="${emailStyles.text}">
        Hello ${name}, I understand flexibility is important when planning your Caribbean getaway. 
        Here's our cancellation policy designed to give you peace of mind.
      </p>
      
      <h3 style="color: #0c4a6e;">Standard Cancellation Terms:</h3>
      
      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #166534;"><strong>60+ days before arrival:</strong></p>
        <p style="margin: 8px 0 0 0; color: #374151;">Full refund minus administrative fee (5%)</p>
      </div>
      
      <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #854d0e;"><strong>30-59 days before arrival:</strong></p>
        <p style="margin: 8px 0 0 0; color: #374151;">50% refund of total booking amount</p>
      </div>
      
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #991b1b;"><strong>Less than 30 days before arrival:</strong></p>
        <p style="margin: 8px 0 0 0; color: #374151;">No refund (booking may be rescheduled subject to availability)</p>
      </div>
      
      <h3 style="color: #0c4a6e;">Flexible Booking Options:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li><strong>Date Changes:</strong> One free date change allowed 30+ days before arrival</li>
        <li><strong>Travel Insurance:</strong> We strongly recommend comprehensive travel insurance</li>
        <li><strong>Hurricane Policy:</strong> Special terms apply during hurricane season (Jun-Nov)</li>
      </ul>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Pro Tip:</strong> Book during low season (June-October) for the most flexible cancellation terms and best rates!</p>
      </div>
      
      <p style="${emailStyles.text}">
        Have questions about a specific booking? I'm happy to discuss your options.
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="mailto:${COMPANY_EMAIL}?subject=Cancellation Policy Question" style="${emailStyles.button}">Ask a Question</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: "Cancellation & Refund Policy | Valar Travel",
      html: emailWrapper(content, "Our flexible cancellation policy for your peace of mind"),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending cancellation policy:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Template: Villa Features & Amenities
export async function sendVillaFeaturesInfo(data: {
  name: string
  email: string
  villaName?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, villaName } = data

    const content = `
      <h2 style="${emailStyles.heading}">Luxury Villa Features & Amenities</h2>
      
      <p style="${emailStyles.text}">
        Hello ${name}, thank you for your interest in our villa collection${villaName ? `, specifically <strong>${villaName}</strong>` : ""}. 
        Here's what you can expect from our handpicked luxury properties.
      </p>
      
      <h3 style="color: #0c4a6e;">Standard Villa Features:</h3>
      
      <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #0c4a6e;">Private Pool & Outdoor Living</p>
        <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">Infinity pools, sun decks, outdoor dining areas, BBQ facilities</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #0c4a6e;">Luxury Bedrooms</p>
        <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">King beds, premium linens, en-suite bathrooms, ocean views</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #0c4a6e;">Gourmet Kitchen</p>
        <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">Professional appliances, wine storage, espresso machines</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; margin: 12px 0;">
        <p style="margin: 0; font-weight: bold; color: #0c4a6e;">Entertainment</p>
        <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">Smart TVs, streaming services, sound systems, game rooms</p>
      </div>
      
      <h3 style="color: #0c4a6e;">Services Included:</h3>
      <ul style="color: #374151; line-height: 1.8;">
        <li>Daily housekeeping</li>
        <li>24/7 concierge support</li>
        <li>Welcome provisions and amenities</li>
        <li>High-speed WiFi throughout</li>
        <li>Air conditioning in all rooms</li>
        <li>Beach towels and pool accessories</li>
      </ul>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Premium Add-On Services:</strong></p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>Private chef (daily or for special occasions)</li>
          <li>Butler service</li>
          <li>In-villa spa treatments</li>
          <li>Private yacht charters</li>
          <li>Airport transfers and car rental</li>
          <li>Childcare and nanny services</li>
        </ul>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${SITE_URL}/villas" style="${emailStyles.button}">Browse All Villas</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: `Villa Features & Amenities${villaName ? ` - ${villaName}` : ""} | Valar Travel`,
      html: emailWrapper(content, "Discover the luxury features in our Caribbean villa collection"),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending villa features info:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}

// Generic FAQ response email
export async function sendFAQResponse(data: {
  name: string
  email: string
  question: string
  answer: string
  relatedLinks?: { text: string; url: string }[]
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, question, answer, relatedLinks } = data

    const content = `
      <h2 style="${emailStyles.heading}">Answer to Your Question</h2>
      
      <p style="${emailStyles.text}">Hello ${name}, thank you for reaching out!</p>
      
      <div style="${emailStyles.highlight}">
        <p style="margin: 0;"><strong>Your Question:</strong></p>
        <p style="margin: 8px 0 0 0; font-style: italic;">"${question}"</p>
      </div>
      
      <h3 style="color: #0c4a6e;">Answer:</h3>
      <div style="${emailStyles.text}">${answer}</div>
      
      ${
        relatedLinks && relatedLinks.length > 0
          ? `
        <h3 style="color: #0c4a6e;">Helpful Resources:</h3>
        <ul style="color: #374151; line-height: 1.8;">
          ${relatedLinks.map((link) => `<li><a href="${link.url}" style="color: #0ea5e9;">${link.text}</a></li>`).join("")}
        </ul>
      `
          : ""
      }
      
      <p style="${emailStyles.text}">
        Have more questions? I'm always here to help you plan your perfect Caribbean escape.
      </p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/4916092527436" style="${emailStyles.button}">Chat on WhatsApp</a>
      </p>
    `

    await resend.emails.send({
      from: `Sarah at Valar Travel <${COMPANY_EMAIL}>`,
      to: email,
      replyTo: COMPANY_EMAIL,
      subject: "Your Question Answered | Valar Travel",
      html: emailWrapper(content, "We've answered your question about Caribbean villa travel"),
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending FAQ response:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" }
  }
}
