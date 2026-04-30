import { useState, useEffect } from 'react';

export function useSystemTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored !== null) return stored === "dark";
      return document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = (val?: boolean | ((prev: boolean) => boolean)) => {
    setDarkMode((prev) => {
      const next = typeof val === 'function' ? val(prev) : (val !== undefined ? val : !prev);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return [darkMode, toggleTheme] as const;
}
