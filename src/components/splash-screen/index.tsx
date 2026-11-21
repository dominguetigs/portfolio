'use client';

import { useCallback, useEffect, useState } from 'react';

import { useLocale } from 'next-intl';

import { motion, AnimatePresence } from 'motion/react';

import { GhibliBackground } from '../ghibli-background';
import { CodeBox } from './code-box';
import { useTypingCode } from './use-typing-code';
import { ProgressBar } from './progress-bar';
import { finishSplash, markSplashLive, useSplashState } from './splash-state';

export function SplashScreen() {
  const state = useSplashState();
  const [isVisible, setIsVisible] = useState(true);

  const handleDone = useCallback(() => {
    finishSplash();
    setIsVisible(false);
  }, []);

  if (state === 'skip') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          data-splash-screen
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: 'easeInOut' },
          }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background"
        >
          <div className="texture" />

          <div className="opacity-45">
            <GhibliBackground />
          </div>

          <SplashCode onDone={handleDone} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SplashCode({ onDone }: { onDone: () => void }) {
  const locale = useLocale();
  const { displayedCode, progressWidth, cursorPosition } =
    useTypingCode(locale);

  useEffect(markSplashLive, []);

  useEffect(() => {
    if (progressWidth === 100) {
      const timeout = setTimeout(onDone, 500);
      return () => clearTimeout(timeout);
    }
  }, [progressWidth, onDone]);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="relative w-full max-w-[480px] px-4 mx-auto">
        <div className="relative flex items-center justify-center">
          <CodeBox code={displayedCode} cursorPosition={cursorPosition} />
        </div>

        <ProgressBar progressWidth={progressWidth} />
      </div>
    </div>
  );
}
