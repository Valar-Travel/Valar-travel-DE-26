"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Bell, TrendingDown, TrendingUp, Calendar } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"

interface WishlistItem {
  id: string
  type: "hotel" | "flight" | "package" | "activity"
  name: string
  location: string
  image: string
  currentPrice: number
  originalPrice?: number
  priceHistory: { date: string; price: number }[]
  availability: boolean
  lastChecked: Date
  alerts: {
    priceAlert: boolean
    availabilityAlert: boolean
    targetPrice?: number
  }
  tags: string[]
  notes?: string
  dateAdded: Date
}

interface WishlistManagerProps {
  userId?: string
}

export function WishlistManager({ userId }: WishlistManagerProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [filter, setFilter] = useState<"all" | "hotels" | "flights" | "packages" | "activities">("all")
  const [sortBy, setSortBy] = useState<"dateAdded" | "price" | "priceChange">("dateAdded")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWishlist()
  }, [userId])

  const loadWishlist = async () => {
    try {
      const response = await fetch(`/api/wishlist${userId ? `?userId=${userId}` : ""}`)
      const data = await response.json()
      setWishlistItems(data.items || [])
    } catch (error) {
      console.error("Failed to load wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      await fetch(`/api/wishlist/${itemId}`, { method: "DELETE" })
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const togglePriceAlert = async (itemId: string, enabled: boolean, targetPrice?: number) => {
    try {
      await fetch(`/api/wishlist/${itemId}/alerts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceAlert: enabled,
          targetPrice,
        }),
      })

      setWishlistItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, alerts: { ...item.alerts, priceAlert: enabled, targetPrice } } : item,
        ),
      )
    } catch (error) {
      console.error("Failed to update alert:", error)
    }
  }

  const shareWishlist = async () => {
    try {
      const shareUrl = `${window.location.origin}/wishlist/shared/${userId}`
      await navigator.clipboard.writeText(shareUrl)
      // Show toast notification
      console.log("Wishlist link copied to clipboard")
    } catch (error) {
      console.error("Failed to share wishlist:", error)
    }
  }

  const filteredAndSortedItems = wishlistItems
    .filter((item) => filter === "all" || item.type === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.currentPrice - b.currentPrice
        case "priceChange":
          const aChange = a.originalPrice ? (a.currentPrice - a.originalPrice) / a.originalPrice : 0
          const bChange = b.originalPrice ? (b.currentPrice - b.originalPrice) / b.originalPrice : 0
          return aChange - bChange
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      }
    })

  const getPriceChange = (item: WishlistItem) => {
    if (!item.originalPrice) return null

    const change = ((item.currentPrice - item.originalPrice) / item.originalPrice) * 100
    const isIncrease = change > 0

    return {
      percentage: Math.abs(change),
      isIncrease,
      icon: isIncrease ? TrendingUp : TrendingDown,
      color: isIncrease ? "text-red-500" : "text-green-500",
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Wishlist</h2>
          <p className="text-gray-600">{wishlistItems.length} saved items</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={shareWishlist}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Items</option>
          <option value="hotels">Hotels</option>
          <option value="flights">Flights</option>
          <option value="packages">Packages</option>
          <option value="activities">Activities</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="dateAdded">Date Added</option>
          <option value="price">Price (Low to High)</option>
          <option value="priceChange">Price Change</option>
        </select>
      </div>

      {/* Wishlist Items */}
      <div className="grid gap-4">
        {filteredAndSortedItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items in your wishlist</h3>
              <p className="text-gray-500">Start exploring and save your favorite travel options!</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedItems.map((item) => {
            const priceChange = getPriceChange(item)

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <div className="relative">
                      <OptimizedImage
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                      {!item.availability && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Unavailable</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.location}</p>

                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm" onClick={() => removeFromWishlist(item.id)}>
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">${item.currentPrice}</span>
                          {item.originalPrice && item.originalPrice !== item.currentPrice && (
                            <span className="text-gray-500 line-through">${item.originalPrice}</span>
                          )}
                          {priceChange && (
                            <div className={`flex items-center gap-1 ${priceChange.color}`}>
                              <priceChange.icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{priceChange.percentage.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePriceAlert(item.id, !item.alerts.priceAlert)}
                          >
                            <Bell className={`h-4 w-4 mr-1 ${item.alerts.priceAlert ? "fill-current" : ""}`} />
                            Alert
                          </Button>

                          <Button size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Book Now
                          </Button>
                        </div>
                      </div>

                      {item.notes && <p className="text-sm text-gray-600 mt-2">{item.notes}</p>}

                      <p className="text-xs text-gray-400 mt-2">
                        Added {new Date(item.dateAdded).toLocaleDateString()} • Last checked{" "}
                        {new Date(item.lastChecked).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
