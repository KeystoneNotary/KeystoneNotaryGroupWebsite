# Task 003: Refine Conversion And Close

## LLM Agent Directives

You are refining the lower half of the homepage so booking, support content, contact, and footer form a polished closing sequence with clearer conversion focus.

**Goals:**
1. Make booking the emotional and functional peak after the story sections.
2. Simplify FAQ and Contact so they support booking rather than competing with it.
3. Make the footer feel like a composed signature close.

**Rules:**
- DO NOT change backend behavior, request shapes, or booking logic.
- DO NOT add features or alter business rules.
- Keep booking as the dominant CTA.
- Preserve all existing submission success and error states unless visual treatment changes are required.

---

## Phase 1: Tighten Booking Presentation

### 1.1 Simplify the supporting content around the booking console

**File:** `src/components/BookingSection.tsx`

CHANGE TO:

- reduce left-column copy density
- replace multiple helper cards with one cleaner support note plus the urgent line
- keep the console dominant and premium
- make the booking surface feel like a product UI, not a marketing collage

VERIFY:

- quote-backed flow remains unchanged
- the booking console is the first thing the eye lands on

### 1.2 Keep success state visually consistent

**File:** `src/components/BookingSection.tsx`

TIGHTEN if needed:

- spacing
- CTA hierarchy
- confirmation tone

Do not change the underlying flow.

---

## Phase 2: Simplify FAQ

### 2.1 Reduce accordion styling noise

**File:** `src/components/FAQ.tsx`

CHANGE TO:

- remove the offset pattern across FAQ items
- simplify the left support card
- make accordion rows cleaner and more uniform
- keep open/close behavior unchanged

Desired result:

- FAQ feels like quiet reassurance, not another feature section

VERIFY:

- expansion behavior still works
- open state remains readable on mobile

---

## Phase 3: Simplify Contact And Footer

### 3.1 Make contact form primary

**File:** `src/components/Contact.tsx`

CHANGE TO:

- reduce secondary support cards
- make the concierge details cleaner and less boxed-in
- make the form the obvious primary action surface
- preserve success and error behavior

### 3.2 Make the footer a restrained signature close

**File:** `src/components/TitaniumFooter.tsx`

CHANGE TO:

- reduce section-like weight in the footer
- preserve the closing CTA while simplifying supporting structure
- make the footer feel final, calm, and premium

VERIFY:

- footer still contains the key direct contact paths
- footer no longer feels like another feature block

---

## Phase 4: Update Tests

**Files:**

- `src/components/__tests__/BookingSection.test.tsx`
- `src/components/__tests__/FAQ.test.tsx`
- `src/components/__tests__/Contact.test.tsx`

UPDATE tests only where structure or visible copy changes require it.

VERIFY: run the three targeted files

---

## Phase 5: Verify

RUN these commands:

```bash
npx jest src/components/__tests__/BookingSection.test.tsx src/components/__tests__/FAQ.test.tsx src/components/__tests__/Contact.test.tsx --runInBand
npm test -- --runInBand
npm run build
```

Manual QA:

- Desktop and mobile review at `http://127.0.0.1:3003`
- Confirm booking is the dominant lower-page surface
- Confirm FAQ and Contact support, rather than distract from, conversion
- Confirm the footer closes the page cleanly

---

## Checklist

### Phase 1
- [ ] Booking support content simplified
- [ ] Booking console remains dominant

### Phase 2
- [ ] FAQ simplified

### Phase 3
- [ ] Contact simplified with form-first emphasis
- [ ] Footer simplified into a signature close

### Phase 4
- [ ] Targeted tests updated

### Phase 5
- [ ] Targeted Jest tests pass
- [ ] `npm test -- --runInBand` passes
- [ ] `npm run build` passes

---

## Do NOT Do

- Do NOT change booking APIs or validation rules
- Do NOT add new contact or FAQ features
- Do NOT turn the footer into another hero section
- Do NOT let support sections overpower booking
