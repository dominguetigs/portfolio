import { useTheme } from 'next-themes';

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return { toggleTheme };
}
