'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Building } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';

interface EducationItemProps {
  period: string;
  type: string;
  institution: string;
  course: string;
  location?: string;
  description?: string;
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
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: delay * 0.7 }}
      className="relative pb-6 mb-2"
    >
      {/* Content container */}
      <motion.div
        className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
        whileHover={{
          y: -5,
          transition: { type: 'spring', stiffness: 400, damping: 10 },
        }}
      >
        <div className="flex flex-row flex-wrap items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-2">
          <motion.div
            className="flex items-center gap-1.5 text-primary font-medium"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: delay * 0.7 + 0.1 }}
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">{period}</span>
          </motion.div>

          {location && (
            <motion.div
              className="flex items-center gap-1.5 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: delay * 0.7 + 0.1 }}
            >
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{location}</span>
            </motion.div>
          )}
        </div>

        <motion.h3
          className="text-base sm:text-lg font-semibold mb-1"
          initial={{ opacity: 0, y: 5 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
          transition={{ duration: 0.3, delay: delay * 0.7 + 0.15 }}
        >
          {course}
        </motion.h3>

        <motion.div
          className="flex items-center gap-1.5 mb-1"
          initial={{ opacity: 0, y: 5 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
          transition={{ duration: 0.3, delay: delay * 0.7 + 0.2 }}
        >
          <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-primary/80" />
          <span className="text-sm sm:text-base font-medium">
            {institution}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{
            duration: 0.3,
            delay: delay * 0.7 + 0.25,
            type: 'spring',
          }}
          className="inline-block"
        >
          <motion.span
            whileHover={{
              scale: 1.05,
              transition: { type: 'spring', stiffness: 400 },
            }}
            className="inline-block"
          >
            <Badge variant="secondary">{type}</Badge>
          </motion.span>
        </motion.div>

        {description && (
          <motion.p
            className="text-muted-foreground text-xs sm:text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: delay * 0.7 + 0.3 }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
