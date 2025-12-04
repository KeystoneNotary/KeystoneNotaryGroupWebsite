# Change Log – Keystone Notary Group UI Enhancements

- 2025-01-05: Established `.codex/memory/` artifacts and documented the UI enhancement design blueprint for post-“Who We Are” sections.
- 2025-01-05: Logged additional user guidance regarding continuous memory updates and instruction alignment in conversations/context memory files.
- 2025-01-05: Recorded approval of Phase 1 Services section plan with directive to accommodate future GSAP scroll animations.
- 2025-01-05: Added `.codex/previews/services-phase1.html` to visualize the proposed Services layout before implementation.
- 2025-01-05: Captured user preference to proceed without re-requesting permission once a task is approved.
- 2025-01-05: Implemented Phase 1 Services section layout overhaul in `index.html` and `css/styles.css`; added GSAP-ready data hooks and new CTA/trust styling.
- 2025-01-05: Phase 2 credentials redesign plan approved; proceeding with implementation.
- 2025-01-05: Implemented credentials section redesign with split-grid layout, timeline step cards, and compliance CTA (`index.html`, `css/styles.css`).
- 2025-01-05: Post-audit fixes applied to restore Services section label, enforce explicit grid placements, and correct credential logo list semantics (`index.html`, `css/styles.css`).
- 2025-01-06: Realigned section layouts with shared `.layout-container` rails and tuned Services/Credentials/Booking/Contact spacing to resolve horizontal drift (`index.html`, `css/styles.css`).
- 2025-01-06: Migrated site to Vite + Handlebars partials, moving assets into `public/`, source into `src/`, and adding modular entrypoints for CSS/JS (`src/index.html`, `src/main.js`, `vite.config.cjs`, `package.json`).
- 2025-01-06: Swapped Jest for Vitest, converting source modules to ESM exports, updating tests to Vitest APIs, and adding `vitest.config.mjs` (`src/js/*.js`, `tests/*.test.js`, `package.json`).
