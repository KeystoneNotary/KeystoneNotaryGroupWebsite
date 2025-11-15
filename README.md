# Keystone Notary Group LLC - Website

Professional notary services website with dark glassmorphism design, parallax effects, and GSAP scroll animations.

## Features

- Dark glass theme with frosted glass effects
- Parallax video background on hero section
- GSAP scroll-triggered animations (forward/reverse)
- Mobile-first responsive design with hamburger menu
- Scroll progress indicator
- Loading screen animation
- Floating call-to-action button
- Back-to-top button
- Form validation with inline feedback
- Testimonials section
- Service icons with animations
- Schema.org LocalBusiness markup for SEO
- Accessibility compliant (WCAG)
- Lazy loading for images

## Tech Stack

- HTML5 (Semantic markup)
- CSS3 (Grid, Flexbox, Custom Properties, Glassmorphism)
- Vanilla JavaScript
- GSAP 3.12.5 with ScrollTrigger
- Schema.org structured data

## Project Structure

```
KeystoneNotaryGroupLLC-Website/
├── public/
│   └── assets/                  # Static assets served as-is by Vite
├── src/
│   ├── index.html               # HTML template consumed by Vite during dev/build
│   ├── main.js                  # Vite entry point that imports global styles and scripts
│   ├── js/
│   │   ├── main.js              # Bootstraps UI modules once the DOM is ready
│   │   ├── ai-chat.js
│   │   ├── constants.js
│   │   └── modules/             # Feature-specific modules (animations, forms, etc.)
│   ├── partials/                # Layout and section HTML fragments
│   └── styles/
│       ├── main.css             # Root stylesheet imported by src/main.js
│       ├── ai-chat.css
│       └── components/          # Component-scoped style sheets
├── tests/
│   └── main.test.js             # Vitest unit tests
├── eslint.config.js             # Linting rules
├── package.json                 # Project metadata and scripts
├── vite.config.mjs              # Vite build and dev server configuration
└── vitest.config.mjs            # Vitest configuration
```

## Setup

1. Clone or download the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (which serves `src/index.html`):
   ```bash
   npm run dev
   ```
4. Open the printed local development URL (typically `http://localhost:5173`) in a modern browser.

## Customization

### Update Contact Information

Edit the contact section in `src/index.html`:
- Phone number
- Email address
- Service area
- Schema.org business details

### Modify Colors

Edit CSS custom properties in `src/styles/main.css`:
```css
:root {
    --bg-dark: #0a0e27;
    --accent-silver: #c0c0c0;
    --accent-gold: #d4af37;
}
```

### Adjust Animations

Modify GSAP animations in `src/js/main.js` and supporting modules in `src/js/modules/`:
- ScrollTrigger start/end points
- Animation duration and easing
- Stagger timing

## Spacing & Layout System

- Modular scale defined in `src/styles/main.css` (`--space-2xs` through `--space-4xl`) driven by a fluid base and 1.333 ratio.
- Horizontal gutters rely on `--space-gutter` to stay responsive while aligned to the scale.
- Reference usage guidance and examples in [`docs/spacing-map.md`](docs/spacing-map.md) and the live spacing key rendered near the site footer.

## Testing

Run unit tests with your preferred test runner:
```bash
npm test
```

## Performance

- Optimized for Core Web Vitals
- Lazy loading ready
- Minimal external dependencies
- Efficient CSS and JS

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2024 Keystone Notary Group LLC. All rights reserved.
