'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { scrollToTop } from '@/utils/scroll-to-top';

import { scrollUpButton, arrowMotion } from './animations';

interface ScrollTopButtonProps {
  isVisible: boolean;
}

export function ScrollTopButton({ isVisible }: ScrollTopButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <div
          className="fixed top-1/2 -translate-y-1/2 z-50 hidden lg:block"
          style={{
            right: `max(2rem, min(calc((100vw - min(64rem, 95vw)) / 2 / 2), 300px))`,
          }}
        >
          <motion.div key="scroll-top-button" {...scrollUpButton}>
            <Button
              size="icon"
              onClick={scrollToTop}
              className="rounded-full animate-bounce shadow-md hover:bg-primary/90 hover:text-primary-foreground"
            >
              <motion.div {...arrowMotion}>
                <ArrowUp className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
