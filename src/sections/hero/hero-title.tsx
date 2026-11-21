'use client';

import { motion } from 'motion/react';

import { CONTACT_INFO } from '@/constants';
import { useEntrance } from '@/components/splash-screen/splash-state';

import { AnimatedTyping } from './animated-typing';
import { contentTitle } from './animations';
import { ProfileImage } from './profile-image';

export function HeroTitle() {
  const entrance = useEntrance(contentTitle);

  return (
    <motion.div {...entrance} className="mb-6">
      <ProfileImage />

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
        {CONTACT_INFO.name}
      </h1>

      <AnimatedTyping />
    </motion.div>
  );
}
