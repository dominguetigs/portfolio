import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { iconVariants } from './animations';

type ThemeType = 'dark' | 'light';

interface ThemeIconProps {
  theme: ThemeType;
}

export function ThemeIcon({ theme }: ThemeIconProps) {
  const isDark = theme === 'dark';

  if (isDark) {
    return (
      <motion.div
        initial="initial"
        whileHover="dark"
        animate="initial"
        variants={iconVariants.rotate}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      whileHover="light"
      animate="initial"
      variants={iconVariants.rotate}
    >
      <Sun className="h-[1.2rem] w-[1.2rem]" />
    </motion.div>
  );
}
