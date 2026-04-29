export const M3_SPRING = { type: "spring", stiffness: 350, damping: 30, mass: 0.8 };
export const QUICK_SPRING = { type: "spring", stiffness: 500, damping: 35 };
export const BOUNCE_SPRING = { type: "spring", stiffness: 400, damping: 15 };
export const SLOW_SPRING = { type: "spring", stiffness: 100, damping: 20 };

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
      const sides = 6;
      r = 0.88 + 0.12 * Math.cos(t * sides + seed);
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
