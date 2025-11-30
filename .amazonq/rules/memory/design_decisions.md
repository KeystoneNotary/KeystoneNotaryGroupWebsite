# Design Decisions - Keystone Notary Group LLC Website

**Purpose:** Document architectural choices, trade-offs, and rationale for major technical decisions

---

## INITIAL ARCHITECTURE DECISIONS

### 1. Single-Page Application (SPA) Approach
**Decision:** Build as SPA with scroll-triggered sections  
**Date:** Original implementation  
**Rationale:**
- Smooth user experience with GSAP animations
- Reduced server requests
- Better control over scroll behavior
- Suitable for content-focused site with limited pages

**Trade-offs:**
- SEO considerations (mitigated with Schema.org markup)
- Initial load time slightly higher
- Requires JavaScript for full functionality

**Alternatives Considered:**
- Multi-page site (rejected: unnecessary complexity for content volume)
- Framework-based SPA (rejected: overkill for project scope)

---

### 2. Vanilla JavaScript Over Framework
**Decision:** Use vanilla JS instead of React/Vue/Angular  
**Date:** Original implementation  
**Rationale:**
- Minimal dependencies
- Faster load time
- Easier maintenance for small team
- No build complexity initially
- Direct DOM control for animations

**Trade-offs:**
- More verbose code for state management
- Manual DOM manipulation
- No component reusability

**Alternatives Considered:**
- React (rejected: too heavy for simple site)
- Alpine.js (considered for future refactor)

---

### 3. GSAP for Animations
**Decision:** Use GSAP 3.12.5 with ScrollTrigger  
**Date:** Original implementation  
**Rationale:**
- Industry-standard animation library
- Excellent performance
- ScrollTrigger provides smooth scroll effects
- Reverse animations on scroll up

**Trade-offs:**
- External CDN dependency (mitigated with availability check)
- Adds ~100KB to page weight
- Requires learning curve

**Alternatives Considered:**
- CSS animations only (rejected: limited scroll control)
- Intersection Observer API (rejected: less smooth)
- Framer Motion (rejected: requires React)

---

### 4. Dark Glassmorphism Design System
**Decision:** Dark theme with frosted glass effects as primary design  
**Date:** Original implementation  
**Rationale:**
- Modern, professional aesthetic
- Differentiates from competitors
- Backdrop-filter creates depth
- Aligns with "trust and precision" brand values

**Trade-offs:**
- Browser compatibility (backdrop-filter not in IE11)
- Accessibility concerns with contrast (addressed with theme switcher)
- Performance cost of blur effects

**Alternatives Considered:**
- Traditional flat design (rejected: too generic)
- Neumorphism (rejected: accessibility issues)

---

### 5. CSS Custom Properties for Theming
**Decision:** Use CSS variables for colors, spacing, and typography  
**Date:** Original implementation  
**Rationale:**
- Easy theme switching (dark/neutral/light)
- Consistent design system
- No preprocessor needed
- Runtime theme changes

**Trade-offs:**
- No IE11 support
- Slightly more verbose CSS

**Alternatives Considered:**
- Sass variables (rejected: requires build step)
- Hardcoded values (rejected: unmaintainable)

---

### 6. Fluid Typography with clamp()
**Decision:** Use CSS clamp() for responsive font sizes  
**Date:** Original implementation  
**Rationale:**
- Smooth scaling across viewports
- No media query breakpoints needed
- Better reading experience
- Reduces CSS complexity

**Trade-offs:**
- Browser support (IE11 not supported)
- Harder to debug specific sizes

**Alternatives Considered:**
- Media query breakpoints (rejected: too rigid)
- JavaScript-based scaling (rejected: performance)

---

## REMEDIATION PHASE DECISIONS

### 7. Backend Architecture (Pending)
**Decision:** TBD - Awaiting Phase 1 implementation  
**Options Under Consideration:**
1. **Serverless (AWS Lambda + API Gateway)**
   - Pros: Scalable, cost-effective, no server management
   - Cons: Cold start latency, vendor lock-in
2. **Node.js/Express on VPS**
   - Pros: Full control, predictable costs
   - Cons: Server management overhead
