import { TranslationFunction } from '@/types';

export const TYPING_CONFIG = {
  typingBaseSpeed: 100,
  typingVariation: 80,
  deletingBaseSpeed: 50,
  deletingVariation: 30,
  pauseAfterType: 2000,
  pauseBeforeNextTitle: 500,
};

export const ANIMATED_TITLES = (t: TranslationFunction) => [
  { text: t('titles.main'), color: 'text-primary' },
  { text: t('titles.software'), color: 'text-primary' },
  { text: t('titles.mechatronics'), color: 'text-primary' },
  { text: t('titles.web'), color: 'text-primary' },
  { text: t('titles.tech'), color: 'text-primary' },
  { text: t('titles.algorithms'), color: 'text-primary' },
  { text: t('titles.data'), color: 'text-primary' },
  { text: t('titles.problems'), color: 'text-primary' },
  { text: t('titles.math'), color: 'text-primary' },
  { text: t('titles.physics'), color: 'text-primary' },
  { text: t('titles.science'), color: 'text-primary' },
  { text: t('titles.astronomy'), color: 'text-primary' },
  { text: t('titles.chess'), color: 'text-primary' },
];
