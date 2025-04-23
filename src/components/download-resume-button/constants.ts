import { TranslationFunction } from '@/types';

export const RESUME_OPTIONS = (t: TranslationFunction) => [
  {
    label: t('resumeEnglish'),
    value: 'en',
    path: '/cv/resume-en.pdf',
    filename: 'Gustavo_Domingueti_Resume_EN.pdf',
  },
  {
    label: t('resumePortuguese'),
    value: 'pt',
    path: '/cv/resume-pt.pdf',
    filename: 'Gustavo_Domingueti_Resume_PT.pdf',
  },
];
