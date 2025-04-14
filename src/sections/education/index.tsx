'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { SectionHeader, MotionSection } from '@/sections/ui';

import { sectionDescriptionVariants } from './animations';
import { AcademicEducation } from './academic-education';
import { CoursesEducation } from './courses-education';

export function EducationSection() {
  const t = useTranslations('Index.Education');

  const academicItems = [
    {
      period: t('sections.academic.items.0.period'),
      type: t('sections.academic.items.0.type'),
      institution: t('sections.academic.items.0.institution'),
      course: t('sections.academic.items.0.course'),
      location: t('sections.academic.items.0.location'),
      description: t('sections.academic.items.0.description'),
    },
    {
      period: t('sections.academic.items.1.period'),
      type: t('sections.academic.items.1.type'),
      institution: t('sections.academic.items.1.institution'),
      course: t('sections.academic.items.1.course'),
      location: t('sections.academic.items.1.location'),
      description: t('sections.academic.items.1.description'),
    },
    {
      period: t('sections.academic.items.2.period'),
      type: t('sections.academic.items.2.type'),
      institution: t('sections.academic.items.2.institution'),
      course: t('sections.academic.items.2.course'),
      location: t('sections.academic.items.2.location'),
      description: t('sections.academic.items.2.description'),
    },
  ];

  const courseItems = [
    {
      period: t('sections.courses.items.0.period'),
      type: t('sections.courses.items.0.type'),
      institution: t('sections.courses.items.0.institution'),
      course: t('sections.courses.items.0.course'),
      description: t('sections.courses.items.0.description'),
    },
    {
      period: t('sections.courses.items.1.period'),
      type: t('sections.courses.items.1.type'),
      institution: t('sections.courses.items.1.institution'),
      course: t('sections.courses.items.1.course'),
      description: t('sections.courses.items.1.description'),
    },
    {
      period: t('sections.courses.items.2.period'),
      type: t('sections.courses.items.2.type'),
      institution: t('sections.courses.items.2.institution'),
      course: t('sections.courses.items.2.course'),
      description: t('sections.courses.items.2.description'),
    },
    {
      period: t('sections.courses.items.3.period'),
      type: t('sections.courses.items.3.type'),
      institution: t('sections.courses.items.3.institution'),
      course: t('sections.courses.items.3.course'),
      description: t('sections.courses.items.3.description'),
    },
    {
      period: t('sections.courses.items.4.period'),
      type: t('sections.courses.items.4.type'),
      institution: t('sections.courses.items.4.institution'),
      course: t('sections.courses.items.4.course'),
      description: t('sections.courses.items.4.description'),
    },
    {
      period: t('sections.courses.items.5.period'),
      type: t('sections.courses.items.5.type'),
      institution: t('sections.courses.items.5.institution'),
      course: t('sections.courses.items.5.course'),
      description: t('sections.courses.items.5.description'),
    },
  ];

  return (
    <MotionSection id="education" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.03, margin: '-30px 0px 0px 0px' }}
        variants={sectionDescriptionVariants}
        className="mb-6"
      >
        <p className="text-muted-foreground">{t('description')}</p>
      </motion.div>

      <div className="space-y-10">
        <AcademicEducation
          title={t('sections.academic.title')}
          showMoreText={t('showMore')}
          showLessText={t('showLess')}
          items={academicItems}
        />

        <CoursesEducation
          title={t('sections.courses.title')}
          showMoreText={t('showMore')}
          showLessText={t('showLess')}
          items={courseItems}
        />
      </div>
    </MotionSection>
  );
}
