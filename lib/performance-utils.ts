export const preloadCriticalResources = () => {
  if (typeof window !== "undefined") {
    // Preload critical fonts
    const fontLink = document.createElement("link")
    fontLink.rel = "preload"
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    fontLink.as = "style"
    document.head.appendChild(fontLink)

    // Preload critical images
    const heroImage = new Image()
    heroImage.src = "/luxury-hero-image.jpg"
  }
}

export const lazyLoadImages = () => {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ""
          img.classList.remove("lazy")
          observer.unobserve(img)
        }
      })
    })

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

export const optimizeForCoreWebVitals = () => {
  // Optimize Largest Contentful Paint (LCP)
  if (typeof window !== "undefined") {
    // Preload hero images
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = "/luxury-hero-image.jpg"
    document.head.appendChild(link)
  }
}

export const generateImageSrcSet = (baseUrl: string, sizes: number[] = [400, 800, 1200, 1600]) => {
  return sizes.map((size) => `${baseUrl}?w=${size} ${size}w`).join(", ")
}

export const getOptimizedImageUrl = (url: string, width: number, quality = 85) => {
  if (url.includes("placeholder.svg")) return url

  // Add optimization parameters for external images
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}w=${width}&q=${quality}&auto=format,compress`
}
