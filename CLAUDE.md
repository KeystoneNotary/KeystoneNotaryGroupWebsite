# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Keystone Notary Group website - a Next.js 16 notary services booking platform with Google Calendar integration, email notifications, and a custom GSAP animation system.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP, Supabase, Google Calendar API, Resend

## Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Production build
npm start            # Start production server
```

### Testing
```bash
npm test             # Run all tests with Jest
npm test -- <file>   # Run specific test file
```

Test configuration notes:
- Tests are in `src/components/__tests__/` and `src/lib/__tests__/`
- Legacy tests in `__tests__/` are ignored (see `jest.config.js`)
- GSAP and Lucide React are transformed for Jest compatibility
- Setup file: `jest.setup.js`

### Linting
```bash
npm run lint         # Run ESLint
```

## Architecture

### Application Structure

**Next.js App Router** (`src/app/`)
- `/` - Main landing page with component composition
- `/api/bookings/create` - POST endpoint for booking creation
- `/api/bookings/check-availability` - GET endpoint for calendar availability
- `/api/auth/login` - Admin authentication
- `/admin/dashboard` - Protected admin panel (requires middleware auth)

**Components** (`src/components/`)
- Page sections: `Hero`, `TheFirm`, `HorizontalServices`, `BookingSection`, `FAQ`, `Contact`, `TitaniumFooter`
- Interactive: `HolographicCalculator`, `BookingCalendar`, `PriceCalculator`
- All major components have tests in `__tests__/`

### Core Libraries (`src/lib/`)

**`gsap-animations.ts`** - Centralized animation system
- **DO NOT duplicate GSAP animation code** - use the utilities from this file
- Contains preset animations: `parallaxBackgroundText`, `explosionReveal`, `headerExplodedAssembly`, `staggerReveal`, `bounceIn`, `mediaReveal`, `radialExplosion`
- Includes timeline helpers: `createScrollTimeline`, `createToggleTimeline`
- Performance utilities: `killAllScrollTriggers`, `refreshScrollTriggers`, `lazyScrollTrigger`
- Preset combinations: `completeSectionReveal` for full section entrances
- All animations use `force3D: true` for performance
- Always clean up ScrollTriggers in component unmount

**`google-calendar.ts`** - Google Calendar integration
- Uses lazy initialization pattern: `getCalendar()` creates auth client on demand
- `createCalendarEvent(booking)` - Creates 60-minute events with reminders
- `getAvailableSlots(date)` - Returns available 9 AM - 5 PM slots
- Timezone: America/New_York (hardcoded)
- Events include customer details, service type, and address

**`email.ts`** - Resend email integration
- Uses lazy initialization: `getResend()` creates client on demand
- `sendBookingConfirmation(booking, bookingId)` - Customer confirmation email
- `sendNotaryNotification(booking, bookingId)` - Internal notification to notary
- Both functions are fire-and-forget (don't block responses)

**`supabase.ts`** - Database client
- Single shared Supabase client instance
- Uses service role key for server-side operations
- Graceful fallbacks if env vars missing (dev mode)

**`pricing.ts`** - Notary pricing calculator
- `calculateNotaryPrice(input)` - Returns rounded total
- `calculatePriceBreakdown(input)` - Returns itemized breakdown
- Base rate: $15, Free mileage: 10 miles, Mileage rate: $2.50/mile
- Service fees: loan-signing (+$100), apostille (+$50), estate (+$30)
- Urgency fees: same-day (+$50), after-hours (+$75)

### Middleware & Authentication

**`middleware.ts`** - Admin route protection
- Checks cookie `admin_session` for `/admin/dashboard` access
- Redirects to `/admin/login` if not authenticated
- Simple cookie-based auth (password in env var `ADMIN_PASSWORD`)

### Booking Flow

1. User submits booking form (validated with Zod schema)
2. API route `/api/bookings/create`:
   - Validates input
   - Creates Google Calendar event (if credentials present)
   - Saves to Supabase `bookings` table
   - Sends confirmation emails (fire-and-forget)
   - Returns booking ID
3. All external service failures are logged but don't block the response

**Database Schema** (Supabase `bookings` table):
- `customer_name`, `customer_email`, `customer_phone`
- `appointment_date` (YYYY-MM-DD), `appointment_time` (HH:MM)
- `address`, `service_type`, `price`, `notes`
- `google_event_id`, `status`

## Environment Variables

Required for full functionality (see `env.example`):

```bash
# Supabase (database)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Google Calendar (booking system)
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY          # Service account key with \n escaped
GOOGLE_CALENDAR_ID          # Default: "primary"

# Resend (email notifications)
RESEND_API_KEY
NOTARY_EMAIL

# Admin
ADMIN_PASSWORD
```

**Note:** The app gracefully handles missing credentials in development mode (logs warnings, skips integrations).

## Next.js Configuration

**`next.config.ts`**:
- React Strict Mode enabled
- Image optimization: WebP/AVIF, custom device sizes
- Package imports optimized: GSAP, Lucide React
- Production source maps disabled
- Powered-by header disabled

## Key Patterns

### Lazy Initialization
External service clients (Google Calendar, Resend) are initialized lazily via getter functions. This prevents initialization errors when env vars are missing and improves cold start performance.

```typescript
// Good pattern used in the codebase
const getCalendar = () => {
  const auth = new google.auth.GoogleAuth({...});
  return google.calendar({ version: "v3", auth });
};
```

### GSAP Animation Usage
Always use utilities from `gsap-animations.ts`. Example:

```typescript
import { headerExplodedAssembly, staggerReveal } from '@/lib/gsap-animations';

// In component
useEffect(() => {
  const tl = headerExplodedAssembly(labelRef, titleRef, accentRef);
  return () => tl.kill(); // Cleanup
}, []);
```

### Component Testing
Components using GSAP should mock animation functions:

```typescript
jest.mock('@/lib/gsap-animations', () => ({
  staggerReveal: jest.fn(() => ({ kill: jest.fn() })),
}));
```

## Fonts

- Primary: Playfair Display (headings)
- Secondary: Inter (body text)
- Both loaded via `next/font/google` with CSS variables

## SEO & Metadata

Structured data and metadata defined in `src/app/metadata.ts` and injected in `page.tsx`.
