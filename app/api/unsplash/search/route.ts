import { type NextRequest, NextResponse } from "next/server"
import { searchUnsplashPhotos, formatUnsplashUrl } from "@/lib/unsplash-api"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("perPage") || "10")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const result = await searchUnsplashPhotos(query, page, perPage)

    if (!result) {
      return NextResponse.json({ error: "Failed to fetch photos from Unsplash" }, { status: 500 })
    }

    // Format the response with optimized URLs
    const photos = result.results.map((photo) => ({
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
    }))

    return NextResponse.json({
      results: photos,
      total: result.total,
      total_pages: result.total_pages,
    })
  } catch (error) {
    console.error("Error in Unsplash search API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
