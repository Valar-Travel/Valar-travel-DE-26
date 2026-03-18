import { emailStyles, EMAIL_CONFIG } from "./base"

const { COMPANY_EMAIL, SUPPORT_PHONE, SITE_URL } = EMAIL_CONFIG

export function welcomeContent(name?: string): string {
  const greeting = name ? `Dear ${name}` : "Welcome"
  return `<h2 style="${emailStyles.heading}">${greeting}, welcome to Valar Travel!</h2><p style="${emailStyles.text}">Thank you for joining our exclusive community of luxury Caribbean villa enthusiasts. You're now part of a select group who receives first access to our most exceptional properties.</p><div style="${emailStyles.highlight}"><strong style="color: #0c4a6e;">What to expect:</strong><ul style="color: #374151; margin: 10px 0 0 0; padding-left: 20px;"><li>Exclusive villa listings before they go public</li><li>Insider tips for Caribbean travel</li><li>Special offers and seasonal deals</li><li>Curated destination guides</li></ul></div><p style="${emailStyles.text}">Our destinations include <strong>Barbados, St. Lucia, Jamaica, and St. Barthélemy</strong> - each offering unique luxury experiences from beachfront estates to hillside retreats.</p><p style="text-align: center; margin: 30px 0;"><a href="${SITE_URL}/villas" style="${emailStyles.button}">Browse Our Villas</a></p><p style="${emailStyles.text}">Have a specific villa in mind or need personalized recommendations? I'm always happy to help you find your perfect Caribbean escape.</p>`
}

export function contactNotificationContent(data: { name: string; email: string; phone?: string; subject?: string; message: string; inquiryType?: string }): string {
  return `<h2 style="${emailStyles.heading}">New Contact Form Submission</h2><div style="${emailStyles.highlight}"><p style="margin: 0;"><strong>From:</strong> ${data.name}</p><p style="margin: 8px 0 0 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #0ea5e9;">${data.email}</a></p>${data.phone ? `<p style="margin: 8px 0 0 0;"><strong>Phone:</strong> <a href="tel:${data.phone}" style="color: #0ea5e9;">${data.phone}</a></p>` : ""}${data.inquiryType ? `<p style="margin: 8px 0 0 0;"><strong>Inquiry Type:</strong> ${data.inquiryType}</p>` : ""}${data.subject ? `<p style="margin: 8px 0 0 0;"><strong>Subject:</strong> ${data.subject}</p>` : ""}</div><h3 style="color: #0c4a6e; margin-top: 24px;">Message:</h3><div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;"><p style="${emailStyles.text}; margin: 0; white-space: pre-wrap;">${data.message}</p></div><p style="text-align: center; margin: 30px 0;"><a href="mailto:${data.email}?subject=Re: ${data.subject || "Your Valar Travel Inquiry"}" style="${emailStyles.button}">Reply to ${data.name}</a></p>`
}

export function contactAutoReplyContent(data: { name: string; message: string }): string {
  return `<h2 style="${emailStyles.heading}">Thank you for contacting Valar Travel, ${data.name}!</h2><p style="${emailStyles.text}">I've received your message and will personally respond within 24 hours. For urgent inquiries, please don't hesitate to reach me directly via WhatsApp.</p><div style="${emailStyles.highlight}"><p style="margin: 0;"><strong>Quick Contact:</strong></p><p style="margin: 8px 0 0 0;">WhatsApp: <a href="https://wa.me/4916092527436" style="color: #0ea5e9;">${SUPPORT_PHONE}</a></p><p style="margin: 8px 0 0 0;">Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #0ea5e9;">${COMPANY_EMAIL}</a></p></div><h3 style="color: #0c4a6e; margin-top: 24px;">Your Message:</h3><div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 12px;"><p style="${emailStyles.text}; margin: 0; white-space: pre-wrap;">${data.message}</p></div><p style="${emailStyles.text}">While you wait, feel free to explore our curated collection of luxury Caribbean villas:</p><p style="text-align: center; margin: 30px 0;"><a href="${SITE_URL}/villas" style="${emailStyles.button}">Browse Villas</a></p>`
}

