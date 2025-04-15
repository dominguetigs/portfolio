import { TranslationFunction } from '@/types';

const PORTUGUESE_SKILLS = {
  reading: 5,
  writing: 5,
  speaking: 5,
  listening: 5,
};

const ENGLISH_SKILLS = {
  reading: 4,
  writing: 4,
  speaking: 4,
  listening: 4,
};

const SPANISH_SKILLS = {
  reading: 2,
  writing: 1,
  speaking: 1,
  listening: 2,
};

export const LANGUAGES = (t: TranslationFunction) => [
  {
    name: t('languages.portuguese.name'),
    level: t('languages.portuguese.level'),
    flag: '/flags/brazil.svg',
    flagAlt: t('languages.portuguese.flagAlt'),
    skills: PORTUGUESE_SKILLS,
  },
  {
    name: t('languages.english.name'),
    level: t('languages.english.level'),
    flag: '/flags/usa.svg',
    flagAlt: t('languages.english.flagAlt'),
    skills: ENGLISH_SKILLS,
  },
  {
    name: t('languages.spanish.name'),
    level: t('languages.spanish.level'),
    flag: '/flags/spain.svg',
    flagAlt: t('languages.spanish.flagAlt'),
    skills: SPANISH_SKILLS,
  },
];

export const LEVELS = (t: TranslationFunction) => [
  t('levels.a1'),
  t('levels.a2'),
  t('levels.b1'),
  t('levels.b2'),
  t('levels.c1c2'),
];
