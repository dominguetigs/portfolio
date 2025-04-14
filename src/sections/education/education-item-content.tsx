'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { educationItemVariants, getAnimationDelay } from './animations';
import { EducationItem } from './types';

interface EducationItemContentProps extends EducationItem {
  delay: number;
  inView: boolean;
}

export function EducationItemContent({
  period,
  type,
  institution,
  course,
  location,
  description,
  delay,
  inView,
}: EducationItemContentProps) {
  return (
    <motion.div
      className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
      whileHover={educationItemVariants.content.whileHover}
    >
      <div className="flex flex-row flex-wrap items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-2">
        <motion.div
          className="flex items-center gap-1.5 text-primary font-medium"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={educationItemVariants.text}
          custom={getAnimationDelay(delay, 0, 0.1)}
        >
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="text-sm sm:text-base">{period}</span>
        </motion.div>

        {location && (
          <motion.div
            className="flex items-center gap-1.5 text-muted-foreground"
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={educationItemVariants.text}
            custom={getAnimationDelay(delay, 0, 0.1)}
          >
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{location}</span>
          </motion.div>
        )}
      </div>

      <motion.h3
        className="text-base sm:text-lg font-semibold mb-1"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={educationItemVariants.textWithY}
        custom={getAnimationDelay(delay, 1, 0.05)}
      >
        {course}
      </motion.h3>

      <motion.div
        className="flex items-center gap-1.5 mb-1"
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={educationItemVariants.textWithY}
        custom={getAnimationDelay(delay, 2, 0.05)}
      >
        <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-primary/80" />
        <span className="text-sm sm:text-base font-medium">{institution}</span>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={educationItemVariants.badge}
        custom={getAnimationDelay(delay, 3, 0.05)}
        className="inline-block"
      >
        <motion.span
          whileHover={educationItemVariants.badge.hover}
          className="inline-block"
        >
          <Badge variant="secondary">{type}</Badge>
        </motion.span>
      </motion.div>

      {description && (
        <motion.p
          className="text-muted-foreground text-xs sm:text-sm mt-2"
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={educationItemVariants.text}
          custom={getAnimationDelay(delay, 4, 0.05)}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
