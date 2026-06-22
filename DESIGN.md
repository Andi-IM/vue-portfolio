---
name: Andi IM Portfolio
description: Andi Irham - Mobile App Developer & AI Enthusiast
colors:
  primary: "#1e40af"
  primary-hover: "#1a44e3"
  primary-light: "#dbeafe"
  bg-primary: "#f7f8fc"
  bg-card: "#ffffff"
  bg-card-hover: "#f1f5f9"
  bg-navbar: "rgba(247, 248, 252, 0.95)"
  text-heading: "#111827"
  text-body: "#4b5563"
  text-muted: "#6b7280"
typography:
  display:
    fontFamily: "'Outfit', sans-serif"
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.625
rounded:
  card: "1rem"
  frame: "1.5rem"
spacing:
  gap-sm: "1rem"
  gap-lg: "3rem"
components:
  skill-card:
    backgroundColor: "{colors.bg-card}"
    rounded: "{rounded.card}"
---

# Design System: Andi IM Portfolio

## 1. Overview

**Creative North Star: "The Professional Showcase"**

The Andi IM Portfolio design system is built to exude technical competence, clarity, and professionalism. It pairs a geometric sans-serif for sharp, confident headings with a highly legible humanist sans-serif for body text. The aesthetic philosophy leans heavily into letting the work and expertise speak for itself—avoiding chaotic layouts, Web3 neon excesses, and generic templates. Instead, it relies on strict typographic rhythm and a restrained color palette anchored by a sharp technical indigo.

**Key Characteristics:**
- Content-first layout prioritizing legibility.
- Deep, confident technical accents that don't overwhelm the user.
- Subtle and refined component borders rather than heavy drop shadows.

## 2. Colors

The color palette is composed of crisp, cool neutrals anchored by a vibrant yet professional Technical Indigo.

### Primary
- **Technical Indigo** (#1e40af): Used for interactive elements, primary buttons, tags, and timeline dots to signify action and technical focus.
- **Indigo Hover** (#1a44e3): A slightly deepened indigo for active interaction states.

### Neutral
- **Page Background** (#f7f8fc): A cool, off-white foundation that provides contrast without the glare of pure white.
- **Card Background** (#ffffff): Pure white to lift content areas subtly from the background.
- **Heading Text** (#111827): A near-black charcoal that guarantees high-contrast legibility for primary display text.
- **Body Text** (#4b5563): A slightly muted slate gray to reduce eye strain during extended reading.
- **Muted Text** (#6b7280): Used for secondary metadata and subtitles.

### Named Rules
**The Content-First Contrast Rule.** Body text must always hit a high contrast ratio against its background. The palette avoids light gray text on tinted backgrounds to ensure maximum readability.

## 3. Typography

**Display Font:** Outfit (with sans-serif fallback)
**Body Font:** Inter (with system-ui fallback)

**Character:** A pairing that balances the sharp, modern geometry of Outfit for impactful headings with the proven, utilitarian legibility of Inter for prose.

### Hierarchy
- **Display** (700, clamp scaling to 3.75rem, 1.25): Hero headlines. Uses tighter letter-spacing (-0.025em) to maintain cohesiveness at large sizes.
- **Title** (600, 1.25rem, 1.25): Card headings and section sub-titles.
- **Body** (400, 1rem, 1.625): Project descriptions and general prose. Caps line length implicitly through layout constraints.
- **Label** (600, 0.875rem, 0.1em tracking, uppercase): Section kickers and overline text.

### Named Rules
**The Geometric Discipline Rule.** Display typography scales generously but remains tightly leaded (1.25) and slightly tracked-in (-0.025em) to prevent headlines from feeling disjointed or sprawling.

## 4. Elevation

The system is flat by default, relying on subtle borders rather than heavy drop shadows to distinguish surfaces.

### Shadow Vocabulary
- **Card Shadow** (`0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)`): Ambient definition used sparingly on skill and project cards.
- **Hover Lift** (`0 10px 30px -10px rgba(30, 64, 175, 0.15)`): An indigo-tinted shadow used purely to denote interactivity when a card is hovered.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest, separated by 1px borders. Shadows appear only as a response to state (hover, elevation, focus).

## 5. Components

Components are refined and restrained, avoiding unnecessary visual noise to maintain focus on the content.

### Cards / Containers
- **Corner Style:** Generous rounding (1rem / 16px).
- **Background:** Pure white (`#ffffff`).
- **Shadow Strategy:** Flat at rest with a 1px border; gains an indigo-tinted shadow on hover.
- **Border:** 1px solid `#e5e7eb` (transitions to `#1e40af` on hover).
- **Internal Padding:** Comfortable 1.5rem padding.

### Navigation
- **Style:** Fixed top bar with a glassmorphic blur (`backdrop-filter: blur(12px)`) to maintain context over scrolled content.
- **States:** Text links fade to Technical Indigo on hover. Primary CTA is a solid indigo button that scales slightly (1.05x) on hover.

### Tags / Chips
- **Style:** Translucent indigo background (`#dbeafe`) with solid indigo text (`#1e40af`).
- **Corner Style:** Fully rounded pill shapes.

## 6. Do's and Don'ts

Concrete, forceful guardrails derived from the strategic direction.

### Do:
- **Do** ensure all body text hits WCAG AA contrast ratios (e.g., using `#4b5563` on `#ffffff` or `#f7f8fc`).
- **Do** rely on generous padding and whitespace to organize content rather than drawing boxes around everything.
- **Do** use the Technical Indigo (`#1e40af`) deliberately and sparingly to draw the eye to actions and key metrics.

### Don't:
- **Don't** use overly loud or chaotic designs, "Web3" neon excesses, or generic un-styled SaaS templates.
- **Don't** use border-radius values beyond 1rem (16px) for cards; save fully rounded pills only for tags and buttons.
- **Don't** dilute the identity by adding unnecessary gradients or overlapping drop-shadows on typography.
