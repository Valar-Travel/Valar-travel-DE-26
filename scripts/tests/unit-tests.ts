/**
 * Unit Tests for Valar Travel
 * Tests for utility functions, validation, and core logic
 */

// =============================================================================
// TEST FRAMEWORK (Simple, no external dependencies)
// =============================================================================

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

interface TestSuite {
  name: string
  tests: TestResult[]
  passed: number
  failed: number
  duration: number
}

const suites: TestSuite[] = []
let currentSuite: TestSuite | null = null

export function describe(name: string, fn: () => void | Promise<void>) {
  currentSuite = { name, tests: [], passed: 0, failed: 0, duration: 0 }
  const start = Date.now()
  
  try {
    const result = fn()
    if (result instanceof Promise) {
      return result.then(() => {
        currentSuite!.duration = Date.now() - start
        suites.push(currentSuite!)
        currentSuite = null
      })
    }
  } catch (e) {
    // Suite setup error
  }
  
  currentSuite.duration = Date.now() - start
  suites.push(currentSuite)
  currentSuite = null
}

export function test(name: string, fn: () => void | Promise<void>) {
  if (!currentSuite) return
  
  const start = Date.now()
  const result: TestResult = { name, passed: false, duration: 0 }
  
  try {
    const testResult = fn()
    if (testResult instanceof Promise) {
      return testResult
        .then(() => {
          result.passed = true
          result.duration = Date.now() - start
          currentSuite!.tests.push(result)
          currentSuite!.passed++
        })
        .catch((e: Error) => {
          result.passed = false
          result.error = e.message
          result.duration = Date.now() - start
          currentSuite!.tests.push(result)
          currentSuite!.failed++
        })
    }
    result.passed = true
  } catch (e) {
    result.passed = false
    result.error = e instanceof Error ? e.message : String(e)
    currentSuite!.failed++
  }
  
  result.duration = Date.now() - start
  currentSuite!.tests.push(result)
  if (result.passed) currentSuite!.passed++
}

export function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`)
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, got ${JSON.stringify(actual)}`)
      }
    },
    toContain(expected: string) {
      if (typeof actual !== 'string' || !actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`)
      }
    },
    toHaveLength(expected: number) {
      const len = (actual as unknown as { length: number }).length
      if (len !== expected) {
        throw new Error(`Expected length ${expected}, got ${len}`)
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== 'number' || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`)
      }
    },
    toBeLessThan(expected: number) {
      if (typeof actual !== 'number' || actual >= expected) {
        throw new Error(`Expected ${actual} to be less than ${expected}`)
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected undefined, got ${JSON.stringify(actual)}`)
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected defined value, got undefined`)
      }
    },
    toThrow() {
      if (typeof actual !== 'function') {
        throw new Error('Expected a function')
      }
      let threw = false
      try {
        (actual as () => void)()
      } catch {
        threw = true
      }
      if (!threw) {
        throw new Error('Expected function to throw')
      }
    },
  }
}

// =============================================================================
// INPUT VALIDATION TESTS
// =============================================================================

import {
  isValidEmail,
  isValidPhone,
  sanitizeString,
  isValidURL,
  sanitizeHTML,
  validateContactForm,
} from '../../lib/input-validation'

