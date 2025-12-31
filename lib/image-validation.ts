// Utility to validate and filter out broken/inaccessible images

// Client-side image validation - checks if image loads successfully
export function validateImageClient(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!src || src === "" || src === "undefined" || src === "null") {
      resolve(false)
      return
    }

    const img = new window.Image()
    img.crossOrigin = "anonymous"

    const timeout = setTimeout(() => {
      resolve(false)
    }, 5000) // 5 second timeout

    img.onload = () => {
      clearTimeout(timeout)
      // Check if image has actual dimensions
      resolve(img.naturalWidth > 0 && img.naturalHeight > 0)
    }

    img.onerror = () => {
      clearTimeout(timeout)
      resolve(false)
    }

    img.src = src
  })
}

// Filter out invalid image URLs synchronously (basic checks)
export function filterInvalidImageUrls(images: string[]): string[] {
  if (!images || !Array.isArray(images)) return []

  return images.filter((img) => {
    if (!img || typeof img !== "string") return false
    if (img.trim() === "") return false
    if (img === "undefined" || img === "null") return false

    // Filter out obvious non-image URLs
    if (img.includes("favicon")) return false
    if (img.includes("logo") && img.length < 50) return false
    if (img.includes("icon") && !img.includes("iconography")) return false
    if (img.includes("spinner") || img.includes("loading")) return false
    if (img.includes("placeholder.svg") && !img.includes("query=")) return false

    // Must have a valid image extension or be from known image hosts
    const validExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]
    const knownImageHosts = [
      "images.unsplash.com",
      "cloudinary.com",
      "imagekit.io",
      "imgix.net",
      "supabase.co/storage",
      "vercel-storage.com",
      "cdn.",
      "res.cloudinary.com",
    ]

    const hasValidExtension = validExtensions.some((ext) => img.toLowerCase().includes(ext))
    const isFromKnownHost = knownImageHosts.some((host) => img.toLowerCase().includes(host))

    return hasValidExtension || isFromKnownHost || img.startsWith("/")
  })
}

// Async function to validate images by actually loading them
export async function validateImages(images: string[]): Promise<string[]> {
  const filtered = filterInvalidImageUrls(images)

  const validationResults = await Promise.all(
    filtered.map(async (img) => ({
      src: img,
      valid: await validateImageClient(img),
    })),
  )

  return validationResults.filter((result) => result.valid).map((result) => result.src)
}
