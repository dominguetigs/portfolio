'use client';

import { motion } from 'framer-motion';

import { skillLevelDotAnimation } from './animations';

interface SkillLevelDotsProps {
  level: number;
  inView: boolean;
  delay: number;
  index: number;
}

export function SkillLevel({
  level,
  inView,
  delay,
  index,
}: SkillLevelDotsProps) {
  const levels = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex gap-1 mt-1.5">
      {levels.map(i => (
        <motion.div
          key={i}
          {...skillLevelDotAnimation}
          animate={skillLevelDotAnimation.animate(inView)}
          transition={skillLevelDotAnimation.transition(delay, index, i)}
          className={`w-3 h-1.5 rounded-full ${
            i <= level ? 'bg-primary' : 'bg-muted'
          }`}
        />
      ))}
    </div>
  );
}
