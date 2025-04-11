'use client';

import { useTranslations } from 'next-intl';

import { MotionSection, SectionHeader } from '@/sections/ui';

import { BioSection } from './bio-section';
import { HighlightCards } from './highlight-cards';
import { ProfileImage } from './profile-image';

interface AboutSectionProps {
  aboutRef: React.RefObject<HTMLElement | null>;
}

export function AboutSection({ aboutRef }: AboutSectionProps) {
  const t = useTranslations('Index.About');

  return (
    <MotionSection id="about" ref={aboutRef} className="py-16">
      <SectionHeader title={t('title')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ProfileImage />
        <BioSection />
        <HighlightCards />
      </div>
    </MotionSection>
  );
}
