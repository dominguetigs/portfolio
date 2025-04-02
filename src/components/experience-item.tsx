'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ExperienceItemProps {
  period: string;
  title: string;
  company: string;
  location: string;
  description: string;
  responsibilities: string[];
  delay?: number;
}

export function ExperienceItem({
  period,
  title,
  company,
  location,
  description,
  responsibilities,
  delay = 0,
}: ExperienceItemProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <motion.div
          variants={itemVariants}
          className="text-muted-foreground w-40 flex-shrink-0"
        >
          {period}
        </motion.div>
        <div className="flex-1">
          <motion.h3 variants={itemVariants} className="text-lg font-bold mb-1">
            {title}
          </motion.h3>
          <motion.div variants={itemVariants} className="mb-2">
            <span className="font-semibold">{company}</span>
            <span className="mx-2">•</span>
            <span className="text-muted-foreground">{location}</span>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="mb-3 text-muted-foreground"
          >
            {description}
          </motion.p>
          <motion.ul variants={containerVariants} className="space-y-2">
            {responsibilities.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start"
              >
                <span className="mr-2 text-primary">◦</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.div>
  );
}
