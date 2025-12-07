# Refactor Tasks: Aligning to Design Standard

**Reference:** `DESIGN_STANDARD.md`
**Benchmark Components:** `Hero.tsx`, `TheFirm.tsx`

---

## HorizontalServices.tsx Gap Analysis

### What's Working
- Generous vertical padding (`py-44 md:py-52`)
- Kinetic typography animations are excellent
- Background parallax numbers add depth
- Label uses correct `text-silver-mid` + `tracking-[0.35em]`

### Failures

| Issue | Current | Standard | Severity |
|-------|---------|----------|----------|
| Headline missing weight | `font-serif text-5xl` | `font-serif text-5xl font-light` | Medium |
| No silver accent | Plain `text-white` headline | Should have `text-silver-metallic italic` accent word | High |
| Service titles ALL CAPS | `"ESTATE & REAL ESTATE"` | Should be title case with elegance | Medium |
| Descriptions lack voice | Functional lists | Elevated, authoritative language | High |
| Kicker tracking | `tracking-[0.35em]` | Standard is `tracking-[0.4em]` | Low |

### Voice Problems (Line-by-Line)

```
Current: "Seamless execution for title companies and attorneys."
Problem: Generic, forgettable.
Fix: "Where seven-figure transactions close without friction."

Current: "Discretion and punctuality at your office or residence."
Problem: Decent but "punctuality" is pedestrian.
Fix: "Silent precision. Your location. Your timeline."

Current: "Navigating international complexities for you."
Problem: Weak ending "for you" - sounds like a tagline afterthought.
Fix: "Cutting through international red tape others avoid."

Current: "Wills, Trusts, and Power of Attorney."
Problem: Just a list. No voice, no authority.
Fix: "Safeguarding legacy documents that outlive generations."

Current: "Operating agreements and compliance affidavits."
Problem: Reads like a brochure bullet point.
Fix: "The paperwork that protects what you've built."
```

---

## BookingSection.tsx Gap Analysis

### What's Working
- Uses `text-silver-metallic italic` on headline accent
- Decorative blur orbs add atmosphere
- Calendar functionality is solid
- Summary card pattern is clean

### Failures

| Issue | Current | Standard | Severity |
|-------|---------|----------|----------|
| Section height | `min-h-[80vh]` | `min-h-[100dvh]` | Medium |
| Horizontal padding | `px-4 md:px-10` | `px-6` | Low |
| Headline size | `text-4xl md:text-5xl` | `text-5xl md:text-7xl` | High |
| Headline weight | Missing | Add `font-light` | Medium |
| Gray inconsistency | Uses `gray-500/600/700/800` | Standardize to `gray-400/500` | Medium |
| CTA button style | `ring-1 ring-neutral-700` | `bg-white/10 border border-white/20 backdrop-blur-md rounded-full` | High |
| Calendar card | `rounded-3xl` | Should be subtler, less "app-like" | Medium |
| Self-referential copy | "same polish as our philosophy section" | Never reference other sections | High |

### Voice Problems

```
Current: "Reserve mobile notarization, apostille handling, or executive witnessing with the same polish as our philosophy section."
Problems:
  1. "Reserve" is weak (hotel language)
  2. Self-referential breaks immersion
Fix: "Secure your appointment. Mobile notarization, apostille services, and executive witnessing—executed flawlessly."

Current: "Need Assistance?"
Problem: Generic customer service language.
Fix: "Complex Arrangement?"

Current: "Concierge team available for complex packages, hospital signings, and multi-signer coordination."
Problem: Passive, list-like.
Fix: "Our concierge handles hospital signings, multi-party closings, and arrangements others decline."
```

---

## Refactor Tasks

### HorizontalServices.tsx

#### Task 1: Add `font-light` to headline
**File:** `HorizontalServices.tsx:215`
```tsx
// Before
<h2 className="services-headline font-serif text-5xl md:text-6xl text-white leading-tight">

// After
<h2 className="services-headline font-serif text-5xl md:text-6xl font-light text-white leading-tight">
```

#### Task 2: Add silver-metallic accent to headline
**File:** `HorizontalServices.tsx:215-217`
```tsx
// Before
<h2 className="services-headline font-serif text-5xl md:text-6xl text-white leading-tight">
  Precision in motion.
</h2>

// After
<h2 className="services-headline font-serif text-5xl md:text-6xl font-light text-white leading-tight">
  Precision <span className="text-silver-metallic italic">in motion.</span>
</h2>
```

#### Task 3: Tighten kicker tracking
**File:** `HorizontalServices.tsx:212`
```tsx
// Before
tracking-[0.35em]

// After
tracking-[0.4em]
```

#### Task 4: Rewrite service titles to title case
**File:** `HorizontalServices.tsx:27-57`
```tsx
// Before
{ title: "ESTATE & REAL ESTATE", ... }
{ title: "EXECUTIVE MOBILE", ... }
{ title: "APOSTILLE & AUTHENTICATION", ... }
{ title: "SPECIALIZED LEGAL", ... }
{ title: "CORPORATE DOCUMENTS", ... }

// After
{ title: "Estate & Real Estate", ... }
{ title: "Executive Mobile", ... }
{ title: "Apostille & Authentication", ... }
{ title: "Specialized Legal", ... }
{ title: "Corporate Documents", ... }
```

