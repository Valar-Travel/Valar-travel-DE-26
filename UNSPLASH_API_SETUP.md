# Unsplash API Integration Setup

This project includes a complete Unsplash API integration using the official Unsplash SDK.

## Setup Instructions

### 1. Get Your Unsplash API Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application or use an existing one
3. Copy your **Access Key**

### 2. Add Environment Variable

Add the following environment variable to your project:

\`\`\`bash
UNSPLASH_ACCESS_KEY=your_access_key_here
\`\`\`

**In Vercel:**
1. Go to your project settings
2. Navigate to Environment Variables
3. Add `UNSPLASH_ACCESS_KEY` with your access key
4. Redeploy your application

### 3. Usage Examples

#### Server-Side (API Routes)

\`\`\`typescript
import { searchUnsplashPhotos, getRandomUnsplashPhoto } from '@/lib/unsplash-api'

// Search for photos
const results = await searchUnsplashPhotos('caribbean villa', 1, 10)

// Get random photo
const photo = await getRandomUnsplashPhoto('luxury resort')
\`\`\`

#### Client-Side (React Hooks)

\`\`\`typescript
import { useUnsplashSearch, useRandomUnsplashPhoto } from '@/hooks/use-unsplash'

function MyComponent() {
  // Search photos
  const { photos, isLoading } = useUnsplashSearch('beach villa')
  
  // Get random photo
  const { photo } = useRandomUnsplashPhoto('caribbean')
  
  return (
    <div>
      {photos.map(photo => (
        <img key={photo.id} src={photo.urls.optimized || "/placeholder.svg"} alt={photo.description} />
      ))}
    </div>
  )
}
\`\`\`

#### API Endpoints

- **Search Photos**: `GET /api/unsplash/search?query=villa&page=1&perPage=10`
- **Random Photo**: `GET /api/unsplash/random?query=beach&orientation=landscape`
- **Get Photo by ID**: `GET /api/unsplash/photo/[id]`

### 4. Unsplash API Guidelines

When using Unsplash images, you must:

1. **Credit the photographer**: Display the photographer's name and link to their Unsplash profile
2. **Track downloads**: Use the `trackUnsplashDownload()` function when users download images
3. **Follow rate limits**: Free tier allows 50 requests per hour

Example attribution:

\`\`\`tsx
<div>
  <img src={photo.urls.regular || "/placeholder.svg"} alt={photo.description} />
  <p>
    Photo by{' '}
    <a href={`https://unsplash.com/@${photo.user.username}`}>
      {photo.user.name}
    </a>{' '}
    on{' '}
    <a href="https://unsplash.com">Unsplash</a>
  </p>
</div>
\`\`\`

### 5. Utility Functions

- `formatUnsplashUrl()` - Optimize image URLs with custom dimensions and quality
- `extractUnsplashPhotoId()` - Extract photo ID from Unsplash URLs
- `trackUnsplashDownload()` - Track downloads (required by Unsplash)

## Features

- ✅ Official Unsplash SDK integration
- ✅ Server-side API routes for secure access
- ✅ React hooks for client-side usage
- ✅ Image URL optimization
- ✅ TypeScript support
- ✅ SWR caching for better performance
- ✅ Error handling and fallbacks

## Rate Limits

- **Free Tier**: 50 requests per hour
- **Production**: Apply for higher limits at [Unsplash Developers](https://unsplash.com/developers)

## Support

For issues or questions about the Unsplash API, visit:
- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash SDK GitHub](https://github.com/unsplash/unsplash-js)
