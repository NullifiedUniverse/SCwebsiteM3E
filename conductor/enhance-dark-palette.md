# Enhance Dark Mode Palettes Plan

## Objective
Revise the dark mode color definitions for the department palettes in `cms.ts`. The current dark colors are too muted/dark against the M3 dark surface, reducing legibility and "pop". We will update them to more vibrant, "Expressive" container colors that maintain excellent contrast with their respective text colors.

## Target File
- `src/data/cms.ts`

## Proposed Color Palette (Dark Mode)
We will shift the `dark` values to be slightly brighter and more saturated (closer to M3 'Primary Container' or 'Tertiary Container' tones), while ensuring `textDark` remains highly readable (typically a very light, almost white pastel of the same hue).

- **Presidential** (Blue)
  - Current: `dark: "#00458F"`, `textDark: "#D7E3FF"`
  - Proposed: `dark: "#0056B3"`, `textDark: "#E0EAFF"` (More vibrant blue)
- **Activities** (Pink/Magenta)
  - Current: `dark: "#8D0A50"`, `textDark: "#FFD9E2"`
  - Proposed: `dark: "#AD1468"`, `textDark: "#FFD9E4"` (More vibrant magenta)
- **Sec & Treas** (Purple)
  - Current: `dark: "#6023B4"`, `textDark: "#EADDFF"`
  - Proposed: `dark: "#7A35D6"`, `textDark: "#EADDFF"` (Brighter violet)
- **Equipment** (Orange/Brown)
  - Current: `dark: "#7A3200"`, `textDark: "#FFDBCC"`
  - Proposed: `dark: "#A04500"`, `textDark: "#FFDBCB"` (Warmer, brighter amber)
- **IT** (Cyan/Teal)
  - Current: `dark: "#004D63"`, `textDark: "#BCE9FF"`
  - Proposed: `dark: "#006785"`, `textDark: "#BCE9FF"` (Brighter teal)
- **PR** (Green)
  - Current: `dark: "#005322"`, `textDark: "#A5F5B2"`
  - Proposed: `dark: "#007030"`, `textDark: "#A9F5B5"` (More vibrant emerald)
- **Student Rights** (Red)
  - Current: `dark: "#93000A"`, `textDark: "#FFDAD6"`
  - Proposed: `dark: "#B80010"`, `textDark: "#FFDAD6"` (More intense crimson)

## Implementation Steps
1. Update the `DEPTS` record in `src/data/cms.ts` with the new `dark` and `textDark` values.
2. (Optional) Slightly tweak Andrew's dark mode override in `MemberBlob.tsx` and `ExpandedModal.tsx` to match the new vibrancy level.