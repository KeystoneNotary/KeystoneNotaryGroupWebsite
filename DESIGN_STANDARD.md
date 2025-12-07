# Design & Tone Guide

**Reference Files:** `Hero.tsx` and `TheFirm.tsx` (The Philosophy section)

This document codifies the visual and tonal standards established by these two benchmark components. All other sections (Services, Booking, Contact, FAQ, Footer) must adhere to these patterns.

---

## 1. The Spacing Rhythm

### Section-Level Spacing
| Pattern | Value | Usage |
|---------|-------|-------|
| Full viewport | `min-h-[100dvh]` | Hero, major sections |
| Section padding | `py-24` | Vertical breathing room on all sections |
| Horizontal padding | `px-6` | Consistent edge padding |
| Content max-width | `max-w-4xl mx-auto` | Constrains readable content |

### Internal Spacing
| Pattern | Value | Usage |
|---------|-------|-------|
| Flex gaps | `gap-6` | Between stacked elements (Hero) |
| Grid gaps | `gap-12` | Between content blocks (Philosophy) |
| Section header margin | `mb-12` | Space below section headers |
| Logo/title separation | `mb-4 md:mb-8` | Logo to headline |
| Subtitle to CTA | `mb-8` | Subtitle bottom margin |
| Label to headline | `mb-4` | Small labels above headlines |

### Responsive Pattern
```
mobile → desktop
py-24 md:py-0      (Philosophy uses py-24 on mobile only)
gap-6 → gap-12     (Scale up gaps on larger screens)
```

---

## 2. The Typography System

### Headline Hierarchy

**Primary Headlines (H1-level)**
```css
font-serif text-3xl md:text-6xl font-light tracking-tight leading-tight
/* OR for dramatic impact: */
font-serif text-5xl md:text-7xl leading-tight
```

**Section Labels (Eyebrow text)**
```css
text-xs tracking-[0.4em] uppercase
/* Color: text-silver-mid */
```

**Subtitle/Taglines**
```css
font-sans text-lg md:text-2xl font-light tracking-[0.2em] uppercase
/* Color: text-gray-300 */
```

**Body Text**
```css
font-sans text-gray-400 text-lg leading-relaxed
```

**CTAs & Buttons**
```css
uppercase tracking-widest text-xs md:text-sm font-medium
```

**Micro Text (Scroll indicators, captions)**
```css
text-[10px] md:text-xs uppercase tracking-widest
/* Color: text-gray-400 */
```

### Typography Rules
1. **Serif (`font-serif`)** → Headlines only (Playfair Display)
2. **Sans (`font-sans`)** → Everything else (Inter)
3. **`font-light`** → Headlines and subtitles (elegant, not heavy)
4. **`tracking-tight`** → Large headlines
5. **`tracking-[0.2em]` to `tracking-[0.4em]`** → Labels and subtitles
6. **`tracking-widest`** → CTAs and micro text
7. **`leading-tight`** → Headlines
8. **`leading-relaxed`** → Body paragraphs

---

## 3. The Platinum Palette

### Color Application

| Element | Class | Hex/Definition |
|---------|-------|----------------|
| **Background (primary)** | `bg-obsidian` | `#121212` |
| **Background (alt)** | `bg-charcoal` | `#1A1A1A` |
| **Gradient overlay** | `from-black via-obsidian to-black opacity-80` | Depth layer |
| **Headline primary** | `text-white` | Pure white for impact |
| **Headline accent** | `text-silver-metallic` | Gradient (see below) |
| **Labels** | `text-silver-mid` | `#E0E0E0` |
| **Subtitles** | `text-gray-300` | Tailwind gray-300 |
| **Body text** | `text-gray-400` | Tailwind gray-400 |
| **Micro text** | `text-gray-400` | Tailwind gray-400 |

### The Silver-Metallic Gradient
```css
/* Defined in globals.css */
.text-silver-metallic {
  background: linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 50%, #C0C0C0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```
**Usage:** Accent words in headlines, decorative emphasis, italic phrases

### Border & Glass Effects
```css
/* Glassmorphism buttons */
bg-white/10 border border-white/20 backdrop-blur-md

/* Hover state */
hover:bg-white/20 hover:scale-105

/* Transitions */
transition-all duration-300
```

### Shadow Usage
```css
/* Headlines */
drop-shadow-lg

/* Buttons */
shadow-lg
```

---

## 4. The Platinum Voice

