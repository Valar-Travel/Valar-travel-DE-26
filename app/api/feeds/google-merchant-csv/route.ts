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
  if (loc.includes("st. barth") || loc.includes("saint barth")) return "St. Barthelemy"
  if (loc.includes("st. maarten") || loc.includes("saint maarten")) return "St. Maarten"
  if (loc.includes("antigua")) return "Antigua"
  return "Caribbean"
}

function escapeCsv(str: string): string {
  if (!str) return ""
  // If contains comma, newline, or quote, wrap in quotes and escape quotes
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
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
      console.error("[Google Merchant CSV] Database error:", error.message)
      return new NextResponse("Error fetching properties", { status: 500 })
    }

    if (!properties || properties.length === 0) {
      return new NextResponse("No properties found", { status: 404 })
    }

    // CSV Headers (Google Merchant Center required fields)
    const headers = [
      "id",
      "title",
      "description",
      "link",
      "image_link",
      "additional_image_link",
      "availability",
      "price",
      "brand",
      "condition",
      "product_type",
      "google_product_category",
      "custom_label_0",
      "custom_label_1",
      "custom_label_2",
      "custom_label_3",
      "custom_label_4",
      "identifier_exists",
      "shipping",
    ]

    let csv = headers.join(",") + "\n"

    for (const property of properties) {
      const id = property.id
      const name = truncate(property.name || "Luxury Villa", 150)
      const description = truncate(property.description || "Beautiful luxury villa rental in the Caribbean", 5000)
      const location = property.location || "Caribbean"
      const destination = getDestinationFromLocation(location)
      const price = property.price_per_night || 1000
      const currency = property.currency || "USD"
      const images = property.images || []
      const mainImage = images[0] || "/images/destinations/caribbean-villa.jpg"
      const imageUrl = mainImage.startsWith("http") ? mainImage : `${SITE_URL}${mainImage}`
      const additionalImages = images.slice(1, 10).map((img: string) => 
        img.startsWith("http") ? img : `${SITE_URL}${img}`
      ).join(",")
      const bedrooms = property.bedrooms || 4
      const amenities = property.amenities || []
      const rating = property.rating || 4.5

      const productType = `Travel > Vacation Rentals > ${destination} > Villas`
      const customLabel0 = destination
      const customLabel1 = price >= 2000 ? "Ultra Luxury" : price >= 1000 ? "Luxury" : "Premium"
      const customLabel2 = `${bedrooms} Bedrooms`
      const customLabel3 = amenities.includes("pool") ? "Private Pool" : "No Pool"
      const customLabel4 = rating >= 4.8 ? "Top Rated" : rating >= 4.5 ? "Highly Rated" : "Rated"

      const row = [
        escapeCsv(id),
        escapeCsv(name),
        escapeCsv(description),
        escapeCsv(`${SITE_URL}/villas/${id}`),
        escapeCsv(imageUrl),
        escapeCsv(additionalImages),
        "in_stock",
        escapeCsv(`${price} ${currency}`),
        escapeCsv(BRAND),
        "new",
        escapeCsv(productType),
        escapeCsv("Hotels & Accommodations"),
        escapeCsv(customLabel0),
        escapeCsv(customLabel1),
        escapeCsv(customLabel2),
        escapeCsv(customLabel3),
        escapeCsv(customLabel4),
        "false",
        "DE::0 EUR", // No shipping - service/accommodation
      ]

      csv += row.join(",") + "\n"
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=valar-travel-products.csv",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("[Google Merchant CSV] Error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
