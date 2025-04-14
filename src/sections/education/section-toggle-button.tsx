'use client';

import { motion } from 'framer-motion';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { educationItemVariants } from './animations';

interface SectionToggleButtonProps {
  isExpanded: boolean;
  onToggle: VoidFunction;
  showLessText: string;
  showMoreText: string;
}

export function SectionToggleButton({
  isExpanded,
  onToggle,
  showLessText,
  showMoreText,
}: SectionToggleButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onToggle}
      className="group relative overflow-hidden rounded-full px-4 py-2 text-xs md:text-sm font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground border border-muted-foreground/40 hover:border-primary"
    >
      <span className="relative z-10 flex items-center gap-1">
        {isExpanded ? showLessText : showMoreText}
        <motion.div
          initial="initial"
          animate="animate"
          variants={educationItemVariants.chevron(isExpanded)}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </span>
    </Button>
  );
}
