'use client';

import { useTranslations } from 'next-intl';

import { useInView } from 'react-intersection-observer';

import { motion } from 'framer-motion';

import {
  languageItemVariants,
  getLanguageItemTransition,
  inViewOptions,
} from './animations';
import { LEVELS } from './constants';
import { LanguageHeader } from './language-header';
import { SkillItem } from './skill-item';
import { LanguageItemProps } from './types';

export const LanguageItem = ({
  language,
  level,
  reading,
  writing,
  speaking,
  listening,
  flag,
  flagAlt,
  delay = 0,
}: LanguageItemProps) => {
  const t = useTranslations('Index.Languages');
  const [ref, inView] = useInView(inViewOptions);

  const levels = LEVELS(t);

  return (
    <motion.div
      ref={ref}
      className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
      variants={languageItemVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={getLanguageItemTransition(delay)}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-6">
        <LanguageHeader
          language={language}
          level={level}
          flag={flag}
          flagAlt={flagAlt}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-5 w-full md:grid-cols-4 md:gap-4">
          <SkillItem
            skillName="reading"
            skillLevel={reading}
            levelLabel={levels[reading - 1]}
            translationLabel={t('skills.reading')}
          />

          <SkillItem
            skillName="writing"
            skillLevel={writing}
            levelLabel={levels[writing - 1]}
            translationLabel={t('skills.writing')}
          />

          <SkillItem
            skillName="speaking"
            skillLevel={speaking}
            levelLabel={levels[speaking - 1]}
            translationLabel={t('skills.speaking')}
          />

          <SkillItem
            skillName="listening"
            skillLevel={listening}
            levelLabel={levels[listening - 1]}
            translationLabel={t('skills.listening')}
          />
        </div>
      </div>
    </motion.div>
  );
};