export function bookingInquiryContent(data: { name: string; villaName?: string; destination?: string; dates?: { checkIn?: string; checkOut?: string } }): string {
  const datesSection = (data.dates?.checkIn || data.dates?.checkOut) ? `<div style="${emailStyles.highlight}"><p style="margin: 0;"><strong>Requested Dates:</strong></p>${data.dates.checkIn ? `<p style="margin: 8px 0 0 0;">Check-in: ${data.dates.checkIn}</p>` : ""}${data.dates.checkOut ? `<p style="margin: 8px 0 0 0;">Check-out: ${data.dates.checkOut}</p>` : ""}</div>` : ""
  return `<h2 style="${emailStyles.heading}">Thank you for your booking inquiry, ${data.name}!</h2><p style="${emailStyles.text}">I'm excited to help you plan your Caribbean escape${data.villaName ? ` at <strong>${data.villaName}</strong>` : ""}${data.destination ? ` in <strong>${data.destination}</strong>` : ""}.</p>${datesSection}<h3 style="color: #0c4a6e;">What happens next?</h3><ol style="color: #374151; line-height: 1.8;"><li><strong>Availability Check:</strong> I'll verify the property's availability for your dates</li><li><strong>Personalized Quote:</strong> You'll receive a detailed breakdown including any seasonal pricing</li><li><strong>Villa Details:</strong> I'll share additional photos, floor plans, and local recommendations</li><li><strong>Easy Booking:</strong> Once confirmed, I'll guide you through our simple reservation process</li></ol><div style="${emailStyles.highlight}"><p style="margin: 0;"><strong>Our Booking Benefits:</strong></p><ul style="margin: 10px 0 0 0; padding-left: 20px;"><li>Best price guarantee</li><li>Flexible cancellation options</li><li>24/7 concierge support during your stay</li><li>Complimentary airport transfers (select properties)</li><li>Local restaurant and activity recommendations</li></ul></div><p style="${emailStyles.text}">I typically respond within 2-4 hours during business hours. For immediate assistance, please reach me via WhatsApp at <a href="https://wa.me/4916092527436" style="color: #0ea5e9;">${SUPPORT_PHONE}</a>.</p><p style="text-align: center; margin: 30px 0;"><a href="https://wa.me/4916092527436" style="${emailStyles.button}">Chat on WhatsApp</a></p>`
}

export const DESTINATION_INFO: Record<string, { name: string; highlights: string[]; bestFor: string; bestTime: string }> = {
  barbados: {
    name: "Barbados",
    highlights: ["Pristine west coast beaches with calm, crystal-clear waters", "World-class dining and vibrant nightlife in Holetown", "Historic plantation houses and rum distillery tours", "Excellent golf courses and water sports"],
    bestFor: "Couples, families, and those seeking a blend of relaxation and culture",
    bestTime: "December to April (dry season), though beautiful year-round",
  },
  "st-lucia": {
    name: "St. Lucia",
    highlights: ["Iconic Pitons rising from the Caribbean Sea", "Natural volcanic hot springs and mud baths", "Lush rainforest with hiking and zip-lining", "Secluded beaches and world-renowned resorts"],
    bestFor: "Romantic getaways, adventure seekers, and nature lovers",
    bestTime: "January to April, avoiding the rainy season",
  },
  jamaica: {
    name: "Jamaica",
    highlights: ["Legendary beaches from Negril to Montego Bay", "Rich musical heritage and vibrant local culture", "Blue Mountain coffee plantations and waterfalls", "Exceptional jerk cuisine and rum experiences"],
    bestFor: "Culture enthusiasts, beach lovers, and adventure travelers",
    bestTime: "November to mid-December for fewer crowds and great weather",
  },
  "st-barthelemy": {
    name: "St. Barthélemy",
    highlights: ["French-Caribbean elegance and duty-free shopping", "14 pristine beaches, each with unique character", "Michelin-starred restaurants and celebrity hotspots", "Exclusive villas with stunning ocean views"],
    bestFor: "Luxury travelers, couples, and those seeking privacy and exclusivity",
    bestTime: "December to May for optimal weather and social season",
  },
}

export function destinationInfoContent(data: { name: string; destination: string }): string {
  const info = DESTINATION_INFO[data.destination]
  if (!info) return ""
  return `<h2 style="${emailStyles.heading}">Discover ${info.name}, ${data.name}!</h2><p style="${emailStyles.text}">Thank you for your interest in ${info.name}. It's one of my favorite Caribbean destinations, and I'd love to help you experience its magic.</p><h3 style="color: #0c4a6e;">Destination Highlights:</h3><ul style="color: #374151; line-height: 1.8;">${info.highlights.map(h => `<li>${h}</li>`).join("")}</ul><div style="${emailStyles.highlight}"><p style="margin: 0;"><strong>Best For:</strong> ${info.bestFor}</p><p style="margin: 12px 0 0 0;"><strong>Best Time to Visit:</strong> ${info.bestTime}</p></div><h3 style="color: #0c4a6e;">Our ${info.name} Villa Collection:</h3><p style="${emailStyles.text}">We've handpicked the finest luxury villas in ${info.name}, from beachfront estates to hillside retreats with panoramic views. Each property comes with:</p><ul style="color: #374151; line-height: 1.8;"><li>Private pools and tropical gardens</li><li>Fully equipped gourmet kitchens</li><li>Dedicated concierge services</li><li>Optional private chef and butler</li></ul><p style="text-align: center; margin: 30px 0;"><a href="${SITE_URL}/destinations/${data.destination}" style="${emailStyles.button}">Explore ${info.name} Villas</a></p><p style="${emailStyles.text}">Ready to start planning? Reply to this email or message me on WhatsApp - I'll help you find the perfect villa for your ${info.name} adventure.</p>`
}
