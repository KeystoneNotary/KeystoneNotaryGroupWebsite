# Task 001: Refine Shared Section System

## LLM Agent Directives

You are refining the shared public section system so the homepage feels calmer and more premium without touching the protected hero statement sections.

**Goals:**
1. Make the shared shell quieter and more neutral.
2. Reduce repeated visual gimmicks that make sections feel interchangeable.
3. Make the header feel like a restrained control bar rather than a second hero.

**Rules:**
- DO NOT change `Hero`.
- DO NOT change `TheFirm`.
- DO NOT add new sections or new features.
- DO NOT change API behavior or booking logic.
- Preserve the black, silver, and graphite palette.
- Run the targeted tests after each phase.

---

## Phase 1: Quiet The Shared Shell

### 1.1 Add a restrained shell mode

**File:** `src/components/ui/SectionShell.tsx`

FIND the current always-on shell treatment:

```tsx
backgroundWord: string;
...
<div className="absolute inset-0 ...">
...
<div className="absolute inset-0 flex ...">
  <span className="mt-8 md:mt-10">{backgroundWord}</span>
</div>
```

CHANGE TO a shell that supports quieter sections:

- Make `backgroundWord` optional.
- Add a prop such as `visualMode?: "quiet" | "editorial"` with `"quiet"` as the default.
- Only render the oversized background word for sections that explicitly need it.
- Reduce top-level backdrop intensity and standardize spacing so the shell is a framing system, not a design event.

VERIFY:

- `SectionShell` can render with no background word.
- Existing callers still compile after prop changes.

### 1.2 Update shell tests

**File:** `src/components/__tests__/SectionShell.test.tsx`

CHANGE TO cover:

- a quiet section without a background word
- an optional background word when explicitly enabled
- footer marker behavior unchanged

VERIFY: `npx jest src/components/__tests__/SectionShell.test.tsx --runInBand`

---

## Phase 2: Restrain The Header

### 2.1 Simplify the header feel

**File:** `src/components/Header.tsx`

CHANGE TO:

- reduce letter-spacing slightly on nav and CTA labels
- remove or reduce hover scale motion on nav items
- keep the booking CTA dominant, but reduce overall chrome weight
- preserve mobile menu structure and current behavior

VERIFY:

- `Book Appointment` remains the dominant CTA.
- desktop and mobile navigation still function.

### 2.2 Update header tests if needed

**File:** `src/components/__tests__/Header.test.tsx`

ADD OR ADJUST tests only if the visible text or structure changes.

VERIFY: `npx jest src/components/__tests__/Header.test.tsx --runInBand`

---

## Phase 3: Apply Quiet Mode To Public Sections

### 3.1 Rewire callers

**Files:**

- `src/components/ProofCredentials.tsx`
- `src/components/ServicesRegistry.tsx`
- `src/components/ProcessLedger.tsx`
- `src/components/BookingSection.tsx`
- `src/components/FAQ.tsx`
- `src/components/Contact.tsx`

CHANGE TO:

- use the quieter shell by default
- keep oversized background words only where they are genuinely useful
- remove low-value repeated visual framing

VERIFY:

- `Hero` and `TheFirm` still stand apart visually.
- public sections feel calmer as a group.

---

## Phase 4: Verify

RUN these commands:

```bash
npx jest src/components/__tests__/SectionShell.test.tsx src/components/__tests__/Header.test.tsx --runInBand
npm test -- --runInBand
npm run build
```

Manual QA:

- Desktop review at `http://127.0.0.1:3003`
- Mobile review at `http://127.0.0.1:3003`
- Confirm the header is quieter and the shared shell no longer dominates the page

---

## Checklist

### Phase 1
- [ ] Quiet shell mode added
- [ ] Optional background word support added
- [ ] Section shell tests updated

### Phase 2
- [ ] Header styling refined
- [ ] Header tests updated if needed

### Phase 3
- [ ] Public callers updated to use the quieter shell

### Phase 4
- [ ] Targeted Jest tests pass
- [ ] `npm test -- --runInBand` passes
- [ ] `npm run build` passes

---

## Do NOT Do

- Do NOT redesign `Hero`
- Do NOT redesign `TheFirm`
- Do NOT add more decorative modes
- Do NOT introduce new animations to compensate for removed chrome
