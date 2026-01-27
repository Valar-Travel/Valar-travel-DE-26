import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute) {
    console.log("[v0] Admin route detected, bypassing Supabase:", request.nextUrl.pathname)
    return NextResponse.next({ request })
  }

  const bypassAuth = process.env.BYPASS_AUTH === "true"

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are missing, skip Supabase operations
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const placeholderPatterns = [
    "your_supabase_project_url",
    "your-supabase-project-url",
    "placeholder",
    "example.com",
    "localhost",
    "your_project_url",
  ]

  if (placeholderPatterns.some((pattern) => supabaseUrl.toLowerCase().includes(pattern.toLowerCase()))) {
    return supabaseResponse
  }

  try {
    const url = new URL(supabaseUrl)
    if (!url.hostname.includes("supabase.co") && !url.hostname.includes("supabase.com")) {
      return supabaseResponse
    }
  } catch (error) {
    return supabaseResponse
  }

  const keyPlaceholderPatterns = ["your_supabase_anon_key", "your-supabase-anon-key", "placeholder", "example_key"]

  if (keyPlaceholderPatterns.some((pattern) => supabaseAnonKey.toLowerCase().includes(pattern.toLowerCase()))) {
    return supabaseResponse
  }

  let supabase
  try {
    supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })
  } catch (error) {
    return supabaseResponse
  }

  try {
    await supabase.auth.getUser()
  } catch (error) {
    // Continue without authentication if there's an error
  }

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (
      !user &&
      !bypassAuth &&
      (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/onboarding"))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  } catch (error) {
    // Continue without authentication if there's an error
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse
}
