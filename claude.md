# KCISLK Student Council Website — M3 Expressive

## Project Overview

A **single-page React + TypeScript** website for the KCISLK (Kang Chiao International School Linkou) Student Council. It showcases council members, upcoming events, and provides an interactive calendar—all rendered with Material 3 Expressive design tokens, spring-physics animations (Framer Motion), and bilingual EN/ZH support.

**Live URL**: Deployed via Vercel  
**Stack**: React 19 · TypeScript 5.8 · Vite 6 · Tailwind CSS 4 · Framer Motion (`motion/react`) · Lucide icons  
**Design System**: Material 3 Expressive (M3E) — custom CSS custom-property token system (not @material/web)

---

## Architecture

```
SCwebsiteM3E/
├── index.html                 # Vite entry point, SEO meta tags
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite + React + Tailwind plugin, env injection
├── tsconfig.json              # TS config (bundler moduleResolution)
├── vercel.json                # Vercel deployment config (SPA rewrites)
├── metadata.json              # AI Studio app metadata (unused locally)
├── public/
│   ├── favicon.png            # SC shield favicon
│   └── photos/Photo 2/       # Member portrait images organized by department
│       ├── Leadership/
│       ├── Activities/
│       ├── Administrative & Financial/
│       ├── Equipment/
│       ├── IT/
│       ├── Public Relations/
│       └── Student Right/
├── src/
│   ├── main.tsx               # React root mount
│   ├── App.tsx                # Root component — layout, nav, modal, state mgmt
│   ├── index.css              # M3E token system, type scale, utility classes
│   ├── data/
│   │   └── cms.ts             # All content: DEPTS config, CMS (hero, events, members)
│   ├── components/
│   │   ├── sections/
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── HeroSection.tsx      # Animated "KCISLK" headline + hero card
│   │   │   ├── EventsSection.tsx    # Event card grid (bento layout)
│   │   │   ├── CalendarSection.tsx   # Expandable calendar with day grid + event list
│   │   │   ├── CouncilSection.tsx    # Filterable horizontal member blob scroller
│   │   │   └── QuickActionsSection.tsx # Proposal CTA + Instagram link
│   │   ├── ExpandedModal.tsx  # Full-screen detail modal (members + events)
│   │   ├── MemberBlob.tsx     # Organic SVG-clipped member avatar card
│   │   ├── AmbientParticles.tsx # Canvas-based ambient floating particles
│   │   ├── HoverReveal.tsx    # Instagram link card with tonal hover
│   │   ├── ActionPill.tsx     # M3E filled tonal button (Submit Proposal)
│   │   └── LangText.tsx       # Animated bilingual text component
│   ├── hooks/
│   │   ├── useAnalytics.ts    # Console-based event tracking
│   │   ├── useEasterEggs.ts   # Konami code + logo click + pirate mode
│   │   ├── useScrollNav.ts    # Scroll-spy + programmatic scroll
│   │   └── useSystemTheme.ts  # Dark mode (localStorage + prefers-color-scheme)
│   ├── utils/
│   │   ├── physics.ts         # Spring constants (M3E_SPATIAL, M3E_FAST, etc.) + SVG path generator
│   │   ├── physics.test.ts    # Unit tests for physics utils
│   │   └── i18n.ts            # Simple t() translation helper
│   └── vitest.setup.ts        # Vitest DOM matcher setup
└── conductor/                 # Historical AI-generated enhancement instructions
    ├── enhance-dark-palette.md
    ├── enhance-sorting-buttons.md
    ├── fix-member-transitions.md
    └── fix-member-transitions-v2.md
```

---

## Key Design Decisions

### M3E Token System (index.css)
All colors, shapes, elevations, and type scales are defined as CSS custom properties in `:root` / `.dark`. Components reference tokens like `var(--md-primary)`, `var(--md-surface-container-high)` — never raw hex. This enables instant theme switching.

### Spring-Physics Animations (physics.ts)
Two spring families:
- **Spatial** (ζ ≈ 0.62): `M3E_SPATIAL`, `M3E_FAST`, `M3E_SLOW` — for movement, scaling, shape morphing (slight overshoot)
- **Effects** (ζ ≥ 1.0): `M3E_EFFECTS`, `M3E_EFFECTS_FAST` — for opacity, color, blur (critically damped, no bounce)

### SVG Path Generator (getPath)
Generates smooth organic blob shapes ("cookie", "squircle", "flower", "diamond", etc.) using Catmull-Rom → cubic bezier conversion. Used for member avatars, event FABs, close buttons, and decorative elements.

### Bilingual System
All user-facing text in `cms.ts` uses `{ EN: string, ZH: string }` objects. The `<LangText>` component handles animated language switching with blur transitions. A hidden "PIRATE" mode unlocks via 7 language toggle clicks.

### Scroll-Driven Animations
CSS `animation-timeline: view()` for horizontal member card entry/exit in the council scroller (with JS fallback for the scroll progress bar).

### Easter Eggs
1. **Logo clicks** (>4): Logo spins
2. **Konami code**: Party mode (rainbow particles, pulsing gradients)
3. **Language clicks** (7): Pirate language
4. **Andrew's modal**: Interactive bug-squashing mini-game
5. **Console message**: Developer greeting

---

## Content Data Model (cms.ts)

### DEPTS
Department config: `name`, `light`/`dark` colors, `textLight`/`textDark`, `shape` (blob type).

### CMS.hero
Single announcement card: `title`, `desc`, `label`, colors, `image`.

### CMS.events[]
Array of event objects: `id`, `type:"event"`, `title`, `desc`, `date` (e.g. "MAY 24"), colors, `image`.

### CMS.members[]
Array of member objects: `id`, `type:"member"`, `name`, `gen` ("7th"/"8th"), `role`, `class`, `dept`, `about`, `expectation`, `responsibility`, `seed` (for shape variation), `image`.

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:3000
npm run build        # Production build (tsc + vite build)
npm run test         # Run vitest
npm run lint         # TypeScript type check
```

---

## Key Conventions

- **No raw colors** in components — always reference `var(--md-*)` tokens
- **Spring transitions** for all motion — use named constants from `physics.ts`
- **Layout animations** via Framer Motion's `layoutId` for shared-element transitions (cards → modal)
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints. Mobile nav = full-width bottom bar; desktop nav = floating pill
- **Accessibility**: ARIA labels, roles, keyboard navigation, focus-visible rings, `prefers-reduced-motion` respect
- **Images**: Member photos in `/public/photos/Photo 2/` organized by department folder; some use `ui-avatars.com` fallback
- **State persistence**: `localStorage` for theme, language, active filter, and generation selection
