# Design Decisions – Keystone Notary Group UI Enhancements

## Overview
Project scope: elevate all sections following “Who We Are” to a luxury-grade, conversion-focused experience while preserving accessibility and performance guarantees. This document records explored options and the selected direction for each improvement phase.

## Core Principles
- Maintain the glassmorphism aesthetic with refined hierarchy and restraint.
- Increase action clarity via per-section calls to action and progressive disclosure.
- Preserve WCAG AA compliance, responsive behavior, and existing JavaScript flows.
- Document alternatives considered to justify chosen implementations.

## Phase 0 – Discovery & Guardrails
- Capture baseline screenshots and interaction recordings to document current behavior.
- Run Lighthouse and axe audits to set regression thresholds for performance and accessibility.
- Outcome: treat captured metrics as quality gates for subsequent phases.

## Phase 1 – Services Section Recomposition
Options evaluated:
1. **2+1 asymmetrical grid (Selected)** – Primary service spans two columns with supporting stack. Balances drama, scanability, and responsive simplicity.
2. Rotating carousel of secondary cards – Rejected due to interaction overhead and accessibility complexity.
3. Vertical stack with sticky context panel – Rejected for excessive mobile scroll length and layout weight.

Chosen approach:
- Reduce card footprint, tighten typography, and replace heavy glow effects with directional lighting.
- Introduce per-card CTAs and tempered hover transitions for a premium feel.
- Adjust descriptive copy contrast for readability against glass backgrounds.

## Phase 2 – Credentials Hierarchy
Options evaluated:
1. **Staggered timeline with featured metric chip (Selected)** – Retains narrative flow while elevating the “$100K E&O” trust anchor.
2. Horizontal badge carousel – Rejected; motion fatigue and limited mobile space.
3. Masonry stats grid – Rejected; sacrifices storytelling clarity.

Chosen approach:
- Compress badge stack height and emphasize the key metric via accent styling.
- Reformat timeline into two-column pairings (title + checklist) for faster scanning.
- Add a credential logo strip beneath metrics to deliver instant credibility cues.
- Implemented as a split-grid with GSAP-ready data hooks, vertical spine step cards, and a compliance CTA bar to maintain luxury glassmorphism while improving scanability.

## Phase 3 – Booking Experience Revamp
Options evaluated:
1. **Inline progress tracker with always-visible summary (Selected)** – Preserves page-based flow while clarifying steps.
2. Modal wizard – Rejected for breaking deep-linking and requiring a heavy JS rewrite.
3. Tabbed panels – Rejected; weaker ergonomics on mobile.

Chosen approach:
- Reveal appointment summary by default and enhance the stepper with connecting progress indicators.
- Differentiate active panels through color and elevation changes.
- Convert high-friction inputs to chip/multi-select patterns; isolate compliance checkbox within a distinct card.
- Add a mobile-first concierge helper element for rapid assistance.

## Phase 4 – FAQ & Contact Refinement
FAQ decisions:
- Constrain content width, alternate subtle background treatments, and upgrade accordion animations (opacity + slide).
- Inject contextual micro-CTAs every few questions to funnel users toward contact options.

Contact decisions:
- Differentiate “Message our team” vs. “Concierge scheduling” cards via tonal contrast.
- Add iconography for contact channels and surface a response-time guarantee badge.
- Explore inline visualization of service radius while monitoring asset weight.

## Phase 5 – Spacing Map & Ancillary Widgets
- Preferred: relocate spacing guide to a dedicated design-system page. If mandated to stay, restyle as a slim ribbon with animated swatches to reduce cognitive load.
- Revisit floating CTA and back-to-top widgets for mid-width breakpoints; evaluate dual-action (Call/Text) concept vs. modal reveal.

## Phase 6 – Integration & QA
- Consolidate changes and rerun Lighthouse/axe plus visual regression coverage (e.g., Playwright snapshots) across updated sections.
- Update LAUNCH.MD, memory/change_log.md, and supporting documentation; prepare annotated before/after assets for stakeholder review.

## 2025-01-06 – Layout Rail Realignment & Section Spacing
- Issue: Sections implemented during the services/credentials revamp were not wrapped in the shared layout container, causing narrow columns and excess negative space beside secondary cards.
- Decision: Restore the global layout rails by wrapping each major section in the existing `.layout-container` shell (with a dedicated `.section-inner` helper) so content aligns with the navigation/footer and spacing remains modular.
- Implementation:
  - Updated `index.html` to add `.layout-container.section-inner` wrappers for Services, Credentials, Booking, FAQ, Contact, and Spacing Map without altering GSAP/data attributes.
  - Adjusted `css/styles.css` to rely on the new wrappers, align grids to `flex-start`, narrow service stack gaps, widen booking layouts, and relax `contact-grid` minimum widths for small screens.
  - Verified media queries inherit the layout without additional JavaScript or structural changes.

## 2025-01-06 – Vite Build Pipeline & Modular Template Migration
- Issue: Single-file HTML structure limited maintainability for GSAP/parallax enhancements and future chat/booking integrations; no modern build tooling for asset optimization.
- Decision: Adopt Vite with Handlebars-based partials, moving assets into `public/` and source code into `src/` for modular development while producing a single optimized output page.
- Implementation:
  - Created `vite.config.cjs` with `vite-plugin-handlebars`, registering partial directories and injecting shared site metadata (current year, contact info).
  - Split `index.html` into semantic partials (`loader`, `navigation`, section blocks, footer, schema) under `src/partials/`, and wired them through a template-driven root `src/index.html`.
  - Moved CSS/JS into module-friendly entries (`src/styles`, `src/main.js`) so Vite handles bundling, while preserving CommonJS exports for Jest.
  - Relocated static assets to `public/assets` for direct serving and updated references to root-relative paths.
  - Replaced the legacy Jest harness with Vitest so tests run inside the Vite toolchain (ESM modules, `vitest.config.mjs` with jsdom environment, CommonJS exports removed from source).
