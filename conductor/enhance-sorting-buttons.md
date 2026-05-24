# Enhance Sorting Buttons (M3E) Plan

## Objective
Enhance the sorting buttons (Generation toggle and Department filters) in `CouncilSection.tsx` to align with Material 3 Expressive design, featuring smooth corner morphing and graceful interaction states.

## Key Files
- `src/components/sections/CouncilSection.tsx`

## Implementation Steps

### 1. Refactor Generation Toggle
- **M3E Logic:** When a generation is selected, the sliding indicator should morph from a pill-shaped container to a more structured rounded rectangle (expressive corner rounding).
- **Smoothness:** Ensure the `layout` and `layoutId` props on the sliding indicator correctly handle both position and shape interpolation using `M3_SPATIAL` physics.

### 2. Refactor Department Filter Chips
- **M3E Logic:** Individual chips should morph their `borderRadius` when selected:
  - **Inactive:** Pill-shaped (`shape-full`).
  - **Selected:** Rounded rectangle (`shape-large`).
- **Interaction States:** 
  - Add `whileHover` and `whileTap` animations using `M3E_FAST` for snappy feedback.
  - Use `animate` prop to handle the `borderRadius`, `backgroundColor`, and `color` transitions to avoid "jumping" when states change.

### 3. Verification
- Toggle between generations: Verify the indicator slides and morphs its corners smoothly.
- Select different departments: Verify the chips expand/contract their corner rounding without layout jitter.
- Check hover/tap: Ensure responsive, expressive feedback.

## Physics Constraints
- Use `M3_SPATIAL` for the primary layout/shape morphing.
- Use `M3E_EFFECTS` for color/opacity fades.
- Use `M3E_FAST` for hover/tap feedback.