import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imageUrl = searchParams.get("url")

  if (!imageUrl) {
    return new NextResponse("Missing image URL", { status: 400 })
  }

  try {
    const decodedUrl = decodeURIComponent(imageUrl)

    // Validate URL
    if (!decodedUrl.startsWith("http")) {
      return new NextResponse("Invalid image URL", { status: 400 })
    }

    console.log("[v0] Proxying original image without CDN optimization")

    // Fetch the original image
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ValarTravel/1.0)",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("content-type") || "image/jpeg"

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Image proxy error:", error)

    // Return a fallback image or error response
    return new NextResponse("Image not found", {
      status: 404,
      headers: {
        "Cache-Control": "public, max-age=300", // Cache errors for 5 minutes
      },
    })
  }
}
