'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader, MotionSection } from '@/sections/ui';

import { LANGUAGES } from './constants';
import { LanguageItem } from './language-item';

export function LanguagesSection() {
  const t = useTranslations('Index.Languages');

  return (
    <MotionSection id="languages" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />

      <div className="space-y-8 md:space-y-8">
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">{t('description')}</p>
        </div>

        {LANGUAGES(t).map((language, index) => (
          <LanguageItem
            key={language.name}
            language={language.name}
            level={language.level}
            reading={language.skills.reading}
            writing={language.skills.writing}
            speaking={language.skills.speaking}
            listening={language.skills.listening}
            flag={language.flag}
            flagAlt={language.flagAlt}
            delay={index * 0.2}
          />
        ))}
      </div>
    </MotionSection>
  );
}
