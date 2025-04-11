import { ThemeImageConfig } from './types';

export const themeImageConfigs: Record<string, ThemeImageConfig> = {
  dark: {
    src: '/bg-dark.png',
    alt: 'Night landscape background',
    opacity: 'opacity-60',
  },
  light: {
    src: '/bg-light.png',
    alt: 'Day landscape background',
    opacity: 'opacity-35',
  },
};
