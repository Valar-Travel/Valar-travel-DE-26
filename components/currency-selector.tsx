"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const POPULAR_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
]

export function CurrencySelector() {
  const [currency, setCurrency] = useState("USD")
  const [isOpen, setIsOpen] = useState(false)

  const currentCurrency = POPULAR_CURRENCIES.find((c) => c.code === currency)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentCurrency?.flag} {currency}
          </span>
          <span className="sm:hidden">{currentCurrency?.flag}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
        {POPULAR_CURRENCIES.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => {
              setCurrency(curr.code)
              setIsOpen(false)
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-lg">{curr.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{curr.code}</span>
              <span className="text-sm text-muted-foreground">{curr.name}</span>
            </div>
            {currency === curr.code && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
