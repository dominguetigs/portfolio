'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { scrollDownButton, arrowMotion } from './animations';

interface ScrollDownButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollDownButton({
  isVisible,
  onClick,
}: ScrollDownButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div key="scroll-down-button" {...scrollDownButton}>
          <Button
            size="icon"
            onClick={onClick}
            className="rounded-full animate-bounce shadow-md"
          >
            <motion.div {...arrowMotion}>
              <ArrowDown className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