describe('Input Validation', () => {
  // Email validation tests
  test('isValidEmail accepts valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    expect(isValidEmail('user+tag@example.org')).toBe(true)
  })

  test('isValidEmail rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('no@domain')).toBe(false)
    expect(isValidEmail('spaces in@email.com')).toBe(false)
  })

  test('isValidEmail rejects extremely long emails', () => {
    const longEmail = 'a'.repeat(300) + '@example.com'
    expect(isValidEmail(longEmail)).toBe(false)
  })

  // Phone validation tests
  test('isValidPhone accepts valid phone numbers', () => {
    expect(isValidPhone('+14155551234')).toBe(true)
    expect(isValidPhone('+442071234567')).toBe(true)
    expect(isValidPhone('14155551234')).toBe(true)
  })

  test('isValidPhone accepts formatted numbers', () => {
    expect(isValidPhone('+1 (415) 555-1234')).toBe(true)
    expect(isValidPhone('+1-415-555-1234')).toBe(true)
  })

  test('isValidPhone rejects invalid numbers', () => {
    expect(isValidPhone('')).toBe(false)
    expect(isValidPhone('123')).toBe(false)
    expect(isValidPhone('abcdefghij')).toBe(false)
  })

  // String sanitization tests
  test('sanitizeString removes dangerous characters', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
    expect(sanitizeString('Hello<World>')).toBe('HelloWorld')
  })

  test('sanitizeString trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello')
  })

  test('sanitizeString limits length', () => {
    const longString = 'a'.repeat(2000)
    expect(sanitizeString(longString).length).toBe(1000)
  })

  // URL validation tests
  test('isValidURL accepts valid URLs', () => {
    expect(isValidURL('https://example.com')).toBe(true)
    expect(isValidURL('http://localhost:3000')).toBe(true)
    expect(isValidURL('https://sub.domain.com/path?query=1')).toBe(true)
  })

  test('isValidURL rejects invalid URLs', () => {
    expect(isValidURL('')).toBe(false)
    expect(isValidURL('not-a-url')).toBe(false)
    expect(isValidURL('ftp://file.server.com')).toBe(false)
    expect(isValidURL('javascript:alert(1)')).toBe(false)
  })

  // HTML sanitization tests
  test('sanitizeHTML removes script tags', () => {
    const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>'
    const sanitized = sanitizeHTML(html)
    expect(sanitized).toContain('<p>Hello</p>')
    expect(sanitized).toContain('<p>World</p>')
    expect(sanitized.includes('<script>')).toBe(false)
  })

  test('sanitizeHTML removes iframe tags', () => {
    const html = '<iframe src="malicious.com"></iframe>'
    expect(sanitizeHTML(html).includes('<iframe')).toBe(false)
  })

  test('sanitizeHTML removes event handlers', () => {
    const html = '<img src="x" onerror="alert(1)">'
    expect(sanitizeHTML(html).includes('onerror')).toBe(false)
  })

  // Contact form validation tests
  test('validateContactForm accepts valid data', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message that is long enough.',
    })
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.sanitized).toBeDefined()
  })

  test('validateContactForm rejects missing name', () => {
    const result = validateContactForm({
      email: 'john@example.com',
      message: 'This is a valid message.',
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  test('validateContactForm rejects invalid email', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'not-an-email',
      message: 'This is a valid message that is long enough.',
    })
    expect(result.isValid).toBe(false)
  })

  test('validateContactForm rejects short message', () => {
    const result = validateContactForm({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    })
    expect(result.isValid).toBe(false)
  })

  test('validateContactForm sanitizes output', () => {
    const result = validateContactForm({
      name: '  John Doe  ',
      email: 'JOHN@EXAMPLE.COM',
      message: 'This is a valid message with some <script> tags.',
    })
    expect(result.isValid).toBe(true)
    expect(result.sanitized?.name).toBe('John Doe')
    expect(result.sanitized?.email).toBe('john@example.com')
  })
})

// =============================================================================
// PROPERTY DESCRIPTION PARSER TESTS
// =============================================================================

import { parsePropertyDescription, getCleanDescription } from '../../lib/parse-property-description'

describe('Property Description Parser', () => {
  test('parsePropertyDescription returns empty arrays for null input', () => {
    const result = parsePropertyDescription(null)
    expect(result.description).toHaveLength(0)
    expect(result.bedroomDetails).toHaveLength(0)
    expect(result.staff).toHaveLength(0)
    expect(result.policies).toHaveLength(0)
  })

  test('parsePropertyDescription extracts main description', () => {
    const rawDescription = `
      Welcome to this beautiful luxury villa with stunning ocean views.
      This property features five bedrooms and a private infinity pool.
      
      AMENITIES
      Pool
      WiFi
      A/C
    `
    const result = parsePropertyDescription(rawDescription)
    expect(result.description.length).toBeGreaterThan(0)
    expect(result.description[0]).toContain('beautiful luxury villa')
  })

  test('parsePropertyDescription separates bedroom details', () => {
    const rawDescription = `
      Beautiful villa in Barbados.
      
      BEDROOM DESCRIPTIONS
      Master Bedroom – King bed with ocean view
      Guest Bedroom 1 – Queen bed
      Guest Bedroom 2 – Twin beds
    `
    const result = parsePropertyDescription(rawDescription)
    expect(result.bedroomDetails.length).toBeGreaterThan(0)
  })

  test('parsePropertyDescription extracts staff information', () => {
    const rawDescription = `
      Luxury beachfront property.
      
      STAFF
      Housekeeper (Monday-Saturday)
      Cook (available on request)
      Gardener
    `
    const result = parsePropertyDescription(rawDescription)
    expect(result.staff.length).toBeGreaterThan(0)
  })

  test('parsePropertyDescription filters out rate information', () => {
    const rawDescription = `
      Beautiful villa in paradise.
      
      RATES
      Summer
      May 1 - October 31
      $500 USD
      Winter
      November 1 - April 30
      $800 USD
      
      Government Accommodation Tax not included.
    `
    const result = parsePropertyDescription(rawDescription)
    // Rates should not appear in description
    result.description.forEach(desc => {
      expect(desc.includes('$500')).toBe(false)
      expect(desc.includes('$800')).toBe(false)
    })
  })

  test('parsePropertyDescription deduplicates paragraphs', () => {
    const rawDescription = `
      This is a beautiful villa with amazing views.
      This is a beautiful villa with amazing views.
      Another unique paragraph about the property.
    `
    const result = parsePropertyDescription(rawDescription)
    // Should not have duplicates
    const uniqueDescriptions = new Set(result.description)
    expect(result.description.length).toBe(uniqueDescriptions.size)
  })

  test('getCleanDescription returns only description paragraphs', () => {
    const rawDescription = `
      A wonderful beachfront villa perfect for families.
      
      AMENITIES
      Pool, WiFi, A/C
      
      POLICIES
      No smoking. No pets.
    `
    const descriptions = getCleanDescription(rawDescription)
    expect(Array.isArray(descriptions)).toBe(true)
    descriptions.forEach(desc => {
      expect(desc.includes('Pool, WiFi')).toBe(false)
      expect(desc.includes('No smoking')).toBe(false)
    })
  })
})

