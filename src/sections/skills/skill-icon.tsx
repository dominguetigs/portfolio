'use client';

import { motion } from 'framer-motion';

import { Code } from 'lucide-react';

import { cn } from '@/lib/utils';

import { skillIconAnimation } from './animations';

interface SkillIconProps {
  icon: React.ReactNode | null;
  color: string | null;
}

export function SkillIcon({ icon, color }: SkillIconProps) {
  return (
    <motion.div className="text-primary flex-shrink-0" {...skillIconAnimation}>
      <div className={cn('fill-current', color || 'text-primary')}>
        {icon || <Code className="h-5 w-5" />}
      </div>
    </motion.div>
  );
}
