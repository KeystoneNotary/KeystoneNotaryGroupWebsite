# Implementation Plan - Avant-Garde Pivot & Production Hardening

## Goal Description

Pivot the design to a "Masterpiece" aesthetic, removing all "boxy" elements and standard layouts. The "Philosophy" section (`TheFirm.tsx`) is the gold standard: kinetic typography, exploded assembly animations, and pure void/negative space. Followed by rigorous production hardening via TDD.

## User Review Required

- **Design Pivot**: Moving away from standard grids/cards to purely typographic and fluid layouts.
- **Testing**: Establishing a comprehensive test suite for all critical components.

## Proposed Changes

### Phase 6: The Avant-Garde Pivot (Completed)

#### [MODIFY] [HorizontalServices.tsx](file:///c:/Users/tkrup/Github%20Repos/KeystoneNotaryGroupLLC-Website/src/components/HorizontalServices.tsx)

- **Kinetic Typography**: Implemented "exploded" text animations.
- **Parallax**: Massive background numbers.

#### [MODIFY] [BookingSection.tsx](file:///c:/Users/tkrup/Github%20Repos/KeystoneNotaryGroupLLC-Website/src/components/BookingSection.tsx)

- **Ethereal Interface**: Removed calendar grid lines, added floating UI.
- **Animations**: Radial explosion for calendar days.

#### [MODIFY] [ServiceCoverage.tsx](file:///c:/Users/tkrup/Github%20Repos/KeystoneNotaryGroupLLC-Website/src/components/ServiceCoverage.tsx)

- **Fluid Layout**: Removed list/grid containers.
- **Animations**: Exploded assembly for area cards.

### Phase 7: Production Hardening (In Progress)

#### [NEW] [Test Suite](file:///c:/Users/tkrup/Github%20Repos/KeystoneNotaryGroupLLC-Website/src/components/__tests__)

- `HorizontalServices.test.tsx`: Verify kinetic typography rendering.
- `BookingSection.test.tsx`: Verify calendar logic and interaction.
- `ServiceCoverage.test.tsx`: Verify content rendering.
- `Header.test.tsx`: Verify navigation and mobile menu.
- `Contact.test.tsx`: Verify form fields and submission.

## Verification Plan

### Automated Tests

- `npm test`: Run full Jest suite.
- Verify all components pass with new GSAP mocks.

### Manual Verification

- Visual check of animations on desktop and mobile.
- Verify booking flow functionality.
