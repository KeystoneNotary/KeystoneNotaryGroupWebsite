# Task 002: Refine Trust And Information Sections

## LLM Agent Directives

You are refining the informational mid-page sections so they read as credible, structured, and premium, not overly art-directed.

**Goals:**
1. Make `ProofCredentials`, `ServicesRegistry`, and `ProcessLedger` faster to scan.
2. Replace ornamental complexity with hierarchy, alignment, and spacing.
3. Ensure these sections support `TheFirm` rather than competing with it.

**Rules:**
- DO NOT change any backend logic.
- DO NOT add new services, steps, or proof claims.
- DO NOT touch `Hero` or `TheFirm`.
- Preserve current section order.
- Keep copy changes limited to clarity and tone polish.

---

## Phase 1: Refine Proof

### 1.1 Convert Proof into a cleaner trust ledger

**File:** `src/components/ProofCredentials.tsx`

CHANGE TO:

- remove staggered/offset list presentation
- reduce or remove ornamental image layers unless one is clearly justified
- simplify the seal block and service area block into one coherent trust panel system
- present credentials in a clean, aligned list or grid

Desired result:

- the section reads as institutional proof
- the eye lands on credentials first, not decoration

VERIFY:

- visual reading order is obvious within one screen
- no diagonal or offset styling remains

---

## Phase 2: Refine Services

### 2.1 Remove the decorative registry showcase feel

**File:** `src/components/ServicesRegistry.tsx`

CHANGE TO:

- make the services list the main event
- remove or greatly reduce the right-side decorative art panel
- normalize row alignment and reduce offset stacking
- let typography and spacing carry the section

Desired result:

- services feel editorial but restrained
- the section scans like a premium service list, not a gallery

VERIFY:

- each service reads clearly at desktop and mobile widths
- there is a single dominant reading path

---

## Phase 3: Refine Process

### 3.1 Make the process sequence stable and precise

**File:** `src/components/ProcessLedger.tsx`

CHANGE TO:

- remove the diagonal visual line
- reduce the decorative panel or replace it with a simpler supporting note
- align the three steps in a cleaner rhythm with equal visual importance

Desired result:

- the three-step flow feels dependable and procedural
- no layout move feels showy or unstable

VERIFY:

- the section reads top-to-bottom without visual noise
- the steps feel balanced on desktop and stack cleanly on mobile

---

## Phase 4: Update Tests

**Files:**

- `src/components/__tests__/ProofCredentials.test.tsx`
- `src/components/__tests__/ServicesRegistry.test.tsx`
- `src/components/__tests__/ProcessLedger.test.tsx`

CHANGE TO reflect the quieter layouts:

- assert the preserved core copy and landmarks
- stop asserting decorative structures that are intentionally removed
- add assertions for the simplified primary reading surfaces if needed

VERIFY: run the three targeted test files

---

## Phase 5: Verify

RUN these commands:

```bash
npx jest src/components/__tests__/ProofCredentials.test.tsx src/components/__tests__/ServicesRegistry.test.tsx src/components/__tests__/ProcessLedger.test.tsx --runInBand
npm test -- --runInBand
npm run build
```

Manual QA:

- Desktop and mobile review at `http://127.0.0.1:3003`
- Confirm the mid-page now feels calmer than `Hero` and `TheFirm`
- Confirm no section feels visually louder than its content

---

## Checklist

### Phase 1
- [ ] Proof simplified into a clean trust ledger

### Phase 2
- [ ] Services simplified into a cleaner service list

### Phase 3
- [ ] Process simplified into a stable three-step flow

### Phase 4
- [ ] Targeted tests updated

### Phase 5
- [ ] Targeted Jest tests pass
- [ ] `npm test -- --runInBand` passes
- [ ] `npm run build` passes

---

## Do NOT Do

- Do NOT invent new trust claims
- Do NOT add more image ornaments
- Do NOT reintroduce diagonals, stagger gimmicks, or offset choreography
- Do NOT let these sections outshine `TheFirm`
