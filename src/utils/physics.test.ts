import { describe, test, expect } from "vitest";
import { getPath } from "./physics";

describe("getPath - SVG shape path generator", () => {
  test("generates valid SVG path syntax", () => {
    const path = getPath("blob", 100, 100, 1);
    
    // Check that path starts with Move command
    expect(path).toMatch(/^M/);
    
    // Check that path contains Curve commands
    expect(path).toContain("C");
    
    // Check that path is closed
    expect(path).toMatch(/Z$/);
  });

  test("returns responsive paths based on bounds", () => {
    const smallPath = getPath("cookie", 50, 50, 0);
    const largePath = getPath("cookie", 200, 200, 0);

    expect(smallPath).not.toBe(largePath);
    
    // Small bounds should generate smaller coordinate numbers
    const cleanCoords = (p: string) => p.replace(/[MCZ]+/gi, " ").trim().split(/[\s,]+/).map(Number);
    const smallCoords = cleanCoords(smallPath);
    const largeCoords = cleanCoords(largePath);
    
    expect(Math.max(...smallCoords)).toBeLessThan(Math.max(...largeCoords));
  });

  test("supports all M3 Expressive shape presets", () => {
    const shapes = [
      "blob",
      "cookie",
      "4-sided cookie",
      "8-leaf clover",
      "flower",
      "soft burst",
      "burst",
      "diamond",
      "squircle",
      "unknown-fallback"
    ];

    shapes.forEach((shape) => {
      const path = getPath(shape, 100, 100, 2);
      expect(path).toBeDefined();
      expect(path.length).toBeGreaterThan(10);
      expect(path).toMatch(/^M/);
      expect(path).toMatch(/Z$/);
    });
  });

  test("generates different coordinate sets for distinct seeds", () => {
    const path1 = getPath("blob", 100, 100, 10.5);
    const path2 = getPath("blob", 100, 100, 20.9);

    expect(path1).not.toBe(path2);
  });
});