// =============================================================================
// SUBSCRIPTION UTILS TESTS (Plan Features Only - No DB)
// =============================================================================

import { PLAN_FEATURES } from '../../lib/subscription-utils'

describe('Subscription Plan Features', () => {
  test('starter plan has limited features', () => {
    const starter = PLAN_FEATURES.starter
    expect(starter.maxProjects).toBe(5)
    expect(starter.maxApiCalls).toBe(1000)
    expect(starter.maxStorage).toBe(1)
    expect(starter.hasAdvancedAnalytics).toBe(false)
    expect(starter.hasPrioritySupport).toBe(false)
    expect(starter.hasCustomIntegrations).toBe(false)
  })

  test('pro plan has enhanced features', () => {
    const pro = PLAN_FEATURES.pro
    expect(pro.maxProjects).toBe(50)
    expect(pro.maxApiCalls).toBe(10000)
    expect(pro.maxStorage).toBe(10)
    expect(pro.hasAdvancedAnalytics).toBe(true)
    expect(pro.hasPrioritySupport).toBe(true)
    expect(pro.hasCustomIntegrations).toBe(false)
  })

  test('enterprise plan has unlimited features', () => {
    const enterprise = PLAN_FEATURES.enterprise
    expect(enterprise.maxProjects).toBe(-1) // unlimited
    expect(enterprise.maxApiCalls).toBe(-1) // unlimited
    expect(enterprise.maxStorage).toBe(-1) // unlimited
    expect(enterprise.hasAdvancedAnalytics).toBe(true)
    expect(enterprise.hasPrioritySupport).toBe(true)
    expect(enterprise.hasCustomIntegrations).toBe(true)
  })

  test('all plan tiers are defined', () => {
    expect(PLAN_FEATURES.starter).toBeDefined()
    expect(PLAN_FEATURES.pro).toBeDefined()
    expect(PLAN_FEATURES.enterprise).toBeDefined()
  })
})

// =============================================================================
// CURRENCY FORMATTING TESTS
// =============================================================================

describe('Currency Utilities', () => {
  test('USD formatting works correctly', () => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(1234.56)
    expect(formatted).toContain('1,234.56')
  })

  test('EUR formatting works correctly', () => {
    const formatted = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(1234.56)
    expect(formatted).toContain('1.234,56')
  })

  test('GBP formatting works correctly', () => {
    const formatted = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(1234.56)
    expect(formatted).toContain('1,234.56')
  })
})

// =============================================================================
// DATE UTILITIES TESTS
// =============================================================================

describe('Date Utilities', () => {
  test('date formatting for booking displays', () => {
    const date = new Date('2024-06-15')
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    expect(formatted).toContain('Jun')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2024')
  })

  test('calculating nights between dates', () => {
    const checkIn = new Date('2024-06-15')
    const checkOut = new Date('2024-06-20')
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    expect(nights).toBe(5)
  })

  test('date comparison for availability', () => {
    const today = new Date()
    const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const pastDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    expect(futureDate > today).toBe(true)
    expect(pastDate < today).toBe(true)
  })
})

// =============================================================================
// RUN ALL TESTS
// =============================================================================

export async function runUnitTests(): Promise<{
  suites: TestSuite[]
  totalPassed: number
  totalFailed: number
  totalDuration: number
}> {
  // Tests are run by describe() calls above
  
  let totalPassed = 0
  let totalFailed = 0
  let totalDuration = 0

  for (const suite of suites) {
    totalPassed += suite.passed
    totalFailed += suite.failed
    totalDuration += suite.duration
  }

  return {
    suites,
    totalPassed,
    totalFailed,
    totalDuration,
  }
}

// Export for test runner
export { suites }
