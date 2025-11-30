# Session Context – Keystone Notary Group UI Enhancements

## Current Focus
Establishing a Vite-based build pipeline with modular Handlebars partials, then validating GSAP/chat/booking features still initialize correctly within the new structure.

## Status
- Vite + `vite-plugin-handlebars` scaffolded (`vite.config.cjs`) with source relocated to `src/` and static assets moved to `public/`.
- `src/index.html` now composes sections via partials; CSS/JS imported through `src/main.js` so bundling is handled automatically.
- Tests now run via Vitest with a jsdom environment; source modules expose ESM exports consumed by the updated suites.
- Layout rail alignment improvements retained post-migration; section assets referenced via `/assets/...`.

## Next Steps
1. Install updated dependencies (`npm install`) and run `npm run dev` / `npm run build` to validate the Vite pipeline locally.
2. Execute `npm run test` (Vitest) to confirm the converted suites pass; smoke test GSAP animations, booking flow, and chat widget under the dev server.
3. Plan Phase 3 booking UX work once the build is verified in CI and Lighthouse/axe baselines are re-run.

## Open Questions
- Preferred CI strategy for running `vite build` + `vitest run` (GitHub Actions vs. alternative).
- Evaluate if additional Vitest setup files/mocking utilities are needed as we expand coverage.
