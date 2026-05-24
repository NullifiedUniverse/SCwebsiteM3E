# Comprehensive Member Transitions Fix Plan

## Objective
To resolve the lag, broken unmount orchestration, and shape morphing glitches in the member card transitions, building upon a stable codebase (commit 5094c75).

## Root Cause Analysis
1. **Performance Bottleneck:** The SVG paths for the organic shapes are generated with 840 Catmull-Rom spline points, causing severe main-thread lag during the high-frequency spring expansion.
2. **Shared Layout Hierarchy Mismatch:** `MemberBlob` and `ExpandedModal` have mismatched parent-child hierarchies for their shared `layoutId`s, preventing Framer Motion from smoothly morphing elements like the portrait image.
3. **Rectangular Blur Artifacts:** Applying `backdrop-filter: blur` directly to the morphing modal container creates a hard rectangular blurred box that ruins the organic morphing illusion.

## Implementation Steps

### 1. Optimize Performance (Fix Lag)
- **Target:** `src/utils/physics.ts`
- **Action:** In the `getPath` function, reduce the `points` constant from `840` to `120`. Add the `"rect"` type to `getPath` so we can morph perfectly into a rectangle.

### 2. Refactor `MemberBlob.tsx` Hierarchy
- **Flatten Shared Layouts:** Remove `layoutId` from the wrapping `<svg>` element. Let the `motion.path` and `motion.g` elements be direct participants in the shared layout.
- **Ensure Correct IDs:** Verify `card-[id]`, `path-bg-[id]`, `portrait-path-[id]`, and `portrait-container-[id]` are applied correctly to the background fill, portrait clip path, and portrait container respectively.

### 3. Refactor `ExpandedModal.tsx` Hierarchy & Effects
- **Match Hierarchy:** Ensure the layout IDs exactly match the flattened structure of `MemberBlob`. Remove `layoutId` from the background `<svg>` (if any). Use the newly added `rect` path for the modal background.
- **Decouple Backdrop Blur:** Move the `backdropFilter` from the main `card` style into a separate child `motion.div` positioned absolutely, that fades in (`opacity: 0` to `1`). This ensures the blur appears smoothly after the shape morphs.
- **Remove Conflicting Animations:** Remove the `initial={{ scale: 0.82, opacity: 0, y: 18 }}` and `animate` blocks from the modal's portrait container. The portrait's position and scale should be driven entirely by the shared `layoutId` transition from the blob.

### 4. Adjust Z-Index Layering
- **Target:** `src/components/MemberBlob.tsx` and `src/components/sections/CouncilSection.tsx`
- **Action:** Ensure transitioning blobs and the Council section have elevated z-indices (e.g., 150/160) while transitioning so they don't clip beneath other elements.

## Verification
- Clicking a blob should seamlessly stretch the organic SVG path into a superellipse (rounded rectangle) without any structural jumps, flashes, or lag.
- The portrait image should independently fly and morph its clipping path to the new header position.
- Closing the modal should gracefully reverse the entire sequence.