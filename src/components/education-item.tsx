'use client';

import { motion } from 'framer-motion';

interface EducationItemProps {
  period: string;
  type: string;
  institution: string;
  course: string;
  location?: string;
  delay?: number;
}

export function EducationItem({
  period,
  type,
  institution,
  course,
  location,
  delay = 0,
}: EducationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="mb-4"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="text-muted-foreground w-40 flex-shrink-0">{period}</div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
            <span className="font-bold">{type}</span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <span className="font-serif italic">{institution}</span>
            {location && (
              <>
                <span className="text-muted-foreground hidden sm:inline">
                  •
                </span>
                <span className="text-muted-foreground">{location}</span>
              </>
            )}
          </div>
          <p className="text-muted-foreground">{course}</p>
        </div>
      </div>
    </motion.div>
  );
}
