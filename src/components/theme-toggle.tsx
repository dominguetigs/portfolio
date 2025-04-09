'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

// Animação para os ícones
const iconVariants = {
  rotate: {
    dark: {
      rotate: 45,
      scale: 1.1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    light: {
      rotate: 45,
      scale: 1.1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    initial: {
      rotate: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  },
};

export function ThemeToggle({ ...props }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group relative overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      {...props}
    >
      <div className="relative">
        {isDark ? (
          <motion.div
            initial="initial"
            whileHover="dark"
            animate="initial"
            variants={iconVariants.rotate}
          >
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        ) : (
          <motion.div
            initial="initial"
            whileHover="light"
            animate="initial"
            variants={iconVariants.rotate}
          >
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
