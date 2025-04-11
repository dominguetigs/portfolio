'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { useMount } from '@/hooks/use-mount';

import { BackgroundImage } from './backgorund-image';
import { GradientOverlay } from './gradient-overlay';

export function GhibliBackground() {
  const { theme } = useTheme();
  const { mounted } = useMount();
  const [previousTheme, setPreviousTheme] = useState<string | null>(null);

  useEffect(() => {
    if (mounted && theme) {
      if (previousTheme !== theme) {
        setPreviousTheme(theme);
      }
    }
  }, [theme, mounted, previousTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      <div className="relative w-full h-full">
        <BackgroundImage theme={theme} />
      </div>

      <GradientOverlay theme={theme} />
    </div>
  );
}
