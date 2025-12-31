# Unsplash Dynamic Image Implementation Guide

This guide shows you how to use the dynamic Unsplash API integration in your pages.

## Quick Start

### 1. Using the UnsplashImage Component

The simplest way to use dynamic Unsplash images:

\`\`\`tsx
import { UnsplashImage } from "@/components/unsplash-image"

<UnsplashImage
  context="home"
  section="hero"
  alt="Luxury Caribbean villa"
  width={1920}
  height={1080}
  className="object-cover"
  priority
/>
\`\`\`

### 2. Available Contexts

The system automatically maps contexts to optimal Unsplash queries:

**Pages:**
- `home` - Homepage sections (hero, villas, destinations)
- `barbados` - Barbados destination page
- `st-lucia` - St. Lucia destination page
- `jamaica` - Jamaica destination page
- `st-barthelemy` - St. Barthélemy destination page
- `villas` - Villa listing page
- `blog` - Blog posts

**Sections:**
- `hero` - Hero/banner images
- `villa1`, `villa2`, `villa3` - Featured villas
- `beach`, `pool`, `interior` - Specific features
- `activity` - Activities and experiences

### 3. Using the Hook Directly

For more control, use the `useUnsplash` hook:

\`\`\`tsx
import { useUnsplash } from "@/hooks/use-unsplash"

function MyComponent() {
  const { data, isLoading, error } = useUnsplash({
    query: "luxury caribbean villa pool",
    perPage: 10,
    orientation: "landscape"
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading images</div>

  return (
    <div>
      {data?.results.map(photo => (
        <img key={photo.id} src={photo.urls.regular || "/placeholder.svg"} alt={photo.alt_description} />
      ))}
    </div>
  )
}
\`\`\`

### 4. Server-Side API Routes

Fetch images server-side for better performance:

\`\`\`tsx
// In a Server Component
async function getHeroImage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/unsplash/search?query=luxury+caribbean+villa&perPage=1`
  )
  const data = await response.json()
  return data.results[0]
}

export default async function Page() {
  const heroImage = await getHeroImage()
  
  return (
    <img src={heroImage.urls.regular || "/placeholder.svg"} alt={heroImage.alt_description} />
  )
}
\`\`\`

## Configuration

### Customizing Queries

Edit `lib/unsplash-query-config.ts` to customize search queries for each context:

\`\`\`typescript
export const UNSPLASH_QUERIES = {
  home: {
    hero: {
      query: "luxury caribbean beachfront villa sunset",
      orientation: "landscape",
      color: "blue",
    },
    // ... more sections
  },
}
\`\`\`

### Adding New Contexts

1. Add your context to `UNSPLASH_QUERIES` in `lib/unsplash-query-config.ts`
2. Use it in your components with the `UnsplashImage` component

\`\`\`typescript
// In unsplash-query-config.ts
export const UNSPLASH_QUERIES = {
  // ... existing contexts
  myNewPage: {
    hero: {
      query: "my custom search query",
      orientation: "landscape",
    },
  },
}

// In your component
<UnsplashImage context="myNewPage" section="hero" alt="My page hero" />
\`\`\`

## Best Practices

1. **Always provide fallback URLs** for critical images
2. **Use appropriate dimensions** - larger images for heroes, smaller for thumbnails
3. **Set priority={true}** for above-the-fold images
4. **Cache aggressively** - SWR handles this automatically with the hook
5. **Monitor API usage** - Unsplash has rate limits (50 requests/hour for demo, 5000/hour for production)

## Examples

See the example components in `components/examples/`:
- `dynamic-hero-section.tsx` - Hero section with dynamic background
- `dynamic-destination-card.tsx` - Destination cards with dynamic images

## Troubleshooting

**Images not loading?**
- Check your `UNSPLASH_ACCESS_KEY` environment variable
- Verify the query returns results on Unsplash.com
- Check browser console for API errors

**Rate limit exceeded?**
- Implement caching with Redis/Upstash
- Use fallback URLs more aggressively
- Consider upgrading your Unsplash API plan

**Images don't match content?**
- Refine queries in `unsplash-query-config.ts`
- Add more specific keywords
- Use color and orientation filters
