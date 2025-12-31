"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface CurrencyContextType {
  currency: string
  setCurrency: (currency: string) => void
  convertPrice: (price: number, fromCurrency?: string) => number
  formatPrice: (price: number, fromCurrency?: string) => string
  exchangeRates: Record<string, number>
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rates (in production, fetch from API like exchangerate-api.com)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0, // Base currency
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.5,
  BRL: 5.2,
  MXN: 20.1,
  KRW: 1180.0,
  SGD: 1.35,
  HKD: 7.8,
  NOK: 8.5,
  SEK: 8.7,
  DKK: 6.3,
  PLN: 3.9,
  CZK: 21.5,
  HUF: 295.0,
  RUB: 73.5,
  TRY: 8.5,
  ZAR: 14.2,
  AED: 3.67,
  SAR: 3.75,
  THB: 31.5,
  MYR: 4.15,
  IDR: 14250.0,
  PHP: 49.5,
  VND: 23000.0,
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  CNY: "¥",
  INR: "₹",
  BRL: "R$",
  MXN: "$",
  KRW: "₩",
  SGD: "S$",
  HKD: "HK$",
  NOK: "kr",
  SEK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RUB: "₽",
  TRY: "₺",
  ZAR: "R",
  AED: "د.إ",
  SAR: "﷼",
  THB: "฿",
  MYR: "RM",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
}

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  JP: "JPY",
  AU: "AUD",
  CH: "CHF",
  CN: "CNY",
  IN: "INR",
  BR: "BRL",
  MX: "MXN",
  KR: "KRW",
  SG: "SGD",
  HK: "HKD",
  NO: "NOK",
  SE: "SEK",
  DK: "DKK",
  PL: "PLN",
  CZ: "CZK",
  HU: "HUF",
  RU: "RUB",
  TR: "TRY",
  ZA: "ZAR",
  AE: "AED",
  SA: "SAR",
  TH: "THB",
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
}

async function detectUserCurrency(): Promise<string> {
  try {
    // Method 1: Try browser's Intl API
    const locale = Intl.NumberFormat().resolvedOptions().locale
    const region = locale.split("-")[1]
    if (region && COUNTRY_CURRENCY_MAP[region]) {
      return COUNTRY_CURRENCY_MAP[region]
    }

    // Method 2: Try timezone-based detection
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneCountryMap: Record<string, string> = {
      "America/New_York": "USD",
      "America/Los_Angeles": "USD",
      "America/Chicago": "USD",
      "America/Toronto": "CAD",
      "Europe/London": "GBP",
      "Europe/Paris": "EUR",
      "Europe/Berlin": "EUR",
      "Europe/Rome": "EUR",
      "Europe/Madrid": "EUR",
      "Asia/Tokyo": "JPY",
      "Asia/Shanghai": "CNY",
      "Asia/Kolkata": "INR",
      "Australia/Sydney": "AUD",
      "Asia/Singapore": "SGD",
      "Asia/Hong_Kong": "HKD",
    }

    if (timezoneCountryMap[timezone]) {
      return timezoneCountryMap[timezone]
    }

    // Method 3: Try IP-based geolocation (fallback) with timeout and better error handling
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      if (data.country_code && COUNTRY_CURRENCY_MAP[data.country_code]) {
        return COUNTRY_CURRENCY_MAP[data.country_code]
      }
    } catch (apiError) {
      console.log(
        "[v0] IP-based currency detection failed:",
        apiError instanceof Error ? apiError.message : "Unknown error",
      )
    }
  } catch (error) {
    console.log("[v0] Currency detection failed:", error instanceof Error ? error.message : "Unknown error")
  }

  // Default to USD if all detection methods fail
  return "USD"
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<string>("USD")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(EXCHANGE_RATES)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const initializeCurrency = async () => {
      try {
        if (typeof window !== "undefined") {
          const savedCurrency = localStorage.getItem("preferred-currency")
          if (savedCurrency && EXCHANGE_RATES[savedCurrency]) {
            setCurrency(savedCurrency)
          } else {
            try {
              const detectedCurrency = await detectUserCurrency()
              setCurrency(detectedCurrency)
              localStorage.setItem("preferred-currency", detectedCurrency)
            } catch (detectionError) {
              console.log("[v0] Currency auto-detection failed, using USD:", detectionError)
              setCurrency("USD")
              localStorage.setItem("preferred-currency", "USD")
            }
          }
        }
      } catch (error) {
        console.log("[v0] Currency initialization failed:", error instanceof Error ? error.message : "Unknown error")
        setCurrency("USD")
      } finally {
        setIsLoading(false)
      }
    }

    initializeCurrency()
  }, [])

  const convertPrice = (price: number, fromCurrency = "USD"): number => {
    if (currency === fromCurrency) return price

    // Convert from source currency to USD, then to target currency
    const usdPrice = price / exchangeRates[fromCurrency]
    return usdPrice * exchangeRates[currency]
  }

  const formatPrice = (price: number, fromCurrency = "USD"): string => {
    const convertedPrice = convertPrice(price, fromCurrency)
    const symbol = CURRENCY_SYMBOLS[currency] || currency

    // Format based on currency conventions
    if (currency === "JPY" || currency === "KRW" || currency === "VND" || currency === "IDR") {
      // No decimal places for these currencies
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`
    }

    return `${symbol}${convertedPrice.toFixed(2)}`
  }

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency)
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("preferred-currency", newCurrency)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        convertPrice,
        formatPrice,
        exchangeRates,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
