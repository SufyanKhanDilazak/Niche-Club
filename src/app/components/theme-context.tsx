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

  /**
   * Apply CSS variables & theme-color meta
   */
  const updateThemeVariables = useCallback((isDark: boolean) => {
    const root = document.documentElement;

    requestAnimationFrame(() => {
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);

      const properties: Record<string, string> = isDark
        ? {
            '--theme-primary': '#a90068', // dark = pink
            '--theme-primary-hover': '#8a0055',
            '--theme-bg': '#0f0f23',
            '--theme-surface': '#1a1a2e',
            '--theme-text': '#ffffff',
            '--theme-text-muted': '#94a3b8',
            '--theme-border': '#374151',
            '--theme-accent': '#a90068',
          }
        : {
            '--theme-primary': '#3b82f6', // light = blue
            '--theme-primary-hover': '#2563eb',
            '--theme-bg': '#ffffff',
            '--theme-surface': '#f8fafc',
            '--theme-text': '#000000',
            '--theme-text-muted': '#64748b',
            '--theme-border': '#e5e7eb',
            '--theme-accent': '#3b82f6',
          };

      Object.entries(properties).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // update <meta name="theme-color"> for mobile browser chrome
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isDark ? '#0f0f23' : '#ffffff');
    });
  }, []);

  /**
   * Detect and set initial theme (avoids flash)
   */
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

      // only tell next-themes if not already same
      if (theme !== initialTheme) {
        setTheme(initialTheme);
      }

      setInitialThemeSet(true);
      setIsThemeLoaded(true);
    }
  }, [theme, setTheme, updateThemeVariables, initialThemeSet]);

  /**
   * Sync variables when theme changes
   */
  useEffect(() => {
    if (currentTheme && initialThemeSet) {
      updateThemeVariables(isDarkMode);
    }
  }, [currentTheme, isDarkMode, updateThemeVariables, initialThemeSet]);

  /**
   * Toggle theme
   */
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
