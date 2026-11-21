import { useTheme } from 'next-themes';

/** When the living sky starts to darken (painting-shader: 35% of the way). */
const SWEEP_DELAY_MS = 1500;
/** How long the page's colours take to follow (globals.css, :root transition). */
const SWEEP_MS = 1600;

export const SWEEP_EVENT = 'theme:sweep';

let pending: ReturnType<typeof setTimeout> | undefined;
let settle: ReturnType<typeof setTimeout> | undefined;

function sweeps() {
  return (
    document.documentElement.dataset.sky === 'live' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * With the living sky on, a theme change is a sunset (or a sunrise): the sky
 * starts at once, the icon turns at once, and the page's colours follow when
 * the sky starts to darken. Clicking again midway turns it around. Without
 * the sky, the theme changes at once, as before.
 */
export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    const root = document.documentElement;
    const current = root.dataset.themeTo ?? resolvedTheme;
    const next = current === 'dark' ? 'light' : 'dark';

    if (!sweeps()) {
      setTheme(next);
      return;
    }

    root.dataset.themeTo = next;
    window.dispatchEvent(new CustomEvent(SWEEP_EVENT, { detail: next }));

    clearTimeout(pending);
    clearTimeout(settle);
    pending = setTimeout(() => {
      root.dataset.sweep = '';
      setTheme(next);
      settle = setTimeout(() => {
        delete root.dataset.sweep;
        delete root.dataset.themeTo;
      }, SWEEP_MS + 100);
    }, SWEEP_DELAY_MS);
  };

  return { toggleTheme };
}
