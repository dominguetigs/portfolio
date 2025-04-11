import { motion } from 'framer-motion';

import { DownloadResumeButton } from '@/components/download-resume-button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

import { containerVariants, itemVariants } from './animations';

const HEADER_ACTIONS = [
  {
    id: 'download-resume',
    component: <DownloadResumeButton />,
  },
  {
    id: 'language-switcher',
    component: <LanguageSwitcher />,
  },
  {
    id: 'theme-toggle',
    component: <ThemeToggle />,
  },
];

export function HeaderActions() {
  return (
    <motion.div
      className="flex items-center gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {HEADER_ACTIONS.map(action => (
        <motion.div key={action.id} variants={itemVariants}>
          {action.component}
        </motion.div>
      ))}
    </motion.div>
  );
}
