'use client';

import { motion } from 'framer-motion';

import { gradientOverlayAnimation } from './animations';

interface GradientOverlayProps {
  theme: string | undefined;
}

export function GradientOverlay({ theme }: GradientOverlayProps) {
  return (
    <motion.div
      key={`overlay-${theme}`}
      initial={gradientOverlayAnimation.initial}
      animate={gradientOverlayAnimation.animate}
      transition={gradientOverlayAnimation.transition}
      className={`absolute inset-0 w-full h-full pointer-events-none ${
        theme === 'dark'
          ? 'bg-gradient-to-t from-background/90 via-background/40 to-transparent'
          : 'bg-gradient-to-t from-background/85 via-background/30 to-transparent'
      }`}
    />
  );
}
