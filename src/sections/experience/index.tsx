import { motion } from 'framer-motion';
import { SectionHeader, MotionSection } from '@/sections/ui';
import { ExperienceItem } from './components/experience-item';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ExperienceSection() {
  const t = useTranslations('Index.Experience');

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
        <ExperienceItem
          period={t('positions.tagme.period')}
          title={t('positions.tagme.title')}
          company={t('positions.tagme.company')}
          location={t('positions.tagme.location')}
          description={
            <>
              <div className="absolute -top-3 right-5 md:right-5 sm:right-2 xs:right-0 bg-primary text-background dark:text-white text-xs px-2 py-1 rounded-md shadow-sm z-10">
                {t('current')}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary font-medium">
                    {t('positions.tagme.roles.lead.period')}
                  </span>
                  <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                    {t('positions.tagme.roles.lead.title')}
                  </span>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70">
                    {t('responsibilities')}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw('positions.tagme.roles.lead.responsibilities')
                      .map((item: string, idx: number) => (
                        <motion.li
                          key={`lead-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{
                            once: true,
                            amount: 0.01,
                            margin: '-10px 0px',
                          }}
                          transition={{
                            duration: 0.25,
                            delay: 0.05 + idx * 0.03,
                            type: 'tween',
                          }}
                          className="flex gap-2"
                        >
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </motion.li>
                      ))}
                  </ul>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary font-medium">
                    {t('positions.tagme.roles.engineer.period')}
                  </span>
                  <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                    {t('positions.tagme.roles.engineer.title')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70">
                    {t('responsibilities')}
                  </h4>
                  <ul className="space-y-2">
                    {t
                      .raw('positions.tagme.roles.engineer.responsibilities')
                      .map((item: string, idx: number) => (
                        <motion.li
                          key={`eng-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{
                            once: true,
                            amount: 0.01,
                            margin: '-10px 0px',
                          }}
                          transition={{
                            duration: 0.25,
                            delay: 0.05 + idx * 0.03,
                            type: 'tween',
                          }}
                          className="flex gap-2"
                        >
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </motion.li>
                      ))}
                  </ul>
                </div>
              </div>
            </>
          }
          responsibilities={[]}
          technologies={t.raw('positions.tagme.technologies')}
          delay={0.09}
          className="border-l-4 border-primary/60 shadow-md"
        />

        <ExperienceItem
          period={t('positions.skeelo.period')}
          title={t('positions.skeelo.title')}
          company={t('positions.skeelo.company')}
          location={t('positions.skeelo.location')}
          description={t('positions.skeelo.description')}
          responsibilities={t.raw('positions.skeelo.responsibilities')}
          technologies={t.raw('positions.skeelo.technologies')}
          delay={0.2}
        />

        <ExperienceItem
          period={t('positions.zup.period')}
          title={t('positions.zup.title')}
          company={t('positions.zup.company')}
          location={t('positions.zup.location')}
          description={t('positions.zup.description')}
          responsibilities={t.raw('positions.zup.responsibilities')}
          technologies={t.raw('positions.zup.technologies')}
          delay={0.25}
        />

        <ExperienceItem
          period={t('positions.prevent.period')}
          title={t('positions.prevent.title')}
          company={t('positions.prevent.company')}
          location={t('positions.prevent.location')}
          description={t('positions.prevent.description')}
          responsibilities={t.raw('positions.prevent.responsibilities')}
          technologies={t.raw('positions.prevent.technologies')}
          delay={0.3}
        />

        <ExperienceItem
          period={t('positions.comexport.period')}
          title={t('positions.comexport.title')}
          company={t('positions.comexport.company')}
          location={t('positions.comexport.location')}
          description={t('positions.comexport.description')}
          responsibilities={t.raw('positions.comexport.responsibilities')}
          technologies={t.raw('positions.comexport.technologies')}
          delay={0.35}
        />

        <ExperienceItem
          period={t('positions.digesto.period')}
          title={t('positions.digesto.title')}
          company={t('positions.digesto.company')}
          location={t('positions.digesto.location')}
          description={t('positions.digesto.description')}
          responsibilities={t.raw('positions.digesto.responsibilities')}
          technologies={t.raw('positions.digesto.technologies')}
          delay={0.4}
        />

        <ExperienceItem
          period={t('positions.cedro.period')}
          title={t('positions.cedro.title')}
          company={t('positions.cedro.company')}
          location={t('positions.cedro.location')}
          description={t('positions.cedro.description')}
          responsibilities={t.raw('positions.cedro.responsibilities')}
          technologies={t.raw('positions.cedro.technologies')}
          delay={0.7}
        />

        <ExperienceItem
          period={t('positions.sym.period')}
          title={t('positions.sym.title')}
          company={t('positions.sym.company')}
          location={t('positions.sym.location')}
          description={t('positions.sym.description')}
          responsibilities={t.raw('positions.sym.responsibilities')}
          technologies={t.raw('positions.sym.technologies')}
          delay={0.5}
        />

        <ExperienceItem
          period={t('positions.find.period')}
          title={t('positions.find.title')}
          company={t('positions.find.company')}
          location={t('positions.find.location')}
          description={t('positions.find.description')}
          responsibilities={t.raw('positions.find.responsibilities')}
          technologies={t.raw('positions.find.technologies')}
          delay={0.55}
        />
      </div>
    </MotionSection>
  );
}
