import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { iconVariants } from './animations';

/**
 * Both icons render and the `.dark` class picks one, so the server HTML (which
 * cannot know the stored theme) matches the client's first render.
 */
export function ThemeIcon() {
  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      animate="initial"
      variants={iconVariants.rotate}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
      <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block" />
    </motion.div>
  );
}
