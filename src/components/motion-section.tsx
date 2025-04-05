'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode, forwardRef, useEffect, useState } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ children, className = '', delay = 0.2, id }, ref) => {
    const [hasAnimated, setHasAnimated] = useState(false);
    const [internalRef, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    // Uma vez que a seção entra na viewport e é animada, marcamos como true permanentemente
    useEffect(() => {
      if (inView && !hasAnimated) {
        setHasAnimated(true);
      }
    }, [inView, hasAnimated]);

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
        animate={
          inView || hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
        }
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.section>
    );
  },
);

MotionSection.displayName = 'MotionSection';
