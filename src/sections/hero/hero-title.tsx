'use client';

import { motion } from 'framer-motion';

import { CONTACT_INFO } from '@/constants';

import { AnimatedTyping } from './animated-typing';
import { contentTitle } from './animations';
import { ProfileImage } from './profile-image';

export function HeroTitle() {
  return (
    <motion.div {...contentTitle} className="mb-6">
      <ProfileImage />

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
        {CONTACT_INFO.name}
      </h1>

      <AnimatedTyping />
    </motion.div>
  );
}
