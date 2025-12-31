// Input validation and sanitization utilities

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .slice(0, 1000) // Limit length
}

export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

export function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "") // Remove event handlers
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export function validateContactForm(data: any): {
  isValid: boolean
  errors: string[]
  sanitized?: ContactFormData
} {
  const errors: string[] = []

  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required")
  } else if (data.name.length < 2 || data.name.length > 100) {
    errors.push("Name must be between 2 and 100 characters")
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required")
  } else if (!isValidEmail(data.email)) {
    errors.push("Invalid email address")
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push("Invalid phone number")
  }

  if (!data.message || typeof data.message !== "string") {
    errors.push("Message is required")
  } else if (data.message.length < 10 || data.message.length > 5000) {
    errors.push("Message must be between 10 and 5000 characters")
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    errors: [],
    sanitized: {
      name: sanitizeString(data.name),
      email: data.email.toLowerCase().trim(),
      phone: data.phone ? sanitizeString(data.phone) : undefined,
      message: sanitizeString(data.message),
    },
  }
}
