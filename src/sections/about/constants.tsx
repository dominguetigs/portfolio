import {
  Briefcase,
  Code2,
  GanttChart,
  Lightbulb,
  User,
  Users,
} from 'lucide-react';

import { TranslationFunction } from '@/types';

import { BioSection, HighlightCard } from './types';

export const BIO_SECTIONS = (t: TranslationFunction): BioSection[] => [
  {
    icon: <User className="h-5 w-5 text-primary" />,
    title: t('sections.whoAmI.title'),
    content: t('sections.whoAmI.content'),
  },
  {
    icon: <Briefcase className="h-5 w-5 text-primary" />,
    title: t('sections.sectorExperience.title'),
    content: t('sections.sectorExperience.content'),
  },
  {
    icon: <Users className="h-5 w-5 text-primary" />,
    title: t('sections.leadershipDevelopment.title'),
    content: t('sections.leadershipDevelopment.content'),
  },
];

export const HIGHLIGHT_CARDS = (t: TranslationFunction): HighlightCard[] => [
  {
    icon: <Code2 className="h-8 w-8 text-primary mb-3" />,
    title: t('highlights.frontendSpecialist.title'),
    description: t('highlights.frontendSpecialist.description'),
  },
  {
    icon: <GanttChart className="h-8 w-8 text-primary mb-3" />,
    title: t('highlights.softwareArchitecture.title'),
    description: t('highlights.softwareArchitecture.description'),
  },
  {
    icon: <Users className="h-8 w-8 text-primary mb-3" />,
    title: t('highlights.technicalLeadership.title'),
    description: t('highlights.technicalLeadership.description'),
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary mb-3" />,
    title: t('highlights.constantInnovation.title'),
    description: t('highlights.constantInnovation.description'),
  },
];
