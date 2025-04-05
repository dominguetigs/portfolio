'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
    rootMargin: '-10px 0px -10px 0px',
  });

  // ID para o título, usando o título em lowercase e removendo espaços
  const titleId = `title-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <h2
        id={titleId}
        className="text-2xl font-bold text-primary relative inline-block"
      >
        {title}
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute -bottom-1 left-0 h-1 bg-primary rounded-full"
        />
      </h2>
    </motion.div>
  );
}
