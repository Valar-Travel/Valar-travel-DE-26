import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const ADMIN_SESSION_COOKIE = "valar_admin_session"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  const finalResponse = response || NextResponse.next()
  const { pathname } = request.nextUrl

  // Admin route protection
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value

    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect logged-in admin users away from login page
  if (pathname === "/admin/login") {
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
    if (sessionToken) {
      const adminUrl = new URL("/admin", request.url)
      return NextResponse.redirect(adminUrl)
    }
  }

  // Add noindex headers for admin routes
  if (pathname.startsWith("/admin")) {
    finalResponse.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive")
  }

  // Disable caching in development for pages and API routes
  if (process.env.NODE_ENV === "development") {
    finalResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
    finalResponse.headers.set("Pragma", "no-cache")
    finalResponse.headers.set("Expires", "0")
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    finalResponse.headers.set("X-RateLimit-Limit", "100")
    finalResponse.headers.set("X-RateLimit-Remaining", "99")
  }

  return finalResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
