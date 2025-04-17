'use client';

import { useTranslations } from 'next-intl';

import { useState, useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import { motion } from 'framer-motion';

import { SectionHeader, MotionSection } from '@/sections/ui';

import { sectionAnimation } from './animations';
import { SkillTabs } from './skill-tabs';

export function SkillsSection() {
  const t = useTranslations('Index.Skills');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [refSkills, inViewSkills] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-20px 0px 0px 0px',
  });

  useEffect(() => {
    if (inViewSkills && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inViewSkills, hasAnimated]);

  return (
    <MotionSection id="skills" className="py-16" delay={0.1} ref={refSkills}>
      <SectionHeader title={t('title')} />

      <motion.div {...sectionAnimation} className="mb-6">
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <SkillTabs />
    </MotionSection>
  );
}
