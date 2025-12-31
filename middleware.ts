import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  const finalResponse = response || NextResponse.next()

  // Disable caching in development for pages and API routes
  if (process.env.NODE_ENV === "development") {
    finalResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    finalResponse.headers.set("Pragma", "no-cache")
    finalResponse.headers.set("Expires", "0")
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    finalResponse.headers.set("X-RateLimit-Limit", "100")
    finalResponse.headers.set("X-RateLimit-Remaining", "99")
  }

  return finalResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
