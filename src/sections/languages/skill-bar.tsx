'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  skillBarItemVariants,
  getSkillBarItemTransition,
  inViewOptions,
} from './animations';

interface SkillBarProps {
  level: number;
}

export const SkillBar = ({ level }: SkillBarProps) => {
  const [ref, inView] = useInView(inViewOptions);

  return (
    <div ref={ref} className="flex gap-[2px] w-full">
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          variants={skillBarItemVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={getSkillBarItemTransition(i)}
          className={`h-1.5 flex-1 rounded-full ${
            i <= level ? 'bg-primary' : 'bg-muted'
          }`}
          style={{ originX: 0 }}
        />
      ))}
    </div>
  );
};
