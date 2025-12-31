import { type NextRequest, NextResponse } from "next/server"
import { getRandomUnsplashPhoto, formatUnsplashUrl } from "@/lib/unsplash-api"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const orientation = (searchParams.get("orientation") as "landscape" | "portrait" | "squarish") || "landscape"

    const photo = await getRandomUnsplashPhoto(query || undefined, orientation)

    if (!photo) {
      return NextResponse.json({ error: "Failed to fetch random photo from Unsplash" }, { status: 500 })
    }

    // Format the response with optimized URLs
    const formattedPhoto = {
      id: photo.id,
      description: photo.description || photo.alt_description,
      urls: {
        raw: photo.urls.raw,
        full: photo.urls.full,
        regular: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
        optimized: formatUnsplashUrl(photo.urls.raw, { width: 800, quality: 80 }),
      },
      user: {
        name: photo.user.name,
        username: photo.user.username,
        portfolio_url: photo.user.portfolio_url,
      },
      links: {
        download_location: photo.links.download_location,
      },
    }

    return NextResponse.json(formattedPhoto)
  } catch (error) {
    console.error("Error in Unsplash random API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
