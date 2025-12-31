import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({
      lat: 48.8566,
      lng: 2.3522,
      note: "Using default coordinates",
    })
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    )

    const data = await response.json()

    if (data.status === "OK" && data.results[0]) {
      const location = data.results[0].geometry.location
      return NextResponse.json({
        lat: location.lat,
        lng: location.lng,
        formatted_address: data.results[0].formatted_address,
      })
    }

    return NextResponse.json({
      lat: 48.8566,
      lng: 2.3522,
      note: "Geocoding failed, using defaults",
    })
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({
      lat: 48.8566,
      lng: 2.3522,
      note: "Error occurred, using defaults",
    })
  }
}
