'use client';

import { motion } from 'motion/react';
import { Building2, Calendar, MapPin, Check, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

import type { Position } from './constants';
import { companyPeriod, formatPeriod } from './period';

interface ExperienceItemProps {
  position: Position;
  current?: boolean;
  delay?: number;
}

export function ExperienceItem({
  position,
  current = false,
  delay = 0,
}: ExperienceItemProps) {
  const t = useTranslations('Index.Experience');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '-10px 0px -10px 0px',
  });

  const months = t.raw('months') as string[];
  const present = t('present');
  const key = `positions.${position.id}`;
  const roles = position.roles.map(role => ({
    ...role,
    title: t(`${key}.roles.${role.id}.title`),
    responsibilities: t.raw(
      `${key}.roles.${role.id}.responsibilities`,
    ) as string[],
    period: formatPeriod(role.start, role.end, months, present),
  }));
  // Where each role's bullets start, so the cascade runs on across roles.
  const offsets = roles.map((_, i) =>
    roles.slice(0, i).reduce((n, r) => n + r.responsibilities.length, 0),
  );
  const span = companyPeriod(position.roles);
  const several = roles.length > 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.5,
        type: 'spring' as const,
        stiffness: 110,
      }}
      className="relative pl-8 sm:pl-10 pb-6 mb-0"
    >
      {/* Timeline vertical line */}
      <div className="absolute left-0 top-3 bottom-0 w-px bg-primary/40"></div>

      {/* Timeline circle */}
      <div className="absolute left-[-6px] top-3 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>

      <div className="relative bg-card border rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
        {current && (
          <div className="absolute -top-3 right-2 sm:right-5 bg-primary text-background dark:text-white text-xs px-2 py-1 rounded-md shadow-sm z-10">
            {t('current')}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{formatPeriod(span.start, span.end, months, present)}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{position.location}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-1">
          {roles.map(role => role.title).join(' • ')}
        </h3>

        <div className="flex items-center gap-2 text-primary/80 mb-4">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">{t(`${key}.company`)}</span>
        </div>

        {roles.map((role, roleIndex) => (
          <div key={role.id} className="mb-4">
            {several ? (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-primary font-medium">{role.period}</span>
                <span className="text-sm bg-primary/10 px-2 py-0.5 rounded">
                  {role.title}
                </span>
              </div>
            ) : (
              <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70">
                {t('responsibilities')}
              </h4>
            )}
            <ul className="space-y-2">
              {role.responsibilities.map((responsibility, i) => {
                const index = offsets[roleIndex] + i;
                return (
                  <motion.li
                    key={responsibility}
                    initial={{ opacity: 0, x: -10 }}
                    animate={
                      inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                    }
                    transition={{
                      duration: 0.25,
                      delay: delay * 0.7 + 0.07 + index * 0.03,
                      type: 'tween' as const,
                    }}
                    className="flex gap-2"
                  >
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{responsibility}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}

        {position.technologies.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70 flex items-center gap-1">
              <Code className="h-4 w-4" />
              {t('technologies')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {position.technologies.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    inView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{
                    duration: 0.25,
                    delay: delay * 0.7 + 0.07 + index * 0.03,
                    type: 'tween' as const,
                  }}
                >
                  <Badge variant="secondary">{tech}</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
