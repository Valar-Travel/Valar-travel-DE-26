import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Modern formats for 30-50% smaller files
    formats: ['image/avif', 'image/webp'],
    // Responsive breakpoints for luxury visual quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 1 year cache for optimized images
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.vrbo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.bstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sunnyvillaholidays.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.sunnyvillaholidays.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sunnyvillaholidays.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.expedia.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.hotels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.booking.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.travelocity.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.trvl-media.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.trvl-media.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'sunnyvillaholidays.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.travel-assets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['playwright', 'playwright-core', 'cheerio', 'cloudinary', 'openai', 'p-limit'],
  experimental: {
    ppr: true, // Partial Prerendering - static shell + dynamic data
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns', 'recharts'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('p-limit', 'playwright', 'playwright-core')
    }
    // Ignore tw-animate-css which is incompatible with Tailwind CSS v4
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'tw-animate-css': false,
      'tailwindcss-animate': false,
    }
    config.plugins = config.plugins || []
    return config
  },
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  async headers() {
    return [
      // Static assets - aggressive caching
      {
        source: '/:path*.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes - no caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Pages - stale-while-revalidate for fast loads
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
}

export default nextConfig
