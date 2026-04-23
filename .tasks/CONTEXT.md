# UI Refinement Context

## Project

- Next.js 16 marketing and booking site for Keystone Notary Group LLC.
- Current homepage order in [page.tsx](C:\Users\tkrup\GithubRepos\KeystoneNotaryGroupLLC-Website\src\app\page.tsx):
  - `Header`
  - `Hero`
  - `TheFirm`
  - `ProofCredentials`
  - `ServicesRegistry`
  - `ProcessLedger`
  - `BookingSection`
  - `FAQ`
  - `Contact`
  - `TitaniumFooter`

## Confirmed Direction

- `Hero` should feel elegant and restrained, with the background video visible.
- `TheFirm` has already been reverted and should be treated as the protected visual reference point.
- Remaining sections should feel more polished, quieter, and more structured.
- The site should read as private, premium, and precise, not theatrical or over-designed.
- Booking remains the dominant CTA.

## Non-Goals

- Do not redesign `Hero`.
- Do not redesign or embellish `TheFirm`.
- Do not change backend behavior, API shapes, or booking logic as part of these UI tasks.
- Do not add new features or sections.

## Visual Principles

- Prefer strong typography and spacing over decorative overlays.
- Use fewer large background words, fewer diagonals, fewer offset stacks, and fewer ornamental image layers.
- Keep one dominant visual idea per section.
- Reserve the strongest drama for `Hero` and `TheFirm`; all later sections should be calmer.

## Validation

- Run targeted Jest tests after each phase.
- Run `npm test -- --runInBand` before signoff.
- Run `npm run build` before signoff.
- Visually review at [http://127.0.0.1:3003](http://127.0.0.1:3003) on desktop and mobile.
