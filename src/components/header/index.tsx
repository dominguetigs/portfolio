'use client';

import { motion } from 'framer-motion';

import { headerVariants } from './animations';
import { HeaderActions } from './header-actions';

export function Header() {
  return (
    <motion.header
      className="w-full py-4"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-end z-50">
        <HeaderActions />
      </div>
    </motion.header>
  );
}
