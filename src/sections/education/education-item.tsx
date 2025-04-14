'use client';

import React from 'react';

import { motion } from 'framer-motion';

import { useInView } from 'react-intersection-observer';

import { educationItemVariants } from './animations';
import { EducationItemContent } from './education-item-content';
import { EducationItem as EducationItemType } from './types';

interface EducationItemProps extends EducationItemType {
  delay?: number;
}

export function EducationItem({
  period,
  type,
  institution,
  course,
  location,
  description,
  delay = 0,
}: EducationItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-20px 0px 0px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={educationItemVariants.container}
      transition={{ duration: 0.4, delay: delay * 0.7 }}
      className="relative pb-6 mb-2"
    >
      <EducationItemContent
        period={period}
        type={type}
        institution={institution}
        course={course}
        location={location}
        description={description}
        delay={delay}
        inView={inView}
      />
    </motion.div>
  );
}
