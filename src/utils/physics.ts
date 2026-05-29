/**
 * M3 Expressive — Motion Physics System
 *
 * M3E defines two spring schemes:
 *   • Expressive Spatial:  ζ ≈ 0.62 (slight overshoot, lively)
 *   • Effects (no bounce): ζ ≥ 1.0  (opacity, color, blur — never overshoots)
 *
 * ζ (damping ratio) = damping / (2 * sqrt(stiffness * mass))
 */

// ── Expressive Spatial Springs ──────────────────────────────────────
// For: card expand/collapse, shape morphing, element movement, scaling
// ζ ≈ 0.62 → satisfying overshoot, settles quickly

/** Default expressive spatial spring — hero cards, modal, nav indicator */
export const M3E_SPATIAL = { type: "spring", stiffness: 380, damping: 24, mass: 1 } as const;

/** Fast expressive — icon scale, chip radius, quick tap feedback */
export const M3E_FAST = { type: "spring", stiffness: 600, damping: 32, mass: 0.8 } as const;

/** Slow expressive — ambient background blobs, large hero entrance */
export const M3E_SLOW = { type: "spring", stiffness: 60, damping: 18, mass: 1.2 } as const;

// ── Effects Springs (zero overshoot) ─────────────────────────────────
// For: opacity, color, filter (blur), box-shadow transitions
// Critical damping requires: damping = 2 * sqrt(stiffness * mass)
// At stiffness=300, mass=1 → critical damping = 34.6 → use 36

/** Standard effects spring — opacity/color/blur transitions */
export const M3E_EFFECTS = { type: "spring", stiffness: 300, damping: 36, mass: 1 } as const;

/** Fast effects spring — hover state color overlays, focus rings */
export const M3E_EFFECTS_FAST = { type: "spring", stiffness: 500, damping: 45, mass: 1 } as const;

// ── Standard (Non-Expressive) Springs ────────────────────────────────
// For: functional UI elements that need responsiveness without bounce

/** Standard spatial — segmented buttons, filter chips, utility motion */
export const M3_SPATIAL = { type: "spring", stiffness: 380, damping: 30, mass: 1 } as const;

// ── Legacy aliases (kept for backward compat, map to new names) ──────
/** @deprecated Use M3_SPATIAL */
export const M3_SPRING = M3_SPATIAL;
/** @deprecated Use M3E_SPATIAL */
export const M3_EXPRESSIVE_SPRING = M3E_SPATIAL;
/** @deprecated Use M3E_FAST */
export const QUICK_SPRING = M3E_FAST;
/** @deprecated Use M3E_SPATIAL */
export const BOUNCE_SPRING = M3E_SPATIAL;
/** @deprecated Use M3E_SLOW */
export const SLOW_SPRING = M3E_SLOW;

// Emphasized easing curves — kept for non-spatial transitions
export const M3_DECELERATE = { duration: 0.35, ease: [0.05, 0.7, 0.1, 1.0] } as const;
export const M3_ACCELERATE = { duration: 0.2, ease: [0.3, 0, 0.8, 0.15] } as const;

/**
 * getPath — Generates smooth organic SVG paths using cubic bezier approximations.
 *
 * Uses Catmull-Rom → cubic bezier conversion for true smooth curves,
 * replacing the previous 120-segment polygon approach.
 */
export function getPath(type: string, w: number, h: number, seed: number = 0): string {
  const points = 840;
  const cx = w / 2;
  const cy = h / 2;
  const a = w / 2;
  const b = h / 2;

  const coords: [number, number][] = [];

  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    let r = 1;

    if (type === "blob") {
      r = 0.82 + 0.18 * Math.sin(t * 3 + seed);
    } else if (type === "cookie") {
      r = 0.86 + 0.14 * Math.cos(t * 6 + seed);
    } else if (type === "4-sided cookie") {
      r = 0.83 + 0.17 * Math.cos(t * 4 + seed);
    } else if (type === "gear-cookie") {
      // 5-sided blocky gear-cookie, perfect for IT
      r = 0.85 + 0.13 * Math.sign(Math.cos(t * 5 + seed)) * Math.pow(Math.abs(Math.cos(t * 5 + seed)), 0.35);
    } else if (type === "8-leaf clover") {
      r = 0.88 + 0.12 * Math.cos(t * 8 + seed);
    } else if (type === "flower") {
      r = 0.86 + 0.14 * Math.cos(t * 10 + seed);
    } else if (type === "soft burst") {
      r = 0.91 + 0.09 * Math.cos(t * 14 + seed);
    } else if (type === "burst") {
      r = 0.86 + 0.14 * Math.cos(t * 14 + seed);
    } else if (type === "diamond") {
      const n = 1.3;
      r = Math.pow(
        Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n),
        -1 / n
      ) * 0.78;
    } else if (type === "squircle") {
      const n = 4.0;
      r = Math.pow(
        Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n),
        -1 / n
      ) * 0.95;
    } else {
      r = 0.88 + 0.12 * Math.cos(t * 4 + seed);
    }

    coords.push([cx + r * a * Math.cos(t), cy + r * b * Math.sin(t)]);
  }

  // Build smooth cubic bezier path via Catmull-Rom conversion (tension = 0.4)
  const n = coords.length;
  const tension = 0.4;
  let path = "";

  for (let i = 0; i < n; i++) {
    const p0 = coords[(i - 1 + n) % n];
    const p1 = coords[i];
    const p2 = coords[(i + 1) % n];
    const p3 = coords[(i + 2) % n];

    const cp1x = p1[0] + (p2[0] - p0[0]) * tension / 2;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension / 2;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension / 2;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension / 2;

    if (i === 0) {
      path += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} `;
    }
    path += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }

  return path + "Z";
}
