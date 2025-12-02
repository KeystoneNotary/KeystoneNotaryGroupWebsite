# Change Log - Keystone Notary Group LLC Website

**Purpose:** Track significant changes

---

## COMPLETED PHASES

### Phase 1: Contact Info & Accessibility ✅
- Real business contact information (keystonenotarygroup.com, 267-309-9000, Hellertown PA)
- WCAG AA touch target compliance (44x44px minimum)
- Skip navigation, semantic HTML, ARIA roles
- Consistent spacing with CSS custom properties

### Phase 2: Code Quality ✅
- Created constants.js with configuration values
- Added JSDoc comments
- Extracted magic numbers to named constants

### Phase 3: Backend Infrastructure ✅
- Created .env.example
- Documented Google Calendar/Workspace integration
- Backend templates ready (awaiting service provisioning)

### Phase 4: Deployment Preparation ✅
- Created DEPLOYMENT.md
- Documented Netlify/Vercel/AWS options
- Video/image optimization instructions

---

## CURRENT WORK

**Typography:** ✅ Complete  
**Hero Section:** ✅ Complete  
**Services Section:** ✅ Complete (glassmorphism redesign)  
**Next:** About, Credentials, FAQ, Contact sections

---

## TECHNICAL STACK

- HTML5, CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript
- GSAP 3.12.5 (animations removed temporarily)
- Jest 30.2.0 for testing

---

**Last Updated:** Current Session

---

## UPGRADE: Dependencies & Code Quality (Current Session)

### Dependency Upgrades ✅
- Vite: 5.1.4 → 6.0.3 (latest stable)
- Vitest: 1.3.1 → 2.1.8 (latest stable)
- jsdom: 24.0.0 → 25.0.1 (latest stable)
- GSAP: Added to package.json (3.12.5) - proper dependency management

### Code Quality Tools Added ✅
- ESLint 9.17.0 with flat config format
- Prettier 3.4.2 for consistent formatting
- New scripts: `npm run lint`, `npm run format`

### Configuration Consolidation ✅
- Merged config.js → constants.js (single source of truth)
- Deleted duplicate config.js file
- Updated all module imports to use constants.js

### Build Improvements ✅
- Modern Vite config with ESM path resolution
- Added GSAP code splitting in rollup config
- Added coverage reporting to vitest config
