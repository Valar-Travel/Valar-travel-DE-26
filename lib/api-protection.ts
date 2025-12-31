// Comprehensive API route protection utilities

import { rateLimitByIP, getClientIP } from "./ip-rate-limiter"
import { addSecurityHeaders } from "./security-headers"

interface ProtectionOptions {
  requireAuth?: boolean
  rateLimit?: string // endpoint type for rate limiting
  allowedMethods?: string[]
}

interface ProtectionResult {
  allowed: boolean
  response?: Response
  ip?: string
}

export async function protectAPIRoute(request: Request, options: ProtectionOptions = {}): Promise<ProtectionResult> {
  const { requireAuth = false, rateLimit, allowedMethods = ["GET", "POST"] } = options

  // Check HTTP method
  if (!allowedMethods.includes(request.method)) {
    return {
      allowed: false,
      response: new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          Allow: allowedMethods.join(", "),
        },
      }),
    }
  }

  // Get client IP
  const ip = getClientIP(request)

  // Rate limiting
  if (rateLimit) {
    const rateLimitResult = await rateLimitByIP(ip, rateLimit)

    if (!rateLimitResult.success) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            error: "Too many requests",
            resetTime: rateLimitResult.resetTime,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": rateLimitResult.limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
              "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            },
          },
        ),
      }
    }
  }

  // Authentication check (if required)
  if (requireAuth) {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        allowed: false,
        response: new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      }
    }
  }

  return { allowed: true, ip }
}

export function createAPIResponse(data: any, status = 200, headers: HeadersInit = {}): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  })

  return addSecurityHeaders(response)
}
