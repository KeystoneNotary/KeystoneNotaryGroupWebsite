# Change Log

## [Unreleased]

### Performance

- **Hero Video Optimization** - Resolved lag during initial load and scrolling
  - Added GPU acceleration to video element via `will-change: transform, opacity`
  - Removed expensive CSS filters (`brightness-100 contrast-125 saturate-125`) that forced CPU rendering
  - Removed unnecessary `will-change-transform` from 5 text elements (logo, title, subtitle, CTA, scroll indicator)
  - Video now uses dedicated GPU compositing layer, reducing paint operations during scroll
  - Expected improvement: 30-40fps → 55-60fps during scroll through hero section

### Fixed

- Corrected invalid `.markdownlint.json` configuration by moving exclusion patterns to a new `.markdownlintignore` file.
- Unescaped quotes in `src/app/privacy/page.tsx` and `src/app/terms/page.tsx`.
- Unused variables in `CompactCalculator.tsx`, `Header.test.tsx`, and `gsap-animations.ts`.
- Anonymous default export in `gsap-animations.ts`.

### Added

- Comprehensive project context documentation
- Detailed design standards specification
- Technical decisions log
- Completed work summary
- Conversation history documentation

### Changed

- Enhanced memory bank organization
- Improved documentation structure and clarity

## [refactor-design-standards] - 2025-12-07

### Critical Priority Fixes

- Removed self-referential copy in BookingSection.tsx
- Elevated service descriptions in HorizontalServices.tsx
- Enhanced submit button styling with glassmorphism pattern

### High Priority Visual Enhancements

- Added silver-metallic accents to Services headline
- Changed service titles from white to silver-metallic
- Added font-light weights to headlines
- Increased Booking headline size

### High Priority Content Updates

- Rewrote assistance card copy in BookingSection.tsx
- Changed heading from "Need Assistance?" to "Complex Arrangement?"

### Medium Priority Standardization

- Fixed service title casing (Title Case instead of ALL CAPS)
- Standardized section sizing and padding
- Softened calendar card border radius
- Standardized gray color usage throughout

### Low Priority Polish

- Fine-tuned tracking values

### Technical Excellence

- Fixed all ESLint warnings and errors
- Removed unused imports and variables
- Improved type safety (replaced 'any' with 'unknown')
- Maintained full test coverage (61/61 tests passing)

## [backup-before-design-refactor-20251207-113102] - 2025-12-07

### Added

- Automated backup branch before design standard refactor
- Preserved original state for safety

## [backup-before-refactor-20251207-110748] - 2025-12-07

### Added

- Initial backup branch before refactor work
- Snapshot of codebase before improvements

## [ccf9f42] - 2025-12-07

### Fixed

- ESLint warnings and errors in components
- Unused variable 'i' in HorizontalServices.tsx
- Unused imports in BookingSection.tsx
- 'any' type error in BookingSection.tsx
- Unused variables in mapping functions

## [acedac2] - 2025-12-07

### Implemented

- Design standard compliance fixes from REFACTOR_TASKS.md
- Critical priority fixes
- High priority visual enhancements
- High priority content updates
- Medium priority standardization
- Low priority polish

## [cc4d607] - 2025-12-07

### Added

- Backup preservation before design standard refactor
- Safety checkpoint for major changes

## [932e993] - 2025-12-07

### Styled

- Made booking overlay fade in from transparent

## [36195ac] - 2025-12-07

### Styled

- Flipped FAQ gradient to mirror adjacent section

## [Historical Commits] - Previous dates

### Various Improvements

- Initial project setup
- Component development
- Animation implementation
- Test suite creation
- Responsive design enhancements
- Content refinement
- Performance optimizations
