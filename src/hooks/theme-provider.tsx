'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

/**
 * next-themes' inline script sets the theme class before the first paint. It
 * must run from the server HTML only: the root layout remounts on the client
 * when the locale changes, and a <script> React creates there never runs and
 * makes React warn. On the client it is marked as a data block, which React
 * accepts; next-themes already suppresses the hydration warning on it.
 */
const scriptProps =
  typeof window === 'undefined' ? undefined : { type: 'application/json' };

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider scriptProps={scriptProps} {...props}>
      {children}
    </NextThemesProvider>
  );
}
