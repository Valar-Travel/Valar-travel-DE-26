import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * Validates that a redirect path is safe (local, not an external URL)
 * @param path The path to validate
 * @returns true if the path is a safe local redirect
 */
function isValidRedirectPath(path: string): boolean {
  if (!path) return false
  
  // Must start with /
  if (!path.startsWith("/")) return false
  
  // Must not start with // (protocol-relative URL)
  if (path.startsWith("//")) return false
  
  // Must not contain :// (protocol indicator)
  if (path.includes("://")) return false
  
  // Additional check: ensure no backslash escapes
  if (path.includes("\\")) return false
  
  return true
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const nextParam = searchParams.get("next") ?? "/dashboard"

  // Validate the redirect path to prevent open redirects
  if (!isValidRedirectPath(nextParam)) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Always use origin for redirects. Do NOT trust x-forwarded-host header
      // as it can be spoofed. The origin is derived from the request URL which
      // is server-side verified by Next.js
      return NextResponse.redirect(`${origin}${nextParam}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}

export default function Page() {
  return null
}
