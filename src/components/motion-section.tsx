'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode, forwardRef } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ children, className = '', delay = 0.2, id }, ref) => {
    const [internalRef, inView] = useInView({
      triggerOnce: false,
      threshold: 0.1,
    });

    // Combine refs
    const combinedRef = (node: HTMLElement) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      internalRef(node);
    };

    return (
      <motion.section
        id={id}
        ref={combinedRef}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.section>
    );
  },
);

MotionSection.displayName = 'MotionSection';
