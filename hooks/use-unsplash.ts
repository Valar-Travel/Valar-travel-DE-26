"use client"

import useSWR from "swr"

interface UnsplashPhoto {
  id: string
  description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
    optimized: string
  }
  user: {
    name: string
    username: string
    portfolio_url: string | null
  }
  links: {
    download_location: string
  }
}

interface UnsplashSearchResult {
  results: UnsplashPhoto[]
  total: number
  total_pages: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

/**
 * Hook to search Unsplash photos
 */
export function useUnsplashSearch(query: string, page = 1, perPage = 10) {
  const { data, error, isLoading } = useSWR<UnsplashSearchResult>(
    query ? `/api/unsplash/search?query=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}` : null,
    fetcher,
  )

  return {
    photos: data?.results || [],
    total: data?.total || 0,
    totalPages: data?.total_pages || 0,
    isLoading,
    error,
  }
}

/**
 * Hook to get a random Unsplash photo
 */
export function useRandomUnsplashPhoto(
  query?: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
) {
  const queryString = query
    ? `?query=${encodeURIComponent(query)}&orientation=${orientation}`
    : `?orientation=${orientation}`

  const { data, error, isLoading } = useSWR<UnsplashPhoto>(`/api/unsplash/random${queryString}`, fetcher)

  return {
    photo: data,
    isLoading,
    error,
  }
}

/**
 * Hook to get a specific Unsplash photo by ID
 */
export function useUnsplashPhoto(id: string | null) {
  const { data, error, isLoading } = useSWR<UnsplashPhoto>(id ? `/api/unsplash/photo/${id}` : null, fetcher)

  return {
    photo: data,
    isLoading,
    error,
  }
}
