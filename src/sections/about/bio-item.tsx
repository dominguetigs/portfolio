'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { createBioItemAnimation } from './animations';

interface BioItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  delayOffset: number;
}

export function BioItem({ icon, title, content, delayOffset }: BioItemProps) {
  const animations = createBioItemAnimation(delayOffset);

  return (
    <motion.div {...animations.container}>
      <motion.h3
        className="text-xl font-semibold flex items-center gap-2 mb-4"
        {...animations.title}
      >
        <motion.span {...animations.icon}>{icon}</motion.span>
        {title}
      </motion.h3>

      <motion.p className="mb-6 text-muted-foreground" {...animations.content}>
        {content}
      </motion.p>
    </motion.div>
  );
}
