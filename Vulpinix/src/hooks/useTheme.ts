/**
 * useTheme — Global dark/light mode hook for Vulpinix AI
 *
 * • Reads initial state from localStorage ('vulpinix-theme')
 * • Default: dark mode
 * • Sets data-theme attribute on <html> for CSS variable switching
 * • Persists choice to localStorage across page refreshes
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vulpinix-theme';

function getInitialTheme(): boolean {
  // true = dark (default), false = light
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== 'light'; // anything other than 'light' defaults to dark
}

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  return { isDark, toggleTheme };
}
