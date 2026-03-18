# Valar Travel - Luxury Caribbean Villa Rentals

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

## Overview

Valar Travel is a luxury Caribbean villa rental platform featuring 100+ handpicked properties across Barbados, St. Lucia, Jamaica, St. Barthelemy, St. Maarten, and Antigua.

## Live Site

**[https://valartravel.de](https://valartravel.de)**

## Features

### For Guests
- Browse luxury villas across 6 Caribbean destinations
- Advanced search with filters (price, bedrooms, amenities)
- Detailed property pages with image galleries
- Multi-currency support (USD, EUR, GBP)
- Contact forms and booking inquiries
- Newsletter subscription

### For Property Owners
- Owner registration portal
- Property submission system
- Direct booking inquiries

### Admin Features
- Admin dashboard with authentication
- Property management (add, edit, publish)
- CRM for customer inquiries
- Analytics dashboard
- Newsletter management

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Admin) |
| Payments | Stripe |
| Email | Resend |
| Deployment | Vercel |

## Project Structure

```
app/
├── (public)/          # Public pages (home, destinations, villas)
├── admin/             # Admin dashboard
├── api/               # API routes
├── auth/              # Authentication
├── villas/            # Villa listing and detail pages
└── destinations/      # Destination pages

components/
├── ui/                # shadcn/ui components
├── admin/             # Admin-specific components
└── [feature]/         # Feature-specific components

lib/
├── supabase/          # Supabase client utilities
├── utils/             # Utility functions
└── [feature]/         # Feature-specific utilities

types/
└── index.ts           # Centralized TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/valar-travel.git
cd valar-travel
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables (see [ENV_VARIABLES_REFERENCE_CARD.md](./ENV_VARIABLES_REFERENCE_CARD.md))

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

See [ENV_VARIABLES_REFERENCE_CARD.md](./ENV_VARIABLES_REFERENCE_CARD.md) for a complete list of required environment variables.

### Critical Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_SITE_URL` - Your site URL

## Database

The project uses Supabase with PostgreSQL. Key tables:
- `scraped_luxury_properties` - Villa listings
- `admin_users` - Admin authentication
- `contact_messages` - Customer inquiries
- `newsletter_subscriptions` - Newsletter signups
- `bookings` - Booking requests

See [DATABASE_SECURITY.md](./DATABASE_SECURITY.md) for security configuration.

## Testing

Run the comprehensive test suite:
```bash
pnpm test
```

Tests include:
- Unit tests for utility functions
- Integration tests for API routes
- TypeScript type checking
- ESLint code quality
- Accessibility static analysis
- Security vulnerability scanning

## Documentation

| Document | Description |
|----------|-------------|
| [ENV_VARIABLES_REFERENCE_CARD.md](./ENV_VARIABLES_REFERENCE_CARD.md) | Environment variable setup |
| [DATABASE_SECURITY.md](./DATABASE_SECURITY.md) | Database security configuration |
| [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md) | Security best practices |
| [SCRAPER-SETUP.md](./SCRAPER-SETUP.md) | Property scraper setup |

## Deployment

The project is configured for automatic deployment on Vercel:

1. Push changes to the main branch
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Submit a pull request

## License

Private - All rights reserved.

---

**Last Updated:** March 2026
