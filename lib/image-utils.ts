/**
 * Image utility functions for consistent image handling
 */

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [400, 800, 1200, 1600]): string {
  return sizes
    .map((size) => {
      const url = new URL(baseUrl)
      url.searchParams.set("w", size.toString())
      return `${url.toString()} ${size}w`
    })
    .join(", ")
}

/**
 * Get optimized image URL with parameters
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    fit?: "crop" | "max" | "scale"
  } = {},
): string {
  const { width, height, quality = 80, fit = "crop" } = options

  const imageUrl = new URL(url)

  if (width) imageUrl.searchParams.set("w", width.toString())
  if (height) imageUrl.searchParams.set("h", height.toString())
  imageUrl.searchParams.set("q", quality.toString())
  imageUrl.searchParams.set("fit", fit)
  imageUrl.searchParams.set("auto", "format")

  return imageUrl.toString()
}
