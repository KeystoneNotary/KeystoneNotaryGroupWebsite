# Implementation Plan

## Overview
This plan addresses all security, code quality, performance, and best practice issues identified in the senior developer review. The implementation will focus on enhancing security through rate limiting and password hashing, improving code quality by eliminating 'any' types and fixing linting issues, and ensuring compliance with React and TypeScript best practices.

## Types
All 'any' types will be replaced with specific TypeScript interfaces and types. New interfaces will be created for API responses, form data, and component props.

### Specific Type Definitions:
1. **BookingDetails** - Enhanced interface for booking data with proper typing
2. **APIResponse** - Generic interface for API responses
3. **FormState** - Interface for form state management
4. **CalendarEvent** - Interface for Google Calendar events
5. **UserSession** - Interface for admin session data

## Files

### New Files to be Created:
- `src/lib/rate-limit.ts` - Rate limiting utility functions
- `src/lib/password-hash.ts` - Password hashing utility functions
- `src/lib/cors.ts` - CORS configuration utilities
- `src/middleware/rate-limit.ts` - Rate limiting middleware
- `src/types/index.ts` - Centralized type definitions

### Existing Files to be Modified:
- `src/app/api/bookings/create/route.ts` - Add rate limiting, improve error handling
- `src/app/api/auth/login/route.ts` - Implement password hashing
- `src/lib/google-calendar.ts` - Fix 'any' types, improve type safety
- `src/lib/email.ts` - Fix 'any' types, improve type safety
- `src/lib/usePrefersReducedMotion.ts` - Fix setState in effect warning
- `src/components/Hero.tsx` - Fix 'any' types in window object handling
- `src/components/Contact.tsx` - Remove unused state variable
- `src/app/privacy/page.tsx` - Fix unescaped entities using React's built-in escaping
- `src/app/terms/page.tsx` - Fix unescaped entities using React's built-in escaping
- `jest.config.js` - Fix require() style import
- `src/lib/useDeferredInit.ts` - Fix 'any' types in window object handling

### Configuration Files to be Updated:
- `package.json` - Add new dependencies
- `next.config.ts` - Add CORS configuration
- `env.example` - Add new environment variables

## Functions

### New Functions:
- `createRateLimiter()` - Creates a rate limiter instance
- `hashPassword()` - Hashes passwords using bcrypt
- `verifyPassword()` - Verifies passwords against hashes
- `configureCORS()` - Configures CORS headers
- `escapeHtml()` - Escapes HTML entities (alternative implementation)

### Modified Functions:
- `POST` in `src/app/api/bookings/create/route.ts` - Add rate limiting
- `POST` in `src/app/api/auth/login/route.ts` - Use password hashing
- `createCalendarEvent` in `src/lib/google-calendar.ts` - Improve typing
- `sendBookingConfirmation` in `src/lib/email.ts` - Improve typing
- `sendNotaryNotification` in `src/lib/email.ts` - Improve typing
- `usePrefersReducedMotion` in `src/lib/usePrefersReducedMotion.ts` - Fix effect issue
- `useDeferredInit` in `src/lib/useDeferredInit.ts` - Fix 'any' types

### Removed Functions:
- None

## Classes
No new classes will be created. Existing components will be refactored to improve type safety and code quality.

## Dependencies

### New Dependencies:
- `bcrypt` - For password hashing
- `@upstash/ratelimit` - For rate limiting
- `cors` - For CORS configuration
- `@types/bcrypt` - TypeScript types for bcrypt
- `@types/cors` - TypeScript types for cors

### Updated Dependencies:
- All existing dependencies will be updated to their latest stable versions

## Testing

### Test File Requirements:
- New tests for rate limiting functionality
- New tests for password hashing functions
- Updated tests for modified API routes
- Updated tests for components with fixed 'any' types

### Existing Test Modifications:
- Update all existing tests to work with new type definitions
- Add tests for error handling improvements
- Add tests for security enhancements

### Validation Strategies:
- Unit tests for all new utility functions
- Integration tests for API endpoints with rate limiting
- End-to-end tests for authentication flow with password hashing
- Regression tests to ensure existing functionality remains intact

## Implementation Order

1. **Security Enhancements**
   - Install and configure rate limiting library
   - Implement rate limiting middleware
   - Add password hashing functionality
   - Update authentication to use hashed passwords
   - Configure CORS settings

2. **Code Quality Improvements**
   - Replace all 'any' types with specific interfaces
   - Fix unescaped entities in privacy and terms pages
   - Resolve all linting errors and warnings
   - Fix setState in effect warning in usePrefersReducedMotion
   - Update jest.config.js to use import instead of require

3. **Performance Optimizations**
   - Review and optimize existing animations
   - Ensure proper cleanup of event listeners
   - Optimize API response handling

4. **Testing Enhancements**
   - Add tests for new security features
   - Update existing tests for type improvements
   - Add error condition tests
   - Verify all tests pass after changes

5. **Documentation Updates**
   - Update README with new security features
   - Update env.example with new environment variables
   - Add comments to new utility functions
