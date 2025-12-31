import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/auth/", "/_next/", "/private/", "/scripts/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/_next/", "/private/", "/scripts/"],
      },
    ],
    sitemap: "https://valartravel.de/sitemap.xml",
    host: "https://valartravel.de",
  }
}
