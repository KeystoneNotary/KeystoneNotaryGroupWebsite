# Keystone Notary Group Design Standards

## Color Palette
### Primary Palette
- **Platinum**: #E6E6E6 (Primary text and highlights)
- **Black**: #000000 (Backgrounds and deep contrasts)
- **White**: #FFFFFF (Pure white elements)

### Accent Colors
- **Silver-Metallic**: #C0C0C0 (Key accents, service titles, special highlights)
- **Silver-Mid**: #A0A0A0 (Secondary accents, kicker text)

### Gray Scale (Standardized)
- **Gray-900**: #111111 (Darkest grays for backgrounds)
- **Gray-800**: #1E1E1E (Card backgrounds, borders)
- **Gray-700**: #333333 (Unused - skip to Gray-600)
- **Gray-600**: #666666 (Placeholder text)
- **Gray-500**: #999999 (Labels, secondary text)
- **Gray-400**: #CCCCCC (Body text)
- **Gray-300**: #DDDDDD (Unused - skip to Gray-200)
- **Gray-200**: #EEEEEE (Light accents)
- **Gray-100**: #F5F5F5 (Unused - skip to White)

## Typography System
### Font Families
- **Serif**: Headlines, titles, numbers (Georgia, Times New Roman, serif fallbacks)
- **Sans-serif**: Body text, labels, UI elements (System UI, -apple-system, BlinkMacSystemFont, sans-serif fallbacks)

### Font Weights & Styles
- **Headlines**: `font-light` (300) for elegant, refined appearance
- **Body Text**: Regular weight (400)
- **Emphasis**: Italic for silver-metallic accent words
- **Buttons/Labels**: Medium (500) for clarity

### Text Hierarchy
1. **Display Headlines**: 5xl-6xl (.text-5xl/.text-6xl)
2. **Section Headlines**: 4xl-5xl (.text-4xl/.text-5xl)
3. **Subheadings**: 3xl (.text-3xl)
4. **Service Titles**: 3xl-5xl (.text-3xl/.text-5xl)
5. **Body Text**: lg-xl (.text-lg/.text-xl)
6. **Labels/Captions**: xs-sm (.text-xs/.text-sm)

## Spacing & Layout
### Padding Standards
- **Sections**: py-24 md:py-32 (vertical), px-6 md:px-12 (horizontal)
- **Cards**: p-6 md:p-10 (tight), p-10 md:p-12 (spacious)
- **Content Blocks**: space-y-4 (tight), space-y-6 (standard), space-y-10/20 (generous)

### Border Radius
- **Sharp Elements**: Default (none)
- **Cards**: rounded-xl (standard), rounded-2xl (premium)
- **Pills/Buttons**: rounded-full (circular elements)

## Visual Effects
### Glassmorphism Pattern
- `bg-white/10` or `bg-neutral-900/60` (translucent backgrounds)
- `backdrop-blur` (blurred background effect)
- `ring-1 ring-white/10` or `ring-1 ring-neutral-800` (subtle borders)
- `border border-white/20` (for button states)

### Kinetic Typography
- Blur transitions (`filter: blur(0px)` to `filter: blur(10px)`)
- Scale effects (`scale: 0.95` to `scale: 1`)
- Position shifts (`y: 100` to `y: 0`)
- Rotation for numbers (`rotation: -10` to `rotation: 0`)

## Component Patterns
### Buttons
- **Primary**: Glassmorphism with hover effects
- **Secondary**: Simple text with hover states
- **States**: Disabled, loading, active, hover

### Cards
- **Structure**: Layered with z-index positioning
- **Effects**: Backdrop blur, translucent backgrounds
- **Borders**: Subtle rings or borders for definition

### Forms
- **Inputs**: Bottom-border only, transparent backgrounds
- **Placeholders**: Gray-600 for subtle visibility
- **Focus States**: Silver-Mid border highlighting
- **Validation**: Clear error/success states

## Content Standards
### Voice & Tone
- **Authoritative**: Position as certification authority, not service provider
- **Precise**: Specific language that conveys expertise
- **Confident**: Avoid hedging or uncertain phrasing
- **Professional**: Formal but accessible

### Copy Patterns
- **Headlines**: Direct, benefit-focused
- **Descriptions**: Value propositions with elite positioning
- **Calls-to-action**: Action-oriented, confidence-inspiring
- **Legal/Compliance**: Clear, comprehensive, reassuring

## Technical Standards
### Code Quality
- Zero ESLint warnings or errors
- Strict TypeScript typing
- No unused variables or imports
- Proper error handling with typed catches

### Performance
- Optimized animations (will-change, force3D)
- Efficient re-renders (useMemo, useCallback)
- Lazy loading where appropriate
- Minimal bundle impact

### Accessibility
- Proper semantic HTML
- ARIA labels for interactive elements
- Sufficient color contrast ratios
- Keyboard navigation support
