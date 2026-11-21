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
  // The garden (skills) and the bunting (languages).
  'garden-leaf',
  'garden-leaf-light',
  'garden-leaf-dark',
  'garden-stem',
  'garden-petal',
  'garden-petal-shade',
  'garden-yellow',
  'garden-orange',
  'garden-red',
  'garden-brown',
  'garden-soil',
  'garden-soil-dark',
  'garden-wood',
  'garden-wood-dark',
  'garden-ink',
  'garden-kraft',
  'flag-red',
  'flag-yellow',
  'flag-green',
  'flag-blue',
  'flag-paper',
  'flag-string',
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