3. **Netlify Functions**
   - Pros: Easy deployment, integrated with hosting
   - Cons: Limited to 10s execution time

**Recommendation:** Serverless (AWS Lambda or Netlify Functions) for simplicity and scalability

---

### 8. Email Service Provider (Pending)
**Decision:** TBD - Awaiting Phase 1 implementation  
**Options Under Consideration:**
1. **SendGrid**
   - Pros: 100 emails/day free, good deliverability
   - Cons: Requires API key management
2. **AWS SES**
   - Pros: Very cheap, reliable
   - Cons: Requires AWS account, more setup
3. **Mailgun**
   - Pros: Developer-friendly, good docs
   - Cons: Pricing higher than SES

**Recommendation:** SendGrid for ease of setup, AWS SES for long-term cost savings

---

### 9. Build Tool Selection (Pending)
**Decision:** TBD - Awaiting Phase 2 implementation  
**Options Under Consideration:**
1. **Vite**
   - Pros: Fast, modern, great DX
   - Cons: Newer, smaller ecosystem
2. **Webpack**
   - Pros: Mature, extensive plugins
   - Cons: Complex configuration
3. **Parcel**
   - Pros: Zero config
   - Cons: Less control

**Recommendation:** Vite for speed and simplicity

---

### 10. Testing Strategy (Pending)
**Decision:** TBD - Awaiting Phase 3 implementation  
**Current:** Jest for unit tests  
**Planned Additions:**
- Playwright for E2E testing (cross-browser)
- Percy or Chromatic for visual regression
- Lighthouse CI for performance regression

**Rationale:**
- Playwright: Better than Cypress for multi-browser
- Visual regression: Catch UI bugs automatically
- Lighthouse CI: Prevent performance degradation

---

## SPACING SYSTEM DECISION

### 11. Modular Scale with Fluid Base
**Decision:** Use 1.333 ratio with fluid base (clamp)  
**Date:** Original implementation  
**Rationale:**
- Mathematical harmony (perfect fourth ratio)
- Scales naturally across viewports
- Reduces arbitrary spacing decisions
- Documented in spacing-map.md

**Implementation:**
```css
--space-base: clamp(0.9rem, 0.7rem + 0.5vw, 1.4rem);
--space-ratio: 1.333;
--space-md: calc(var(--space-sm) * var(--space-ratio));
```

**Trade-offs:**
- Requires discipline to use consistently
- Some hardcoded values still exist (to be fixed in Phase 2)

---

## ACCESSIBILITY DECISIONS

### 12. WCAG AA Compliance Target
**Decision:** Target WCAG 2.1 Level AA compliance  
**Date:** Original implementation  
**Rationale:**
- Legal requirement for public-facing business
- Expands customer base
- Improves SEO
- Right thing to do

**Current Status:**
- Semantic HTML ✅
- ARIA labels ✅
- Keyboard navigation ✅
- Color contrast ⚠️ (needs verification)
- Screen reader testing ❌ (pending)

---

## PERFORMANCE DECISIONS

### 13. Lazy Loading Strategy
**Decision:** Lazy load images, defer non-critical JS  
**Date:** Original implementation  
**Rationale:**
- Faster initial page load
- Better Core Web Vitals scores
- Reduced bandwidth for mobile users

**Implementation:**
- Images: `loading="lazy"` attribute
- Videos: Autoplay only hero video
- Scripts: GSAP loaded from CDN (cached)

**Pending Improvements:**
- Video lazy loading
- Service worker caching
- Resource hints (preload/prefetch)

---

## SECURITY DECISIONS

### 14. Client-Side Validation Only (Current - TO BE FIXED)
**Decision:** Currently only client-side validation  
**Status:** ❌ CRITICAL ISSUE  
**Remediation Plan (Phase 1):**
- Add server-side validation
- Implement reCAPTCHA v3
- Add rate limiting
- Sanitize all inputs

**Rationale for Fix:**
- Client-side validation easily bypassed
- Security vulnerability
- Spam prevention

---

## DEPLOYMENT DECISIONS (Pending)

