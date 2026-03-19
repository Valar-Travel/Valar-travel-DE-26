import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SITE_URL = "https://valartravel.de"
const BRAND = "Valar Travel"

// Create Supabase client directly for API routes
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables not configured")
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

function getDestinationFromLocation(location: string): string {
  const loc = location?.toLowerCase() || ""
  if (loc.includes("barbados")) return "Barbados"
  if (loc.includes("jamaica")) return "Jamaica"
  if (loc.includes("st. lucia") || loc.includes("saint lucia")) return "St. Lucia"
  if (loc.includes("st. barth") || loc.includes("saint barth")) return "St. Barthélemy"
  if (loc.includes("st. maarten") || loc.includes("saint maarten")) return "St. Maarten"
  if (loc.includes("antigua")) return "Antigua"
  return "Caribbean"
}

function escapeXml(str: string): string {
  if (!str) return ""
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function truncate(str: string, maxLength: number): string {
  if (!str) return ""
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + "..."
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { data: properties, error } = await supabase
      .from("scraped_luxury_properties")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Google Merchant Feed] Database error:", error.message)
      return new NextResponse("Error fetching properties", { status: 500 })
    }

    if (!properties || properties.length === 0) {
      return new NextResponse("No properties found", { status: 404 })
    }

    // Build XML feed
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
  <title>${escapeXml(BRAND)} - Luxury Villa Rentals</title>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>${escapeXml(BRAND)}</name>
  </author>
  <id>${SITE_URL}</id>
`

    for (const property of properties) {
      const id = property.id
      const name = escapeXml(property.name || "Luxury Villa")
      const description = escapeXml(truncate(property.description || "Beautiful luxury villa rental in the Caribbean", 5000))
      const location = property.location || "Caribbean"
      const destination = getDestinationFromLocation(location)
      const price = property.price_per_night || 1000
      const currency = property.currency || "USD"
      const images = property.images || []
      const mainImage = images[0] || "/images/destinations/caribbean-villa.jpg"
      const imageUrl = mainImage.startsWith("http") ? mainImage : `${SITE_URL}${mainImage}`
      const bedrooms = property.bedrooms || 4
      const bathrooms = property.bathrooms || 4
      const guests = bedrooms * 2
      const amenities = property.amenities || []
      const rating = property.rating || 4.5
      const updatedAt = property.updated_at || property.created_at || new Date().toISOString()

      // Product type for vacation rentals
      const productType = `Travel > Vacation Rentals > ${destination} > Villas`
      
      // Custom labels for filtering in Merchant Center
      const customLabel0 = destination // Location
      const customLabel1 = price >= 2000 ? "Ultra Luxury" : price >= 1000 ? "Luxury" : "Premium"
      const customLabel2 = `${bedrooms} Bedrooms`
      const customLabel3 = amenities.includes("pool") ? "Private Pool" : "No Pool"
      const customLabel4 = rating >= 4.8 ? "Top Rated" : rating >= 4.5 ? "Highly Rated" : "Rated"

      xml += `
  <entry>
    <g:id>${escapeXml(id)}</g:id>
    <g:title>${escapeXml(truncate(name, 150))}</g:title>
    <g:description>${description}</g:description>
    <g:link>${SITE_URL}/villas/${id}</g:link>
    <g:image_link>${escapeXml(imageUrl)}</g:image_link>
${images.slice(1, 10).map((img: string) => {
  const url = img.startsWith("http") ? img : `${SITE_URL}${img}`
  return `    <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`
}).join("\n")}
    <g:availability>in_stock</g:availability>
    <g:price>${price} ${currency}</g:price>
    <g:brand>${escapeXml(BRAND)}</g:brand>
    <g:condition>new</g:condition>
    <g:product_type>${escapeXml(productType)}</g:product_type>
    <g:google_product_category>Hotels &amp; Accommodations</g:google_product_category>
    <g:custom_label_0>${escapeXml(customLabel0)}</g:custom_label_0>
    <g:custom_label_1>${escapeXml(customLabel1)}</g:custom_label_1>
    <g:custom_label_2>${escapeXml(customLabel2)}</g:custom_label_2>
    <g:custom_label_3>${escapeXml(customLabel3)}</g:custom_label_3>
    <g:custom_label_4>${escapeXml(customLabel4)}</g:custom_label_4>
    <g:identifier_exists>false</g:identifier_exists>
    <updated>${updatedAt}</updated>
  </entry>`
    }

    xml += `
</feed>`

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[Google Merchant Feed] Error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
