'use client';

import { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';

import { ThemeIcon } from './theme-icon';
import { useThemeToggle } from './use-theme-toggle';

type ThemeToggleProps = Omit<ComponentProps<typeof Button>, 'onClick'>;

export function ThemeToggle(props: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="group relative overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      {...props}
    >
      <div className="relative">
        <ThemeIcon theme={theme} />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