### 15. Hosting Platform (TBD)
**Options Under Consideration:**
1. **Netlify**
   - Pros: Easy deployment, free SSL, CDN included
   - Cons: Limited backend options
2. **Vercel**
   - Pros: Excellent performance, serverless functions
   - Cons: Pricing for high traffic
3. **AWS S3 + CloudFront**
   - Pros: Scalable, cheap, full control
   - Cons: More setup complexity

**Recommendation:** Netlify for simplicity, AWS for enterprise scale

---

## FUTURE CONSIDERATIONS

### Potential Enhancements (Post-Launch)
- [ ] Add online payment processing for notary fees
- [ ] Implement real-time availability calendar
- [ ] Add customer portal for document tracking
- [ ] Integrate with scheduling software (Calendly)
- [ ] Add live chat support
- [ ] Implement progressive web app (PWA) features

---

## DECISION LOG TEMPLATE

For future decisions, use this format:

**Decision:** [What was decided]  
**Date:** [When]  
**Context:** [Why this decision was needed]  
**Options Considered:** [Alternatives]  
**Rationale:** [Why this option was chosen]  
**Trade-offs:** [What we're giving up]  
**Success Criteria:** [How we'll measure success]  
**Review Date:** [When to revisit]

---

---

## SYSTEM ARCHITECTURE DECISIONS

### 16. Continuous Memory Update Protocol
**Decision:** Implement real-time memory updates instead of session-end updates  
**Date:** Current Session  
**Context:** User identified that memory should function like a real brain, storing information when learned
**Rationale:**
- Prevents information loss during sessions
- Improves continuity between interactions
- Enables better context awareness
- Mimics natural brain function

**Implementation:**
- Update `memory/context.md` after significant interactions
- Log conversations in real-time
- Track decisions as they're made
- Progressive change logging
- Memory-first protocol

**Trade-offs:**
- More frequent file writes
- Slightly more complex workflow
- Better continuity and context retention

**Success Criteria:**
- No more "where did we leave off" confusion
- Seamless session continuity
- Real-time project state awareness

---

---

## UPGRADE DECISIONS (Current Session)

### 17. Dependency Version Strategy
**Decision:** Upgrade all dependencies to latest stable versions  
**Date:** Current Session  
**Rationale:**
- Vite 6.0.3: Performance improvements, better HMR, security fixes
- Vitest 2.1.8: Improved test runner, better coverage reporting
- jsdom 25.0.1: Latest DOM implementation, bug fixes
- GSAP in package.json: Proper version locking vs CDN

**Trade-offs:**
- Potential breaking changes (mitigated by testing)
- Need to run npm install
- Better long-term maintainability

---

### 18. Configuration Consolidation
**Decision:** Merge config.js into constants.js  
**Date:** Current Session  
**Rationale:**
- Duplicate configuration files create maintenance burden
- Single source of truth prevents inconsistencies
- Easier to locate configuration values

**Implementation:**
- Kept constants.js (better name for configuration)
- Updated all imports across 5 modules
- Deleted config.js

**Trade-offs:**
- One-time refactor effort
- Cleaner codebase
- Reduced confusion

---

### 19. Code Quality Tooling
**Decision:** Add ESLint 9 + Prettier  
**Date:** Current Session  
**Rationale:**
- No linting = inconsistent code style risk
- ESLint 9 uses modern flat config format
- Prettier ensures consistent formatting
- Industry standard practice

**Configuration:**
- ESLint: Recommended rules, browser + node globals
- Prettier: Single quotes, 100 char width, no trailing commas

**Trade-offs:**
- Adds dev dependencies
- Enforces code standards
- Catches bugs early

---

### 20. Vite Config Modernization
**Decision:** Use ESM path resolution, add code splitting  
**Date:** Current Session  
**Rationale:**
- `process.cwd()` unreliable in ESM modules
- `import.meta.url` + `fileURLToPath` is modern standard
- GSAP code splitting reduces initial bundle size

**Implementation:**
```js
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

**Trade-offs:**
- Slightly more verbose
- More reliable path resolution
- Better production builds

---

**Last Updated:** Current Session  
**Next Review:** After dependency testing
