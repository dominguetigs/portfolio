/**
 * The colour tokens the theme sweep interpolates (globals.css, the :root
 * transition). A custom property only transitions once it is registered with
 * a type; this runs in the browser before the first theme change.
 */
const TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'border',
  'input',
  'ring',
  'primary-border',
  'primary-ink',
  'primary-ink-soft',
  'primary-ink-icon',
  'primary-ink-strong',
];

export function registerColorTokens() {
  if (typeof window === 'undefined' || !('registerProperty' in CSS)) return;
  for (const token of TOKENS) {
    try {
      CSS.registerProperty({
        name: `--${token}`,
        syntax: '<color>',
        inherits: true,
        initialValue: 'transparent',
      });
    } catch {
      // Already registered (hot reload, a second import): nothing to do.
    }
  }
}
