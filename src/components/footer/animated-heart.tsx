import { motion } from 'framer-motion';

import { HeartIcon } from '@/components/icons';

import { heartBeatAnimation } from './animations';

export function AnimatedHeart() {
  return (
    <motion.span className="text-primary" animate={heartBeatAnimation}>
      <HeartIcon className="lucide lucide-heart" />
    </motion.span>
  );
}
