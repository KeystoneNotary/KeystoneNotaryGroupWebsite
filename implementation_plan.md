# Implementation Plan - Keystone Notary Group Premium Redesign

# Goal Description
Migrate the existing Vanilla JS application to a **Next.js (React) + Tailwind CSS** architecture. Implement a new "Premium Institution" aesthetic characterized by deep charcoal backgrounds, metallic silver accents, and editorial-style layouts. This is a complete rewrite to elevate the brand to an "Executive" standard.

## User Review Required
> [!WARNING]
> **Major Architecture Change**: This plan involves moving the current Vanilla JS codebase to a backup directory and initializing a new Next.js project in the root.
> **Technology Stack**: Switching to Next.js 14+ (App Router), Tailwind CSS, and Framer Motion (for the silver line/scroll animations).

## Proposed Changes

### 1. Project Restructuring
#### [MODIFY] Root Directory
- Move current contents (`src/`, `index.html`, `vite.config.js`, etc.) to `_legacy_backup/`.
- Initialize new Next.js project in root.

### 2. Design System Setup (Tailwind Config)
#### [NEW] `tailwind.config.ts`
- **Colors**:
    - `charcoal`: `#1A1A1A` (Deep Matte)
    - `obsidian`: `#121212` (Darker contrast)
    - `silver-metallic`: Gradient definition (`#E0E0E0` -> `#F5F5F5` -> `#C0C0C0`)
    - `platinum`: `#E5E4E2`
- **Typography**:
    - Headings: *Playfair Display* or *Cinzel* (Serif)
    - Body: *Inter* or *Lato* (Sans-Serif)

### 3. Component Implementation (TDD Approach)
We will write tests (`__tests__/*.test.tsx`) before implementing components.

#### [NEW] `src/components/TheFirm.tsx` (Section 1)
- **Design**: Split screen (50/50).
- **Left**: Generated Image (Hand with Fountain Pen, B&W, Grainy).
- **Right**: "Precision is our Currency" copy.

#### [NEW] `src/components/ConciergeList.tsx` (Section 2)
- **Design**: Hover-reveal list.
- **Interaction**: Items turn white + silver glow on hover.

#### [NEW] `src/components/SilverTimeline.tsx` (Section 3)
- **Design**: Vertical scroll-triggered timeline.
- **Animation**: Silver line draws down (SVG path + Framer Motion).
- **Logic**: Active step highlighting based on scroll position.

#### [NEW] `src/components/TitaniumFooter.tsx` (Section 4)
- **Design**: Heavy, permanent feel. Black background.

### 4. Assets
- **Images**: Generate "Hand with Fountain Pen" and "Notary Seal" using AI image generation.

## Verification Plan

### Automated Tests
- **Unit/Component Tests**: `npm test` (Jest + React Testing Library).
    - Verify `TheFirm` renders headline.
    - Verify `ConciergeList` items have correct hover classes (static check) or interaction tests.
    - Verify `SilverTimeline` renders all steps.

### Manual Verification
- **Visual Check**:
    - Verify "Silver Gradient" effect looks metallic, not gray.
    - Verify Scroll Animation (Silver Line) flows smoothly.
    - Verify Mobile Responsiveness (Stacking order).
