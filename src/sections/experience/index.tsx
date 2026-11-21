'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SectionHeader, MotionSection } from '@/sections/ui';

import { POSITIONS, VISIBLE_POSITIONS } from './constants';
import { ExperienceItem } from './experience-item';

export function ExperienceSection() {
  const t = useTranslations('Index.Experience');
  const [showAll, setShowAll] = useState(false);

  const positions = showAll ? POSITIONS : POSITIONS.slice(0, VISIBLE_POSITIONS);

  return (
    <MotionSection id="experience" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.01, margin: '-10px 0px' }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8"
      >
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <div className="space-y-2">
        {positions.map((position, index) => (
          <ExperienceItem
            key={position.id}
            position={position}
            current={index === 0 && !position.roles[0].end}
            delay={(index % VISIBLE_POSITIONS) * 0.1}
          />
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <Button
            variant="outline"
            onClick={() => setShowAll(value => !value)}
            aria-expanded={showAll}
            className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground border border-muted-foreground/40 hover:border-primary"
          >
            <span className="relative z-10 flex items-center gap-2">
              {showAll ? t('showLess') : t('showMore')}
              <motion.div
                initial={false}
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </span>
          </Button>
        </motion.div>
      </div>
    </MotionSection>
  );
}
