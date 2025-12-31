// Cloudinary utility for uploading and hosting property images
// Uses lazy loading to prevent build-time initialization errors

let cloudinaryInstance: any = null

async function getCloudinary() {
  if (!cloudinaryInstance) {
    const { v2: cloudinary } = await import("cloudinary")

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    cloudinaryInstance = cloudinary
  }
  return cloudinaryInstance
}

export async function uploadImageFromUrl(imageUrl: string, propertySlug: string): Promise<string> {
  try {
    const cloudinary = await getCloudinary()

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `valar-travel/properties/${propertySlug}`,
      transformation: [{ width: 1200, height: 800, crop: "limit" }, { quality: "auto:good" }, { fetch_format: "auto" }],
    })

    return result.secure_url
  } catch (error) {
    console.error("[v0] Cloudinary upload error:", error)
    throw error
  }
}

export async function uploadMultipleImages(imageUrls: string[], propertySlug: string): Promise<string[]> {
  const uploadPromises = imageUrls.map((url) => uploadImageFromUrl(url, propertySlug))
  const results = await Promise.allSettled(uploadPromises)

  return results
    .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
    .map((result) => result.value)
}
