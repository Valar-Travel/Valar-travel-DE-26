import type { Metadata } from "next"
import ContactClientPage from "./client-page"

const CONTACT_EMAIL = "hello@valartravel.de"
const CONTACT_PHONE = "+49 160 92527436"
const WHATSAPP_LINK = "https://wa.me/4916092527436"

export const metadata: Metadata = {
  title: "Contact Us | Book Your Luxury Caribbean Villa | Valar Travel",
  description:
    "Get in touch with Valar Travel's concierge team. Contact Sarah for personalized villa recommendations, property listings, or partnership inquiries. WhatsApp: +49 160 92527436",
  keywords: [
    "contact Valar Travel",
    "luxury villa booking",
    "Caribbean travel concierge",
    "villa inquiry",
    "property listing",
  ],
  openGraph: {
    title: "Contact Valar Travel | Luxury Caribbean Villa Specialists",
    description:
      "Reach our concierge team for personalized villa recommendations and bookings across Barbados, St. Lucia, Jamaica & St. Barthélemy.",
    url: "https://valartravel.de/contact",
  },
  alternates: {
    canonical: "https://valartravel.de/contact",
  },
}

export default function ContactPage() {
  return <ContactClientPage />
}
