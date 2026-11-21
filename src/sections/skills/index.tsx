'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader, MotionSection } from '@/sections/ui';

import { HARVEST, SPROUTING } from './constants';
import { GardenBed } from './garden-bed';
import { SeedPacket } from './seed-packet';

/**
 * Skills as a garden (D-019): what Gustavo harvests every day, what is
 * sprouting, and the seeds he keeps.
 */
export function SkillsSection() {
  const t = useTranslations('Index.Skills');

  return (
    <MotionSection id="skills" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />
      <p className="mb-8 text-muted-foreground">{t('description')}</p>

      <div className="space-y-8">
        <GardenBed
          title={t('harvest.title')}
          hint={t('harvest.hint')}
          skills={HARVEST}
        />
        <GardenBed
          title={t('sprouting.title')}
          hint={t('sprouting.hint')}
          skills={SPROUTING}
          small
        />
        <SeedPacket title={t('seeds.title')} hint={t('seeds.hint')} />
      </div>
    </MotionSection>
  );
}
