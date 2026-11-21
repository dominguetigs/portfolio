'use client';

import { motion } from 'motion/react';

import { useSplashDone } from '@/components/splash-screen/splash-state';

import { headerVariants } from './animations';
import { HeaderActions } from './header-actions';

export function Header() {
  const splashDone = useSplashDone();

  return (
    <motion.header
      className="w-full py-4"
      variants={headerVariants}
      initial="hidden"
      animate={splashDone ? 'visible' : 'hidden'}
    >
      <div className="flex justify-end z-50">
        <HeaderActions />
      </div>
    </motion.header>
  );
}
