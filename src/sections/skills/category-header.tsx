'use client';

import { motion } from 'framer-motion';

import { skillItemHeaderAnimation, categoryIconAnimation } from './animations';
import { CATEGORY_ICONS } from './constants/category-icons';

interface CategoryHeaderProps {
  label: string;
  category: string;
  inView: boolean;
  delay: number;
}

export function CategoryHeader({
  label,
  category,
  inView,
  delay,
}: CategoryHeaderProps) {
  return (
    <motion.div
      className="flex items-center gap-2 mb-4"
      {...skillItemHeaderAnimation}
      animate={skillItemHeaderAnimation.animate(inView)}
      transition={skillItemHeaderAnimation.transition(delay)}
    >
      {CATEGORY_ICONS[category] && (
        <motion.span className="text-primary" {...categoryIconAnimation}>
          {CATEGORY_ICONS[category]}
        </motion.span>
      )}
      <h3 className="text-lg font-semibold">{label}</h3>
    </motion.div>
  );
}
