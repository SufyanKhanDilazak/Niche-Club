'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useTheme as useNextTheme } from 'next-themes';

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

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDarkMode = currentTheme === 'dark';

  const updateThemeVariables = useCallback((isDark: boolean) => {
    const root = document.documentElement;

    requestAnimationFrame(() => {
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);

      const properties: Record<string, string> = isDark
        ? {
            '--theme-primary': '#a90068',
            '--theme-primary-hover': '#8a0055',
            '--theme-bg': '#0f0f23',
            '--theme-surface': '#1a1a2e',
            '--theme-text': '#ffffff',          // ✅ ALWAYS WHITE
            '--theme-text-muted': '#ffffff',    // ✅ ALWAYS WHITE MUTED (optional)
            '--theme-border': '#374151',
            '--theme-accent': '#a90068',
          }
        : {
            '--theme-primary': '#3b82f6',
            '--theme-primary-hover': '#2563eb',
            '--theme-bg': '#ffffff',
            '--theme-surface': '#f8fafc',
            '--theme-text': '#ffffff',          // ✅ ALWAYS WHITE
            '--theme-text-muted': '#ffffff',    // ✅ ALWAYS WHITE MUTED (optional)
            '--theme-border': '#e5e7eb',
            '--theme-accent': '#3b82f6',
          };

      Object.entries(properties).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#0f0f23' : '#ffffff');
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialThemeSet) {
      const storedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      let initialTheme: 'light' | 'dark';
      if (storedTheme === 'dark' || storedTheme === 'light') {
        initialTheme = storedTheme;
      } else {
        initialTheme = systemDark ? 'dark' : 'light';
      }

      updateThemeVariables(initialTheme === 'dark');

      if (theme !== initialTheme) {
        setTheme(initialTheme);
      }

      setInitialThemeSet(true);
      setIsThemeLoaded(true);
    }
  }, [theme, setTheme, updateThemeVariables, initialThemeSet]);

  useEffect(() => {
    if (currentTheme && initialThemeSet) {
      updateThemeVariables(isDarkMode);
    }
  }, [currentTheme, isDarkMode, updateThemeVariables, initialThemeSet]);

  const toggleTheme = useCallback(() => {
    const next = isDarkMode ? 'light' : 'dark';
    updateThemeVariables(!isDarkMode);
    setTheme(next);
    localStorage.setItem('theme', next);
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
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
