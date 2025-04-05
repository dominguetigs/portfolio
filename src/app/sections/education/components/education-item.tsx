'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin, Building } from 'lucide-react';
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
  isLast?: boolean;
  showTimeline?: boolean;
}

export function EducationItem({
  period,
  type,
  institution,
  course,
  location,
  description,
  delay = 0,
  isLast = false,
  showTimeline = true,
}: EducationItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-20px 0px 0px 0px',
  });

  // Mapeamento de ícones por tipo de educação
  const typeIcons: Record<string, React.ReactNode> = {
    Bacharelado: <GraduationCap className="h-4 w-4" />,
    Técnico: <Award className="h-4 w-4" />,
    Curso: <Award className="h-4 w-4" />,
    Certificação: <Award className="h-4 w-4" />,
  };

  const icon = typeIcons[type] || <Award className="h-4 w-4" />;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: delay * 0.7 }}
      className={`relative ${showTimeline ? 'pl-6 sm:pl-8' : ''} pb-6 mb-2`}
    >
      {/* Timeline vertical line - só mostra se tiver timeline habilitada e não for o último item */}
      {showTimeline && !isLast && (
        <motion.div
          className="absolute left-0 top-3 bottom-0 w-px bg-primary/40"
          initial={{ height: 0 }}
          animate={inView ? { height: '100%' } : { height: 0 }}
          transition={{ duration: 0.6, delay: delay * 0.7 + 0.15 }}
        ></motion.div>
      )}

      {/* Timeline circle with icon - só mostra se tiver timeline habilitada */}
      {showTimeline && (
        <motion.div
          className="absolute left-[-8px] sm:left-[-10px] top-2 h-5 w-5 rounded-full bg-card border-2 border-primary flex items-center justify-center"
          initial={{ scale: 0, rotate: -90 }}
          animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            delay: delay * 0.7 + 0.1,
          }}
          whileHover={{
            scale: 1.2,
            rotate: 5,
            boxShadow: '0 0 8px rgba(var(--primary), 0.5)',
          }}
        >
          <motion.span className="text-primary" whileHover={{ scale: 1.2 }}>
            {icon}
          </motion.span>
        </motion.div>
      )}

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
