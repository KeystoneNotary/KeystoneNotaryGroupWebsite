# Design Decisions Log

## 2025-12-07: Security & Architecture Hardening

### 1. Supabase Client Splitting

**Decision:** Split `src/lib/supabase.ts` into two separate files:

- `src/lib/supabase.ts`: Uses ONLY the Anon key. Safe for public/browser usage.
- `src/lib/supabase-admin.ts`: Uses the Service Role key. STRICTLY for server-side usage (API routes).
- **Rationale:** To prevent accidental leakage of the Service Role key to the client bundle, which would grant full database access to attackers.

### 2. Dual-Persistence Strategy for Bookings

**Decision:** Bookings are persisted to BOTH Supabase (Database) and Google Calendar (External API).

- **Rationale:**
  - Supabase acts as the "Source of Truth" for the application, enabling the Admin Dashboard, analytics, and data ownership.
  - Google Calendar acts as the operational interface for the Notary to manage their schedule.
- **Fail-Safety:** If Google Calendar fails (e.g., API outage), the booking is still saved to Supabase (primary record), and the error is logged but not fatal to the user request.

### 3. Component Extraction

**Decision:** Extracted business logic from `BookingSection.tsx` to `src/lib/utils/booking.ts`.

- **Rationale:** The component was violating Single Responsibility Principle, handling UI, State, API calls, and complex Date logic. Extraction makes the logic unit-testable and the component readable.
