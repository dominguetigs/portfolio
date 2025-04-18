'use client';

import { useEffect, useState } from 'react';

import { useLocale } from 'next-intl';

import { motion, AnimatePresence } from 'framer-motion';

import { GhibliBackground } from '../ghibli-background';
import { CodeBox } from './code-box';
import { useTypingCode } from './use-typing-code';
import { ProgressBar } from './progress-bar';

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(true);

  const { displayedCode, progressWidth, cursorPosition } = useTypingCode(
    locale,
    onComplete,
  );

  useEffect(() => {
    if (progressWidth === 100) {
      const timeout = setTimeout(() => {
        setIsVisible(false);

        if (onComplete) {
          onComplete();
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progressWidth, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: 'easeInOut' },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="texture" />

          <div className="opacity-45">
            <GhibliBackground />
          </div>

          <div className="flex items-center justify-center h-full w-full">
            <div className="relative w-full max-w-[480px] px-4 mx-auto">
              <div className="relative flex items-center justify-center">
                <CodeBox code={displayedCode} cursorPosition={cursorPosition} />
              </div>

              <ProgressBar progressWidth={progressWidth} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
