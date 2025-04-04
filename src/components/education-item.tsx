'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin, Building } from 'lucide-react';
import React from 'react';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative ${showTimeline ? 'pl-6 sm:pl-8' : ''} pb-6 mb-2`}
    >
      {/* Timeline vertical line - só mostra se tiver timeline habilitada e não for o último item */}
      {showTimeline && !isLast && (
        <div className="absolute left-0 top-3 bottom-0 w-px bg-primary/40"></div>
      )}

      {/* Timeline circle with icon - só mostra se tiver timeline habilitada */}
      {showTimeline && (
        <div className="absolute left-[-8px] sm:left-[-10px] top-2 h-5 w-5 rounded-full bg-card border-2 border-primary flex items-center justify-center">
          <span className="text-primary">{icon}</span>
        </div>
      )}

      {/* Content container */}
      <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-row flex-wrap items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 text-primary font-medium">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">{period}</span>
          </div>

          {location && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{location}</span>
            </div>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-1">{course}</h3>

        <div className="flex items-center gap-1.5 mb-1">
          <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-primary/80" />
          <span className="text-sm sm:text-base font-medium">
            {institution}
          </span>
        </div>

        <div className="inline-block bg-muted px-2 py-0.5 rounded text-xs font-medium mb-2">
          {type}
        </div>

        {description && (
          <p className="text-muted-foreground text-xs sm:text-sm mt-2">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
