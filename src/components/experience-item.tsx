'use client';

import { motion } from 'framer-motion';
import { Building2, Calendar, MapPin, Check, Code } from 'lucide-react';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { useInView } from 'react-intersection-observer';

interface ExperienceItemProps {
  period: string;
  title: string;
  company: string;
  location: string;
  description: ReactNode;
  responsibilities: string[];
  technologies?: string[];
  delay?: number;
  className?: string;
}

export function ExperienceItem({
  period,
  title,
  company,
  location,
  description,
  responsibilities,
  technologies = [],
  delay = 0,
  className = '',
}: ExperienceItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.01,
    rootMargin: '-10px 0px -10px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay: delay * 0.5,
        type: 'spring',
        stiffness: 110,
      }}
      className="relative pl-8 sm:pl-10 pb-10 mb-2"
    >
      {/* Timeline vertical line */}
      <div className="absolute left-0 top-3 bottom-0 w-px bg-primary/40"></div>

      {/* Timeline circle */}
      <div className="absolute left-[-6px] top-3 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>

      {/* Content container */}
      <div
        className={`bg-card border rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{period}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-1">{title}</h3>

        <div className="flex items-center gap-2 text-primary/80 mb-4">
          <Building2 className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">{company}</span>
        </div>

        <div className="text-muted-foreground mb-4">{description}</div>

        {responsibilities.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70">
              Responsabilidades
            </h4>
            <ul className="space-y-2">
              {responsibilities.map((responsibility, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{
                    duration: 0.25,
                    delay: delay * 0.7 + 0.07 + index * 0.03,
                    type: 'tween',
                  }}
                  className="flex gap-2"
                >
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{responsibility}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {technologies.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-sm uppercase tracking-wide text-primary/70 flex items-center gap-1">
              <Code className="h-4 w-4" />
              Tecnologias
            </h4>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    inView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.8 }
                  }
                  transition={{
                    duration: 0.25,
                    delay: delay * 0.7 + 0.07 + index * 0.03,
                    type: 'tween',
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
