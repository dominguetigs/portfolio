import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { iconVariants } from './animations';

/**
 * Both icons render; CSS (globals.css) shows the one for where the theme is
 * going: `.dark`, or `data-theme-to` while a sunset is under way. So the
 * server HTML matches the first client render, and a click answers at once.
 */
export function ThemeIcon() {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={iconVariants.rotate}
    >
      <Sun className="theme-icon-sun h-[1.2rem] w-[1.2rem]" />
      <Moon className="theme-icon-moon h-[1.2rem] w-[1.2rem]" />
    </motion.div>
  );
}
