# Spacing Scale Reference

The Keystone Notary Group site uses a modular spacing rhythm driven by a custom property scale. The base unit is `--space-sm`, derived from a fluid clamp value and multiplied by the ratio `--space-ratio` (≈1.333) to move up or down the ladder. This keeps gutters and stack spacing proportional across breakpoints.

| Token | Calculation | Approx. Range (rem) | Primary Usage |
| --- | --- | --- | --- |
| `--space-2xs` | `var(--space-xs) / var(--space-ratio)` | 0.35 – 0.55 | Hairline dividers, badge trims |
| `--space-xs` | `var(--space-sm) / var(--space-ratio)` | 0.45 – 0.75 | Compact gaps, label padding |
| `--space-sm` | Base clamp | 0.70 – 1.40 | Input padding, dense stack spacing |
| `--space-md` | `var(--space-sm) * var(--space-ratio)` | 0.93 – 1.90 | Card gutters, media padding |
| `--space-lg` | `var(--space-md) * var(--space-ratio)` | 1.24 – 2.54 | Heading spacing, grid columns |
| `--space-xl` | `var(--space-lg) * var(--space-ratio)` | 1.65 – 3.39 | Section sub-grid gaps, CTA offsets |
| `--space-2xl` | `var(--space-xl) * var(--space-ratio)` | 2.20 – 4.51 | Card shells, footer columns |
| `--space-3xl` | `var(--space-2xl) * var(--space-ratio)` | 2.93 – 6.01 | Section top/bottom rhythm |
| `--space-4xl` | `var(--space-3xl) * var(--space-ratio)` | 3.90 – 8.01 | Legacy hero/feature token (superseded) |

### Section rhythm helpers

| Token | Clamp Range (rem) | Purpose |
| --- | --- | --- |
| `--hero-padding-block` | 3.0 – 6.5 | Primary hero breathing room without forcing full viewport height |
| `--section-padding-block` | 2.5 – 4.5 | Shared vertical padding for interior sections |
| `--section-gap` | 1.75 – 2.75 | Divider spacing and inter-section rhythm |

Additional helper:

- `--space-gutter`: `clamp(var(--space-xl), 5vw, var(--space-3xl))` keeps horizontal gutters fluid while respecting the modular ladder.

## Implementation Notes

- Prefer the tokens above for all padding, margin, and gap values in sections, cards, and forms.
- When a component needs intermediate spacing, compose using neighboring tokens (e.g., `calc(var(--space-sm) + var(--space-xs))`).
- The [spacing key](../index.html) near the footer renders each token for quick visual QA and regression checks.

## Usage Examples

```css
.hero-section {
  min-height: clamp(30rem, 70vh, 48.75rem);
  padding: var(--hero-padding-block) var(--space-gutter);
}

.surface-section {
  padding: var(--section-padding-block) var(--space-gutter);
}

.section-divider {
  margin: var(--section-gap) auto;
}

.glass-card {
  padding: var(--space-2xl);
  gap: var(--space-md);
}

.booking-form input {
  padding: var(--space-sm) var(--space-md);
}
```
