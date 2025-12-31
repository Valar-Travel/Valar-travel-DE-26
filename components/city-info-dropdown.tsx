"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CityInfoDropdownProps {
  cityName: string
  description: string
}

export function CityInfoDropdown({ cityName, description }: CityInfoDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-8 text-left hover:bg-white/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-ocean-900 mb-2">Discover {cityName}</h2>
              <p className="text-ocean-600 text-sm">Click to learn more about this destination</p>
            </div>
            {isOpen ? (
              <ChevronUp className="h-6 w-6 text-ocean-600 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-6 w-6 text-ocean-600 flex-shrink-0" />
            )}
          </div>
        </Button>

        {isOpen && (
          <div className="px-8 pb-8 border-t border-ocean-200/30">
            <p className="text-ocean-700 text-lg leading-relaxed mt-4">{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
