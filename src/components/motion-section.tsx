'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode, forwardRef, useEffect, useState } from 'react';

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  skipYAnimation?: boolean;
}

export const MotionSection = forwardRef<HTMLElement, MotionSectionProps>(
  (
    { children, className = '', delay = 0.2, id, skipYAnimation = false },
    ref,
  ) => {
    const [hasAnimated, setHasAnimated] = useState(false);
    const [internalRef, inView] = useInView({
      triggerOnce: true,
      threshold: 0.05,
      rootMargin: '-10px 0px -10px 0px',
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

    // Definir os valores iniciais e de animação com base no skipYAnimation
    const initialAnimation = skipYAnimation
      ? { opacity: 0 }
      : { opacity: 0, y: 30 };

    const targetAnimation = skipYAnimation
      ? { opacity: 1 }
      : { opacity: 1, y: 0 };

    const idleAnimation = skipYAnimation
      ? { opacity: 0 }
      : { opacity: 0, y: 30 };

    return (
      <motion.section
        id={id}
        ref={combinedRef}
        initial={initialAnimation}
        animate={inView || hasAnimated ? targetAnimation : idleAnimation}
        transition={{
          duration: 0.4,
          delay,
          type: 'spring',
          stiffness: 60,
          damping: 8,
        }}
        className={className}
      >
        {children}
      </motion.section>
    );
  },
);

MotionSection.displayName = 'MotionSection';
