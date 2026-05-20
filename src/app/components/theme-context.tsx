"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useTheme as useNextTheme } from "next-themes";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isThemeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  isThemeLoaded: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [initialThemeSet, setInitialThemeSet] = useState(false);

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const updateThemeVariables = useCallback((isDark: boolean) => {
    const root = document.documentElement;

    requestAnimationFrame(() => {
      root.classList.toggle("dark", isDark);

      // ✅ SINGLE ACCENT SYSTEM: PINK ONLY
      const PINK = "#a90068";
      const PINK_HOVER = "#8a0055";

      const properties: Record<string, string> = isDark
        ? {
            // 🌙 DARK (pitch black)
            "--theme-bg": "#000000",
            "--theme-surface": "#000000",
            "--theme-text": "#ffffff",
            "--theme-text-muted": "#cbd5e1",
            "--theme-border": "#262626",

            // ✅ Pink accent only
            "--accent-pink": PINK,
            "--accent-pink-hover": PINK_HOVER,
            "--accent-pink-soft": "rgba(169, 0, 104, 0.22)",

            // ✅ Compatibility: map any old blue vars to pink (prevents breakage)
            "--accent-blue": PINK,
            "--accent-blue-hover": PINK_HOVER,
            "--accent-blue-soft": "rgba(169, 0, 104, 0.22)",

            // default primary
            "--theme-primary": PINK,
            "--theme-primary-hover": PINK_HOVER,

            // shadcn vars
            "--background": "0 0% 0%",
            "--foreground": "0 0% 100%",
          }
        : {
            // ☀️ LIGHT (pure white, black text)
            "--theme-bg": "#ffffff",
            "--theme-surface": "#ffffff",
            "--theme-text": "#000000",
            "--theme-text-muted": "#4b5563",
            "--theme-border": "#e5e7eb",

            // ✅ Pink accent only
            "--accent-pink": PINK,
            "--accent-pink-hover": PINK_HOVER,
            "--accent-pink-soft": "rgba(169, 0, 104, 0.12)",

            // ✅ Compatibility: map any old blue vars to pink (prevents breakage)
            "--accent-blue": PINK,
            "--accent-blue-hover": PINK_HOVER,
            "--accent-blue-soft": "rgba(169, 0, 104, 0.12)",

            // default primary
            "--theme-primary": PINK,
            "--theme-primary-hover": PINK_HOVER,

            // shadcn vars
            "--background": "0 0% 100%",
            "--foreground": "0 0% 0%",
          };

      Object.entries(properties).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", isDark ? "#000000" : "#ffffff");
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !initialThemeSet) {
      const storedTheme = localStorage.getItem("theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      let initialTheme: "light" | "dark";
      if (storedTheme === "dark" || storedTheme === "light") {
        initialTheme = storedTheme;
      } else {
        initialTheme = systemDark ? "dark" : "light";
      }

      updateThemeVariables(initialTheme === "dark");

      if (theme !== initialTheme) setTheme(initialTheme);

      setInitialThemeSet(true);
      setIsThemeLoaded(true);
    }
  }, [theme, setTheme, updateThemeVariables, initialThemeSet]);

  useEffect(() => {
    if (currentTheme && initialThemeSet) updateThemeVariables(isDarkMode);
  }, [currentTheme, isDarkMode, updateThemeVariables, initialThemeSet]);

  const toggleTheme = useCallback(() => {
    const next = isDarkMode ? "light" : "dark";
    updateThemeVariables(!isDarkMode);
    setTheme(next);
    localStorage.setItem("theme", next);
  }, [isDarkMode, setTheme, updateThemeVariables]);

  const contextValue = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      isThemeLoaded: isThemeLoaded && initialThemeSet,
    }),
    [isDarkMode, toggleTheme, isThemeLoaded, initialThemeSet]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
