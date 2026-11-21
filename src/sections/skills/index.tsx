'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'motion/react';

import { SectionHeader, MotionSection } from '@/sections/ui';

import { sectionAnimation } from './animations';
import { SkillTabs } from './skill-tabs';

export function SkillsSection() {
  const t = useTranslations('Index.Skills');

  return (
    <MotionSection id="skills" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />

      <motion.div {...sectionAnimation} className="mb-6">
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <SkillTabs />
    </MotionSection>
  );
}
