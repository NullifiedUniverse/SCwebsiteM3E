import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSystemTheme } from "./useSystemTheme";

describe("useSystemTheme - React hook tests", () => {
  let localStorageMock: Record<string, string> = {};
  let mediaQueryListeners: ((e: any) => void)[] = [];

  beforeEach(() => {
    localStorageMock = {};
    mediaQueryListeners = [];

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => localStorageMock[key] || null),
        setItem: vi.fn((key, value) => {
          localStorageMock[key] = value;
        }),
        removeItem: vi.fn((key) => {
          delete localStorageMock[key];
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });

    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes("dark") && localStorageMock["theme"] === "dark",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event, callback) => {
          if (event === "change") {
            mediaQueryListeners.push(callback);
          }
        }),
        removeEventListener: vi.fn((event, callback) => {
          if (event === "change") {
            mediaQueryListeners = mediaQueryListeners.filter((cb) => cb !== callback);
          }
        }),
        dispatchEvent: vi.fn(),
      })),
    });

    // Reset document element class list
    document.documentElement.className = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initializes with light mode when no local storage or media preferences are set", () => {
    const { result } = renderHook(() => useSystemTheme());
    const [darkMode] = result.current;

    expect(darkMode).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("initializes with dark mode if local storage theme is 'dark'", () => {
    localStorageMock["theme"] = "dark";

    const { result } = renderHook(() => useSystemTheme());
    const [darkMode] = result.current;

    expect(darkMode).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("initializes with dark mode if prefers-color-scheme is dark", () => {
    // Override matchMedia mock to return true for dark query
    Object.defineProperty(window, "matchMedia", {
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes("dark"),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useSystemTheme());
    const [darkMode] = result.current;

    expect(darkMode).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("toggleTheme toggles the state, updates localStorage, and alters DOM classes", () => {
    const { result } = renderHook(() => useSystemTheme());
    const [, toggleTheme] = result.current;

    // Toggle to dark mode
    act(() => {
      toggleTheme();
    });

    expect(result.current[0]).toBe(true);
    expect(localStorageMock["theme"]).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Toggle back to light mode
    act(() => {
      toggleTheme(false);
    });

    expect(result.current[0]).toBe(false);
    expect(localStorageMock["theme"]).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("reacts to window prefers-color-scheme changes when localStorage is not set", () => {
    const { result } = renderHook(() => useSystemTheme());

    expect(result.current[0]).toBe(false);

    // Trigger system theme change to dark
    act(() => {
      mediaQueryListeners.forEach((listener) =>
        listener({ matches: true } as any)
      );
    });

    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  test("ignores prefers-color-scheme changes if localStorage theme preference exists", () => {
    localStorageMock["theme"] = "light";
    const { result } = renderHook(() => useSystemTheme());

    expect(result.current[0]).toBe(false);

    // Try to trigger system theme change to dark
    act(() => {
      mediaQueryListeners.forEach((listener) =>
        listener({ matches: true } as any)
      );
    });

    // Should remain false (light mode)
    expect(result.current[0]).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
