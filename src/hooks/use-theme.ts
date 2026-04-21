import React, { useState, useEffect } from 'react';
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      console.error('[Theme Engine] Failed to load theme from storage', e);
      return false;
    }
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    try {
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      console.error('[Theme Engine] Failed to sync theme class', e);
    }
  }, [isDark]);
  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  return { isDark, toggleTheme };
}