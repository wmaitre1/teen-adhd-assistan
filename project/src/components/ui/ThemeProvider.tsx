import React, { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { useSettingsStore } from '../../lib/store/settingsStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useSettingsStore();
  useTheme();

  // Apply initial theme class immediately
  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    
    if ((theme === 'system' && systemTheme === 'dark') || theme === 'dark') {
      root.classList.add('dark');
    }
  }, []);

  return <>{children}</>;
}