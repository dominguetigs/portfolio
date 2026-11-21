/** The languages, each on its flag of the bunting (the copy is in Index.Languages). */
export const LANGUAGES = [
  { key: 'portuguese', flag: '/flags/brazil.svg', color: 'var(--flag-green)' },
  { key: 'english', flag: '/flags/usa.svg', color: 'var(--flag-blue)' },
  { key: 'spanish', flag: '/flags/spain.svg', color: 'var(--flag-red)' },
] as const;

/** A flag on the string: a language's, or a plain coloured one. */
type Slot = { u: number; language: number } | { u: number; color: string };

/** Where the flags hang along the string (0 left .. 1 right). */
export const BUNTING: Slot[] = [
  { u: 0.035, color: 'var(--flag-red)' },
  { u: 0.085, color: 'var(--flag-yellow)' },
  { u: 0.2, language: 0 },
  { u: 0.315, color: 'var(--flag-yellow)' },
  { u: 0.365, color: 'var(--flag-red)' },
  { u: 0.5, language: 1 },
  { u: 0.635, color: 'var(--flag-green)' },
  { u: 0.685, color: 'var(--flag-yellow)' },
  { u: 0.8, language: 2 },
  { u: 0.915, color: 'var(--flag-blue)' },
  { u: 0.965, color: 'var(--flag-green)' },
];