### Tone Characteristics

**Authority Without Arrogance**
- Speak as an established institution, not a vendor
- Imply exclusivity through language, don't state it

**Precision Language**
- Short, declarative sentences
- Active voice
- No filler words

**Elevated Vocabulary**
Use words like:
- "certify" (not "do" or "complete")
- "unassailable" (not "reliable" or "secure")
- "facilitation" (not "service")
- "anchor of truth" (not "trustworthy")
- "gold standard" (not "best" or "top")
- "presence" (not "being there")

### Voice Examples from Benchmarks

**The Philosophy Headline:**
> "We don't just sign. We certify trust."

**Body Copy:**
> "In a world of digital noise, the physical seal remains the ultimate anchor of truth."

> "From multi-million dollar real estate closings to sensitive estate planning, our presence ensures your transaction is unassailable."

**Hero Tagline:**
> "Trusted. Certified. Available."

### Word Choice Guide

| Instead of... | Use... |
|---------------|--------|
| Service | Facilitation |
| Professional | Certified |
| Fast | Available |
| Reliable | Unassailable |
| Best | Gold standard |
| Help | Certify / Ensure |
| We offer | We provide |
| Great | Premium / Platinum |
| Sign documents | Certify trust |

### Sentence Structure
- Lead with impact: "We certify trust." (not "Our goal is to...")
- Use contrast: "We don't just X. We Y."
- Imply scale: "multi-million dollar", "sensitive estate planning"
- End with assurance: "...your transaction is unassailable."

---

## 5. Component Patterns

### Section Structure
```tsx
<section className="relative min-h-[100dvh] bg-obsidian overflow-hidden flex items-center justify-center py-24">
  {/* Background gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-black via-obsidian to-black opacity-80 z-0" />

  {/* Optional: Parallax typography layer */}
  <h2 className="absolute ... text-[18vw] md:text-[15vw] font-serif text-neutral-900 opacity-50 select-none z-0 pointer-events-none" />

  {/* Main content */}
  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    {/* Label */}
    <span className="block text-silver-mid text-xs tracking-[0.4em] uppercase mb-4">
      Section Label
    </span>

    {/* Headline */}
    <h3 className="font-serif text-5xl md:text-7xl text-white leading-tight">
      Primary Statement.
      <span className="text-silver-metallic italic">Accent phrase.</span>
    </h3>

    {/* Body content */}
    <div className="grid md:grid-cols-2 gap-12 text-left">
      <p className="font-sans text-gray-400 text-lg leading-relaxed">...</p>
    </div>
  </div>
</section>
```

### CTA Button Pattern
```tsx
<a
  href="#target"
  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 backdrop-blur-md text-white uppercase tracking-widest text-xs md:text-sm font-medium rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-lg"
>
  Call to Action
</a>
```

---

## 6. Checklist for Updating Other Sections

When updating Services, Booking, Contact, FAQ, or Footer, verify:

### Spacing
- [ ] Section uses `py-24` minimum vertical padding
- [ ] Content constrained to `max-w-4xl` or `max-w-6xl`
- [ ] Horizontal padding is `px-6`
- [ ] Gaps are `gap-6` (compact) or `gap-12` (spacious)

### Typography
- [ ] Headlines use `font-serif font-light tracking-tight`
- [ ] Labels use `text-xs tracking-[0.4em] uppercase`
- [ ] Body uses `font-sans text-gray-400 text-lg leading-relaxed`
- [ ] CTAs use `uppercase tracking-widest`

### Colors
- [ ] Background is `bg-obsidian` or `bg-charcoal`
- [ ] Gradient overlay present where appropriate
- [ ] Headlines are `text-white` with `text-silver-metallic` accents
- [ ] No bright colors; silver/gray/white only

### Voice
- [ ] Headlines are declarative, not descriptive
- [ ] Body copy uses elevated vocabulary
- [ ] No exclamation points
- [ ] No casual language ("we're here to help!")

---

## 7. Custom Color Reference

From `globals.css`:

```css
--color-charcoal: #1A1A1A;
--color-obsidian: #121212;
--color-platinum: #E5E4E2;
--color-silver-light: #F5F5F5;
--color-silver-mid: #E0E0E0;
--color-silver-dark: #C0C0C0;
```

Font variables:
```css
--font-serif: var(--font-playfair);  /* Playfair Display */
--font-sans: var(--font-inter);       /* Inter */
```
