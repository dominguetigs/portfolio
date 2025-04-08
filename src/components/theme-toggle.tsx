'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

// Animação de mola para os ícones sem deslocamento vertical
const springAnimation = {
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  initial: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 5,
      velocity: 10,
    },
  },
};

export function ThemeToggle({ ...props }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="group relative overflow-hidden"
      {...props}
    >
      <motion.div
        initial="initial"
        whileHover="hover"
        animate="initial"
        variants={springAnimation}
        className="flex items-center justify-center w-full h-full"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-180 dark:scale-0 group-hover:rotate-45" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-180 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:group-hover:rotate-45" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
