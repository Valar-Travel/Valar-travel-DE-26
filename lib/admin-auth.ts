import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"

export type AdminRole = "super_admin" | "admin" | "editor"

export interface AdminUser {
  id: string
  email: string
  name: string
  role: AdminRole
  is_active: boolean
  created_at: string
  last_login?: string
}

export interface AdminSession {
  id: string
  admin_user_id: string
  token: string
  expires_at: string
  ip_address?: string
  user_agent?: string
}

const SESSION_COOKIE_NAME = "valar_admin_session"
const SESSION_DURATION_HOURS = 24

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create admin session
export async function createAdminSession(
  adminUserId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<string> {
  const supabase = createAdminClient()
  const token = generateToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000)

  // Delete any existing sessions for this user (single session)
  await supabase.from("admin_sessions").delete().eq("admin_user_id", adminUserId)

  // Create new session
  const { error } = await supabase.from("admin_sessions").insert({
    admin_user_id: adminUserId,
    token,
    expires_at: expiresAt.toISOString(),
    ip_address: ipAddress,
    user_agent: userAgent,
  })

  if (error) {
    console.error("Failed to create admin session:", error)
    throw new Error("Failed to create session")
  }

  // Update last login
  await supabase
    .from("admin_users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", adminUserId)

  return token
}

// Validate admin session and get user
export async function validateAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  const supabase = createAdminClient()

  // Get session with user
  const { data: session, error } = await supabase
    .from("admin_sessions")
    .select(`
      *,
      admin_users (*)
    `)
    .eq("token", sessionToken)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (error || !session || !session.admin_users) {
    return null
  }

  const user = session.admin_users as AdminUser

  // Check if user is still active
  if (!user.is_active) {
    return null
  }

  return user
}

// Get admin user (throws redirect if not authenticated)
export async function requireAdminAuth(allowedRoles?: AdminRole[]): Promise<AdminUser> {
  const user = await validateAdminSession()

  if (!user) {
    redirect("/admin/login")
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/admin?error=unauthorized")
  }

  return user
}

// Login admin user
export async function loginAdmin(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const supabase = createAdminClient()

  // Find user by email
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email.toLowerCase())
    .eq("is_active", true)
    .single()

  if (error || !user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    return { success: false, error: "Invalid email or password" }
  }

  // Create session
  try {
    const token = await createAdminSession(user.id, ipAddress, userAgent)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_HOURS * 60 * 60,
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        last_login: user.last_login,
      },
    }
  } catch {
    return { success: false, error: "Failed to create session" }
  }
}

// Logout admin user
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionToken) {
    const supabase = createAdminClient()
    await supabase.from("admin_sessions").delete().eq("token", sessionToken)
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Check if user has required role
export function hasRole(user: AdminUser, requiredRoles: AdminRole[]): boolean {
  return requiredRoles.includes(user.role)
}

// Role hierarchy check
export function canManageRole(managerRole: AdminRole, targetRole: AdminRole): boolean {
  const roleHierarchy: Record<AdminRole, number> = {
    super_admin: 3,
    admin: 2,
    editor: 1,
  }
  return roleHierarchy[managerRole] > roleHierarchy[targetRole]
}
