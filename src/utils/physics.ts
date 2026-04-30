// M3 Standard Spring — responsive UI feedback (buttons, toggles, indicators)
export const M3_SPRING = { type: "spring", stiffness: 380, damping: 28, mass: 0.8 } as const;
// M3 Expressive Spring — playful, organic transitions (morphing, expanding)
export const M3_EXPRESSIVE_SPRING = { type: "spring", stiffness: 200, damping: 22, mass: 1 } as const;
// Quick Spring — instant micro-interactions (hover, tap feedback)
export const QUICK_SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;
// Bounce Spring — decorative entrance animations (cards, blobs)
export const BOUNCE_SPRING = { type: "spring", stiffness: 300, damping: 18 } as const;
// Slow Spring — background ambient motion
export const SLOW_SPRING = { type: "spring", stiffness: 80, damping: 20 } as const;
// M3 Emphasized Decelerate — for elements entering the screen
export const M3_DECELERATE = { duration: 0.4, ease: [0, 0, 0, 1] } as const;
// M3 Emphasized Accelerate — for elements leaving the screen
export const M3_ACCELERATE = { duration: 0.2, ease: [0.3, 0, 1, 1] } as const;

export function getPath(type: string, w: number, h: number, seed: number = 0) {
  const points = 120;
  let path = "";
  const cx = w / 2;
  const cy = h / 2;
  const a = w / 2;
  const b = h / 2;

  for (let i = 0; i < points; i++) {
    const t = (i / points) * Math.PI * 2;
    let r = 1;

    if (type === "blob") {
      r = 0.85 + 0.15 * Math.sin(t * 3 + seed);
    } else if (type === "cookie") {
      r = 0.88 + 0.12 * Math.cos(t * 6 + seed);
    } else if (type === "4-sided cookie") {
      r = 0.85 + 0.15 * Math.cos(t * 4 + seed);
    } else if (type === "8-leaf clover") {
      r = 0.9 + 0.1 * Math.cos(t * 8 + seed);
    } else if (type === "flower") {
      r = 0.88 + 0.12 * Math.cos(t * 10 + seed);
    } else if (type === "soft burst") {
      r = 0.93 + 0.07 * Math.cos(t * 14 + seed);
    } else if (type === "burst") {
      r = 0.88 + 0.12 * Math.cos(t * 14 + seed);
    } else if (type === "diamond") {
      // smooth diamond using superellipse n=1.2
      const n = 1.2;
      r = Math.pow(Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n), -1/n) * 0.75;
    } else if (type === "squircle") {
      const n = 3.8; 
      r = Math.pow(Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n), -1/n) * 0.95;
    } else {
      r = 0.9 + 0.1 * Math.cos(t * 4 + seed);
    }

    const x = cx + r * a * Math.cos(t);
    const y = cy + r * b * Math.sin(t);
    if (i === 0) path += `M ${x} ${y} `;
    else path += `L ${x} ${y} `;
  }
  return path + "Z";
}
