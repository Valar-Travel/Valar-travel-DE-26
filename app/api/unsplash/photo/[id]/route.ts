import { type NextRequest, NextResponse } from "next/server"
import { getUnsplashPhotoById, formatUnsplashUrl } from "@/lib/unsplash-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 })
    }

    const photo = await getUnsplashPhotoById(id)

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 })
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
      exif: photo.exif,
      location: photo.location,
      downloads: photo.downloads,
      likes: photo.likes,
    }

    return NextResponse.json(formattedPhoto)
  } catch (error) {
    console.error("Error in Unsplash photo API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
