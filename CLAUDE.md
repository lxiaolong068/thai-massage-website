# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Overview

This is a multilingual Thai massage booking website built with Next.js 14, featuring a comprehensive admin system, public client interface, and multi-step booking flow. The application supports English, Chinese, and Korean languages with full internationalization.

## Architecture

- **Frontend**: Next.js 14 with App Router and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js for admin authentication
- **File Storage**: Vercel Blob for image uploads
- **Internationalization**: next-intl with locale-based routing
- **UI**: Tailwind CSS with shadcn/ui components
- **AI Integration**: CopilotKit for booking assistance

## Key Development Commands

### Core Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Database Management
```bash
# Generate Prisma client (runs automatically on install)
prisma generate

# Run database migrations
prisma migrate dev

# Seed database with sample data
pnpm seed

# Check database connection
pnpm check-db-connection
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run API tests specifically
pnpm test:api

# Run comprehensive API endpoint tests
pnpm test:api:comprehensive
```

### Admin Management
```bash
# Initialize admin user
pnpm init-admin
```

## Project Structure

### API Architecture (v1)
The API is organized into three categories under `/api/v1/`:

- **`public/`**: Publicly accessible endpoints (services, therapists, bookings)
- **`client/`**: Customer-authenticated endpoints (profile, bookings)
- **`admin/`**: Admin-authenticated endpoints (full CRUD operations)

All API responses use a unified format via `@/utils/api/response.ts`.

### Authentication
- **Admin Authentication**: Cookie-based sessions via NextAuth.js
- **Client Authentication**: JWT-based tokens for customer operations
- Admin routes require `admin_session` cookie
- Client routes require `client_token` cookie

### Internationalization
- Supported locales: `en` (default), `zh`, `ko`
- Translation files in `src/i18n/messages/`
- Locale-based routing: `/[locale]/page`
- Server and client translation utilities in `src/i18n/`

### Database Schema
Key models: `Therapist`, `Service`, `Booking`, `User`, `Admin`, `ContactMethod`
- All content models have translation tables (e.g., `TherapistTranslation`, `ServiceTranslation`)
- Booking system links services, therapists, and customer details
- Contact methods support QR code uploads for WeChat, WhatsApp, etc.

## Development Guidelines

### File Upload
- Uses Vercel Blob storage (requires `BLOB_READ_WRITE_TOKEN`)
- Upload utility in `src/lib/upload.ts`
- Supports QR codes, service images, therapist photos

### Component Architecture
- UI components in `src/components/ui/` (shadcn/ui)
- Business components in `src/components/`
- Admin-specific components in `src/components/admin/`
- Mobile-responsive design with dedicated mobile components

### Environment Variables
Required environment variables:
- Database: `DATABASE_URL`, `POSTGRES_*` variables
- Authentication: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- File storage: `BLOB_READ_WRITE_TOKEN`
- API: `NEXT_PUBLIC_API_URL`

### Testing Strategy
- API tests use Jest + Supertest
- Component tests use Jest + React Testing Library
- Database utilities for test setup in `src/__tests__/api/utils/`
- Test configuration in `jest.config.js` and `tsconfig.jest.json`

## Special Features

### Booking Assistant
- AI-powered booking assistant using CopilotKit
- Integrated with booking flow for natural language interactions
- Configuration in `/copilotkit` API route

### Mobile Contact Bar
- Floating contact bar with QR code modals
- Dynamic contact method fetching from database
- Optimized for mobile user experience

### Image Handling
- Next.js Image optimization with fallback handling
- Remote image patterns configured for external sources
- Placeholder images for missing content

## Common Tasks

### Adding New Services
1. Use admin interface at `/admin/services/new`
2. Upload service image via Vercel Blob
3. Add translations for all supported locales
4. Set sort order for display priority

### Managing Therapists
1. Create via `/admin/therapists/new`
2. Upload therapist photo
3. Set specialties and experience
4. Add bio translations

### Updating Contact Methods
1. Access `/admin/settings`
2. Upload QR codes for messaging platforms
3. Configure display preferences

### Database Changes
1. Modify `prisma/schema.prisma`
2. Run `prisma migrate dev --name descriptive-name`
3. Update seed data if needed
4. Regenerate Prisma client

When working with this codebase, always consider the multilingual nature of the application and ensure any new features support all three locales (en, zh, ko).