#### Task 5: Rewrite all service descriptions with elevated voice
**File:** `HorizontalServices.tsx:27-57`
```tsx
const services = [
  {
    id: "estate",
    title: "Estate & Real Estate",
    description: "Where seven-figure transactions close without friction.",
    number: "01",
  },
  {
    id: "mobile",
    title: "Executive Mobile",
    description: "Silent precision. Your location. Your timeline.",
    number: "02",
  },
  {
    id: "apostille",
    title: "Apostille & Authentication",
    description: "Cutting through international red tape others avoid.",
    number: "03",
  },
  {
    id: "legal",
    title: "Specialized Legal",
    description: "Safeguarding legacy documents that outlive generations.",
    number: "04",
  },
  {
    id: "corporate",
    title: "Corporate Documents",
    description: "The paperwork that protects what you've built.",
    number: "05",
  },
];
```

#### Task 6: Add silver-metallic to service titles
**File:** `HorizontalServices.tsx:235-237`
```tsx
// Before
<h3 className="service-title font-serif text-3xl md:text-5xl text-white mb-3 leading-[1.1] tracking-tight">
  {service.title}
</h3>

// After
<h3 className="service-title font-serif text-3xl md:text-5xl text-silver-metallic mb-3 leading-[1.1] tracking-tight">
  {service.title}
</h3>
```

---

### BookingSection.tsx

#### Task 7: Increase section minimum height
**File:** `BookingSection.tsx:196`
```tsx
// Before
className="relative min-h-[80vh] bg-black ...

// After
className="relative min-h-[100dvh] bg-black ...
```

#### Task 8: Standardize horizontal padding
**File:** `BookingSection.tsx:196`
```tsx
// Before
px-4 md:px-10

// After
px-6
```

#### Task 9: Increase headline size and add font-light
**File:** `BookingSection.tsx:209`
```tsx
// Before
<h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">

// After
<h2 className="font-serif text-5xl md:text-6xl font-light text-white leading-tight">
```

#### Task 10: Rewrite subhead copy (remove self-reference)
**File:** `BookingSection.tsx:215-217`
```tsx
// Before
<p className="text-neutral-400 text-lg leading-relaxed max-w-3xl mx-auto">
  Reserve mobile notarization, apostille handling, or executive witnessing with the same polish as our philosophy section.
</p>

// After
<p className="text-neutral-400 text-lg leading-relaxed max-w-3xl mx-auto">
  Secure your appointment. Mobile notarization, apostille services, and executive witnessing—executed flawlessly.
</p>
```

#### Task 11: Update submit button to match Hero CTA pattern
**File:** `BookingSection.tsx:387-393`
```tsx
// Before
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full px-12 py-4 ring-1 ring-neutral-700 text-white uppercase tracking-[0.2em] text-sm hover:ring-silver-mid hover:text-silver-mid transition-all disabled:opacity-50 disabled:cursor-not-allowed"
>

// After
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full px-12 py-4 bg-white/10 border border-white/20 backdrop-blur-md text-white uppercase tracking-widest text-sm font-medium rounded-full hover:bg-white/20 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
>
```

#### Task 12: Standardize gray colors throughout
**File:** `BookingSection.tsx` (multiple locations)
```tsx
// Replace all instances:
text-gray-600 → text-gray-500
text-gray-700 → text-gray-500
text-gray-800 → text-gray-600

// Specific changes:
Line 227, 237: text-gray-500 → keep
Line 246: text-gray-500 → keep
Line 278: text-gray-600 → text-gray-500
Line 287: text-gray-600 → text-gray-500
Line 329: text-gray-600 → text-gray-500
Line 351, 358, 365, 372, 379: placeholder:text-gray-700 → placeholder:text-gray-600
Line 381: text-gray-500 → keep
Line 402, 407, 422: text-gray-500 → keep
```

#### Task 13: Rewrite "Need Assistance?" card copy
**File:** `BookingSection.tsx:421-434`
```tsx
// Before
<h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
  Need Assistance?
</h4>
<p className="text-sm text-gray-300 mb-4">
  Concierge team available for complex packages, hospital signings, and multi-signer coordination.
</p>

// After
<h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
  Complex Arrangement?
</h4>
<p className="text-sm text-gray-400 mb-4">
  Our concierge handles hospital signings, multi-party closings, and arrangements others decline.
</p>
```

#### Task 14: Soften calendar card border radius
**File:** `BookingSection.tsx:222`
```tsx
// Before
className="space-y-10 rounded-3xl bg-neutral-950/60 ring-1 ring-white/10 p-10 md:p-12 backdrop-blur"

// After
className="space-y-10 rounded-2xl bg-neutral-950/60 ring-1 ring-white/10 p-10 md:p-12 backdrop-blur"
```

---

## Priority Order

### Critical (Do First)
1. Task 10 - Remove self-referential copy (breaks immersion)
2. Task 5 - Rewrite service descriptions (voice is wrong)
3. Task 11 - Update submit button (doesn't match brand)

### High
4. Task 2 - Add silver accent to Services headline
5. Task 6 - Silver-metallic service titles
6. Task 9 - Increase Booking headline size
7. Task 13 - Rewrite assistance card

### Medium
8. Task 1, 9 - Add `font-light` to headlines
9. Task 4 - Service titles to title case
10. Task 7 - Full viewport height
11. Task 12 - Gray color standardization
12. Task 14 - Soften card radius

### Low
13. Task 3 - Kicker tracking
14. Task 8 - Padding standardization

---

## Validation Checklist

After refactoring, verify each section passes:

- [ ] Headlines use `font-serif font-light tracking-tight`
- [ ] At least one `text-silver-metallic italic` accent per section
- [ ] All grays are `gray-400` (body) or `gray-500` (labels)
- [ ] CTAs use glassmorphism pattern with `rounded-full`
- [ ] No self-referential language
- [ ] No casual phrases ("Need help?", "We're here for you")
- [ ] Descriptions use elevated vocabulary (certify, unassailable, precision)
- [ ] Section uses `min-h-[100dvh]` or `py-24` minimum
