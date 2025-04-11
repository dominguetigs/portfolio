import { useTheme } from 'next-themes';

import { Theme } from '@/types';

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggleTheme = (): void => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return {
    theme: (theme ?? 'light') as Theme,
    isDark,
    toggleTheme,
  };
}
