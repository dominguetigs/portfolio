'use client';

import { motion } from 'framer-motion';
import { SectionHeader, MotionSection } from '@/sections/ui';
import { EducationItem } from './components/education-item';
import { GraduationCap, Award, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function EducationSection() {
  const t = useTranslations('Index.Education');
  const [showAllAcademic, setShowAllAcademic] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const toggleAcademic = () => {
    setShowAllAcademic(!showAllAcademic);
  };

  const toggleCourses = () => {
    setShowAllCourses(!showAllCourses);
  };

  return (
    <MotionSection id="education" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-6"
      >
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <div className="space-y-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <span>{t('sections.academic.title')}</span>
            </h3>

            <Button
              variant="ghost"
              onClick={toggleAcademic}
              className="group relative overflow-hidden rounded-full bg-background px-4 py-2 text-xs md:text-sm font-medium text-primary transition-all hover:bg-primary/10 border border-primary/30 hover:border-primary"
            >
              <span className="relative z-10 flex items-center gap-1">
                {showAllAcademic ? t('showLess') : t('showMore')}
                <motion.div
                  initial={false}
                  animate={{ rotate: showAllAcademic ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
              </span>
            </Button>
          </div>

          <div className="mb-8">
            <EducationItem
              period={t('sections.academic.items.0.period')}
              type={t('sections.academic.items.0.type')}
              institution={t('sections.academic.items.0.institution')}
              course={t('sections.academic.items.0.course')}
              location={t('sections.academic.items.0.location')}
              description={t('sections.academic.items.0.description')}
              delay={0.15}
            />
            {showAllAcademic && (
              <>
                <EducationItem
                  period={t('sections.academic.items.1.period')}
                  type={t('sections.academic.items.1.type')}
                  institution={t('sections.academic.items.1.institution')}
                  course={t('sections.academic.items.1.course')}
                  location={t('sections.academic.items.1.location')}
                  description={t('sections.academic.items.1.description')}
                  delay={0.2}
                />
                <EducationItem
                  period={t('sections.academic.items.2.period')}
                  type={t('sections.academic.items.2.type')}
                  institution={t('sections.academic.items.2.institution')}
                  course={t('sections.academic.items.2.course')}
                  location={t('sections.academic.items.2.location')}
                  description={t('sections.academic.items.2.description')}
                  delay={0.25}
                />
              </>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>{t('sections.courses.title')}</span>
            </h3>

            <Button
              variant="ghost"
              onClick={toggleCourses}
              className="group relative overflow-hidden rounded-full bg-background px-4 py-2 text-xs md:text-sm font-medium text-primary transition-all hover:bg-primary/10 border border-primary/30 hover:border-primary"
            >
              <span className="relative z-10 flex items-center gap-1">
                {showAllCourses ? t('showLess') : t('showMore')}
                <motion.div
                  initial={false}
                  animate={{ rotate: showAllCourses ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-0 mt-0">
            <div>
              <EducationItem
                period={t('sections.courses.items.0.period')}
                type={t('sections.courses.items.0.type')}
                institution={t('sections.courses.items.0.institution')}
                course={t('sections.courses.items.0.course')}
                description={t('sections.courses.items.0.description')}
                delay={0.15}
              />
              {showAllCourses && (
                <>
                  <EducationItem
                    period={t('sections.courses.items.1.period')}
                    type={t('sections.courses.items.1.type')}
                    institution={t('sections.courses.items.1.institution')}
                    course={t('sections.courses.items.1.course')}
                    description={t('sections.courses.items.1.description')}
                    delay={0.2}
                  />
                  <EducationItem
                    period={t('sections.courses.items.2.period')}
                    type={t('sections.courses.items.2.type')}
                    institution={t('sections.courses.items.2.institution')}
                    course={t('sections.courses.items.2.course')}
                    description={t('sections.courses.items.2.description')}
                    delay={0.25}
                  />
                </>
              )}
            </div>

            <div>
              <EducationItem
                period={t('sections.courses.items.3.period')}
                type={t('sections.courses.items.3.type')}
                institution={t('sections.courses.items.3.institution')}
                course={t('sections.courses.items.3.course')}
                description={t('sections.courses.items.3.description')}
                delay={0.15}
              />
              {showAllCourses && (
                <>
                  <EducationItem
                    period={t('sections.courses.items.4.period')}
                    type={t('sections.courses.items.4.type')}
                    institution={t('sections.courses.items.4.institution')}
                    course={t('sections.courses.items.4.course')}
                    description={t('sections.courses.items.4.description')}
                    delay={0.2}
                  />
                  <EducationItem
                    period={t('sections.courses.items.5.period')}
                    type={t('sections.courses.items.5.type')}
                    institution={t('sections.courses.items.5.institution')}
                    course={t('sections.courses.items.5.course')}
                    description={t('sections.courses.items.5.description')}
                    delay={0.25}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
