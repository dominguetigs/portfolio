'use client';

import { motion } from 'framer-motion';

interface SkillItemProps {
  label: string;
  items: string[];
  delay?: number;
}

export function SkillItem({ label, items, delay = 0 }: SkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="mb-4"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <span className="text-right w-32 text-muted-foreground font-serif">
          {label}
        </span>
        <div className="flex-1">
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: delay + 0.2 }}
          >
            {items.map((item, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-muted px-3 py-1 rounded-full text-sm"
              >
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
