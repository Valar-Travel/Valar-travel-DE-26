/**
 * Centralized Type Definitions
 * Common types used across the Valar Travel application
 */

// ============================================
// Property Types
// ============================================

export interface Property {
  id: string
  name: string
  description?: string
  location: string
  price_per_night: number
  bedrooms: number
  bathrooms: number
  max_guests: number
  images: string[]
  amenities: string[]
  rating?: number
  source_url?: string
  created_at?: string
  updated_at?: string
}

export interface LuxuryProperty extends Property {
  currency?: string
  square_footage?: number
  property_type?: string
  featured?: boolean
  views?: number
}

export interface FeaturedVilla {
  id: string
  name: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  guests: number
  image: string
  rating: number
}

export interface Villa {
  id: string
  name: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
  rating: number
  image: string
  amenities?: string[]
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at?: string
}

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  name?: string
  created_at: string
  last_login?: string
}

export type AdminRole = "super_admin" | "admin" | "editor"

export interface AdminSession {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
}

// ============================================
// Booking Types
// ============================================

export interface Booking {
  id: string
  property_id: string
  user_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: BookingStatus
  created_at: string
  updated_at?: string
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface BookingDetails {
  villaId: string
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  guestInfo: {
    name: string
    email: string
    phone: string
  }
}

// ============================================
// Search & Filter Types
// ============================================

export interface SearchFilters {
  destination?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  amenities?: string[]
  sortBy?: SortOption
}

export type SortOption = "price-asc" | "price-desc" | "rating" | "newest" | "featured"

export interface SearchResult {
  properties: Property[]
  total: number
  page: number
  limit: number
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ============================================
// Form Types
// ============================================

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  propertyId?: string
}

export interface NewsletterFormData {
  email: string
  firstName?: string
  preferences?: string[]
}

// ============================================
// Currency Types
// ============================================

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD"

export interface CurrencyRate {
  code: Currency
  rate: number
  symbol: string
}

// ============================================
// Review Types
// ============================================

export interface Review {
  id: string
  property_id: string
  user_id?: string
  author_name: string
  rating: number
  comment: string
  date: string
  verified?: boolean
}

// ============================================
// Image Types
// ============================================

export interface UnsplashImage {
  id: string
  photoId: string
  url: string
  alt: string
  usage: string
}

export interface ImageTransformation {
  width?: number
  height?: number
  quality?: number
  format?: "webp" | "avif" | "jpg" | "png"
  crop?: "fill" | "fit" | "scale"
}

// ============================================
// CRM Types
// ============================================

export interface CustomerProfile {
  id: string
  email: string
  segment: CustomerSegment
  totalBookings: number
  totalSpent: number
  lastActivity?: string
  preferences?: UserPreferences
}

export type CustomerSegment = "prospect" | "engaged" | "loyal" | "vip" | "dormant"

export interface UserPreferences {
  destinations?: string[]
  budgetRange?: BudgetRange
  propertyTypes?: string[]
  amenities?: string[]
}

export type BudgetRange = "budget" | "mid-range" | "luxury" | "ultra-luxury"

// ============================================
// Subscription Types
// ============================================

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_start: string
  current_period_end: string
  stripe_subscription_id?: string
}

export type SubscriptionPlan = "free" | "explorer" | "adventurer" | "connoisseur"
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing"

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp?: string
  userId?: string
  sessionId?: string
}

export interface PageView {
  path: string
  referrer?: string
  timestamp: string
  duration?: number
}

// ============================================
// Rate Limiting Types
// ============================================

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  limit: number
}

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  identifier?: string
}

// ============================================
// Cache Types
// ============================================

export interface CacheOptions {
  ttl?: number
  tags?: string[]
  staleWhileRevalidate?: boolean
}

export interface CachedData<T> {
  data: T
  timestamp: number
  ttl: number
  tags?: string[]
}
