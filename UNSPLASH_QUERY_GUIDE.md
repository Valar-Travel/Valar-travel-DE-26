# Unsplash Query Configuration Guide

## Overview

This guide explains how the Unsplash API integration works with our query configuration system to dynamically fetch the perfect images for each page and section of the Valar Travel website.

## Configuration Files

### 1. `lib/unsplash-query-config.ts`
Contains all Unsplash search queries organized by page and section. Each query includes:
- **Primary query**: The main search term
- **Fallback queries**: Alternative searches if primary doesn't return good results
- **Orientation**: Preferred image orientation (landscape, portrait, squarish)
- **Color**: Preferred color tone (blue, green, teal, orange, etc.)
- **Per page**: Number of results to fetch

### 2. `lib/unsplash-image-mapper.ts`
Helper functions to map page contexts to appropriate queries and generate image mappings.

## Current Query Configuration

### Home Page
- **Hero**: `luxury caribbean beach villa aerial view`
- **Destination Cards**:
  - Barbados: `barbados pink sand beach pristine`
  - St. Lucia: `st lucia pitons mountain view`
  - Jamaica: `jamaica turquoise beach palm trees`
  - St. Barthélemy: `st barths harbor luxury yachts`
- **Featured Villas**: `luxury caribbean villa pool ocean view`

### Destination Pages

#### Barbados
- **Hero**: `barbados beach sunset pristine sand`
- **Villas**:
  - Beachfront: `barbados luxury beachfront villa white`
  - Coral Reef: `barbados coral reef villa ocean`
  - Sandy Lane: `barbados sandy lane luxury estate`
- **Activities**:
  - Beach: `barbados beach activities water sports`
  - Dining: `barbados fine dining beachfront restaurant`

#### St. Lucia
- **Hero**: `st lucia pitons dramatic view sunset`
- **Villas**:
  - Ocean Breeze: `st lucia hillside villa ocean view`
  - Rainforest: `st lucia rainforest villa tropical`
  - Sunset Paradise: `st lucia sunset villa infinity pool`
- **Activities**:
  - Pitons: `st lucia pitons hiking adventure`
  - Snorkeling: `st lucia snorkeling coral reef`

#### Jamaica
- **Hero**: `jamaica beach turquoise water palm trees`
- **Villas**:
  - Paradise Cove: `jamaica luxury villa beachfront modern`
  - Negril Sunset: `jamaica negril sunset villa beach`
  - Montego Bay: `jamaica montego bay luxury villa`
- **Activities**:
  - Beach: `jamaica beach life reggae culture`
  - Waterfalls: `jamaica dunn river falls waterfall`

#### St. Barthélemy
- **Hero**: `st barths harbor luxury yachts french caribbean`
- **Villas**:
  - Elegance: `st barths luxury villa french style`
  - Côte d'Azur: `st barths villa mediterranean style ocean`
  - Gustavia Harbor: `st barths gustavia harbor villa view`
- **Activities**:
  - Yachting: `st barths yacht sailing luxury`
  - Shopping: `st barths gustavia shopping french`

### Villa Types & Features
- **Beachfront**: `luxury beachfront villa caribbean white sand`
- **Hillside**: `hillside villa caribbean ocean view`
- **Modern**: `modern luxury villa caribbean contemporary`
- **Traditional**: `traditional caribbean villa colonial style`

**Features**:
- Infinity Pool: `infinity pool ocean view luxury villa`
- Private Beach: `private beach luxury villa caribbean`
- Master Bedroom: `luxury bedroom ocean view caribbean`
- Gourmet Kitchen: `gourmet kitchen luxury villa modern`
- Outdoor Dining: `outdoor dining terrace ocean view`
- Living Room: `luxury living room ocean view open`

### Experiences
- **Beach**: `caribbean beach pristine turquoise water`
- **Snorkeling**: `caribbean snorkeling coral reef colorful`
- **Sailing**: `caribbean sailing yacht sunset`
- **Fine Dining**: `caribbean fine dining beachfront elegant`
- **Spa**: `luxury spa treatment tropical caribbean`
- **Sunset**: `caribbean sunset beach golden hour`

## How to Use

### 1. Get Query for Specific Context

\`\`\`typescript
import { getRecommendedQuery } from '@/lib/unsplash-image-mapper'

// Get query for home page hero
const heroQuery = getRecommendedQuery({
  page: 'home',
  section: 'hero'
})

// Get query for Barbados destination page
const barbadosQuery = getRecommendedQuery({
  page: 'destination',
  destination: 'barbados',
  section: 'hero'
})
\`\`\`

### 2. Fetch Images Using the API

\`\`\`typescript
import { searchUnsplashImages } from '@/lib/unsplash-api'

const query = getRecommendedQuery({ page: 'home', section: 'hero' })
if (query) {
  const images = await searchUnsplashImages({
    query: query.primary,
    orientation: query.orientation,
    color: query.color,
    perPage: query.perPage || 10
  })
}
\`\`\`

### 3. Use React Hook for Client-Side

\`\`\`typescript
import { useUnsplashSearch } from '@/hooks/use-unsplash'
import { getRecommendedQuery } from '@/lib/unsplash-image-mapper'

function MyComponent() {
  const query = getRecommendedQuery({ page: 'home', section: 'hero' })
  const { images, isLoading } = useUnsplashSearch(query?.primary || '')
  
  // Use images...
}
\`\`\`

## Customizing Queries

### Adding New Queries

Edit `lib/unsplash-query-config.ts` and add your queries following the existing structure:

\`\`\`typescript
export const UNSPLASH_QUERIES = {
  // ... existing queries
  
  newSection: {
    newCategory: {
      primary: 'your search query here',
      fallback: ['alternative query 1', 'alternative query 2'],
      orientation: 'landscape',
      color: 'blue',
    }
  }
}
\`\`\`

### Query Best Practices

1. **Be Specific**: Use detailed, descriptive queries
   - Good: `luxury caribbean villa infinity pool ocean view`
   - Bad: `villa pool`

2. **Include Location**: Add destination names for better results
   - Good: `barbados beachfront villa sunset`
   - Bad: `beachfront villa`

3. **Add Style Keywords**: Include style descriptors
   - `luxury`, `modern`, `traditional`, `elegant`, `contemporary`

4. **Use Fallbacks**: Always provide 2-3 fallback queries
   - Primary might be too specific
   - Fallbacks ensure you always get results

5. **Set Orientation**: Match your layout needs
   - Hero sections: `landscape`
   - Sidebar images: `portrait`
   - Grid items: `squarish`

6. **Color Filtering**: Use when brand consistency matters
   - Beach scenes: `blue` or `teal`
   - Sunset: `orange`
   - Tropical: `green`

## Testing Queries

Use the Unsplash website to test your queries before adding them:
1. Go to https://unsplash.com
2. Search for your query
3. Check if results match your expectations
4. Refine query if needed
5. Add to configuration

## API Rate Limits

- **Demo/Development**: 50 requests per hour
- **Production**: 5,000 requests per hour

To stay within limits:
- Cache images after first fetch
- Use SWR for client-side caching
- Consider storing selected images in your database
- Use the same image across multiple pages when appropriate

## Next Steps

1. Review current queries and suggest improvements
2. Add queries for any missing pages/sections
3. Test queries and update based on results
4. Implement image caching strategy
5. Create admin panel for image selection and management
