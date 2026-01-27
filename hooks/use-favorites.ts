import useSWR from "swr"

interface FavoriteProperty {
  id: string
  name: string
  location: string
  rating: number
  price_per_night: number
  original_price?: number
  currency: string
  images: string[]
  property_type: string
  star_rating?: number
  luxury_score?: number
  is_luxury?: boolean
}

interface Favorite {
  id: string
  property_id: string
  created_at: string
  scraped_luxury_properties: FavoriteProperty
}

interface FavoritesResponse {
  favorites: Favorite[]
  userId?: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useFavorites() {
  const { data, error, isLoading, mutate } = useSWR<FavoritesResponse>("/api/favorites", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  const favoriteIds = new Set(data?.favorites?.map((f) => f.property_id) || [])

  const addFavorite = async (propertyId: string) => {
    try {
      // Optimistic update
      mutate(
        (currentData) => {
          if (!currentData) return currentData
          return {
            ...currentData,
            favorites: [
              ...currentData.favorites,
              {
                id: `temp-${propertyId}`,
                property_id: propertyId,
                created_at: new Date().toISOString(),
                scraped_luxury_properties: {} as FavoriteProperty,
              },
            ],
          }
        },
        { revalidate: false }
      )

      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      })

      if (!response.ok) {
        throw new Error("Failed to add favorite")
      }

      // Revalidate to get the actual data
      mutate()

      return true
    } catch (error) {
      console.error("[v0] Error adding favorite:", error)
      // Revert optimistic update
      mutate()
      return false
    }
  }

  const removeFavorite = async (propertyId: string) => {
    try {
      // Optimistic update
      mutate(
        (currentData) => {
          if (!currentData) return currentData
          return {
            ...currentData,
            favorites: currentData.favorites.filter((f) => f.property_id !== propertyId),
          }
        },
        { revalidate: false }
      )

      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove favorite")
      }

      return true
    } catch (error) {
      console.error("[v0] Error removing favorite:", error)
      // Revert optimistic update
      mutate()
      return false
    }
  }

  const toggleFavorite = async (propertyId: string) => {
    if (favoriteIds.has(propertyId)) {
      return removeFavorite(propertyId)
    } else {
      return addFavorite(propertyId)
    }
  }

  const isFavorited = (propertyId: string) => {
    return favoriteIds.has(propertyId)
  }

  return {
    favorites: data?.favorites || [],
    favoriteIds,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    mutate,
  }
}
