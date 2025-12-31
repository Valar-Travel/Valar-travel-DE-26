"use client"

import { CurrencyProvider } from "@/hooks/use-currency"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>
}
