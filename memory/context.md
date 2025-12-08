# Session Context

## Current Session

- **Date:** 2025-12-07
- **Goal:** Audit codebase, refactor for security/scalability, and configure integrations.
- **Status:** Refactoring Complete. Support Mode.
- **Key Findings:**
  - Project is a Next.js (TypeScript) app with Supabase and Google Calendar.
  - **Refactor:** Supabase client split into Public/Admin versions for security.
  - **Refactor:** Booking logic extracted from UI components.
  - **State:** `BookingSection` now correctly dual-writes to Supabase and Google Calendar.
