'use client';

import { SectionHeader, MotionSection } from '@/sections/ui';
import { LanguageItem } from './components/language-item';
import { useTranslations } from 'next-intl';

export function LanguagesSection() {
  const t = useTranslations('Index.Languages');

  return (
    <MotionSection id="languages" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />
      <div className="space-y-8 md:space-y-8">
        <div className="mb-6">
          <p className="text-muted-foreground mb-4">{t('description')}</p>
        </div>

        <LanguageItem
          language={t('languages.portuguese.name')}
          level={t('languages.portuguese.level')}
          reading={5}
          writing={5}
          speaking={5}
          listening={5}
          flag="/flags/brazil.svg"
          delay={0.2}
        />

        <LanguageItem
          language={t('languages.english.name')}
          level={t('languages.english.level')}
          reading={4}
          writing={4}
          speaking={4}
          listening={4}
          flag="/flags/usa.svg"
          delay={0.3}
        />

        <LanguageItem
          language={t('languages.spanish.name')}
          level={t('languages.spanish.level')}
          reading={2}
          writing={1}
          speaking={1}
          listening={2}
          flag="/flags/spain.svg"
          delay={0.4}
        />
      </div>
    </MotionSection>
  );
}
