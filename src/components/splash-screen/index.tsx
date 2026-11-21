'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLocale } from 'next-intl';

import { motion, AnimatePresence, type Variants } from 'motion/react';

import { cn } from '@/lib/utils';

import { GhibliBackground } from '../ghibli-background';
import { CodeBox } from './code-box';
import { useTypingCode } from './use-typing-code';
import { ProgressBar } from './progress-bar';
import { canTear, tearPaper } from './paper-tear';
import {
  finishSplash,
  leaveSplash,
  markSplashLive,
  useSplashState,
} from './splash-state';

/** The box fades before the paper tears under it. */
const TEAR_DELAY_MS = 200;

// Torn, nothing is left to fade (AnimatePresence hands the stage to the
// leaving splash through `custom`).
const LEAVE: Variants = {
  exit: (stage: Stage) =>
    stage === 'torn'
      ? { opacity: 0, transition: { duration: 0 } }
      : { opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
};

type Stage = 'loading' | 'tearing' | 'torn';

export function SplashScreen() {
  const state = useSplashState();
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState<Stage>('loading');
  const paperRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLCanvasElement>(null);

  const handleDone = useCallback(() => {
    if (!canTear()) {
      finishSplash();
      setIsVisible(false);
      return;
    }
    setStage('tearing');
  }, []);

  // The page wakes as the paper tears open over it.
  useEffect(() => {
    if (stage !== 'tearing') return;
    const paper = paperRef.current;
    const edge = edgeRef.current;
    if (!paper || !edge) return;
    let stop = () => {};
    const timeout = setTimeout(() => {
      leaveSplash();
      stop = tearPaper(paper, edge, () => {
        finishSplash();
        setStage('torn');
        setIsVisible(false);
      });
    }, TEAR_DELAY_MS);
    return () => {
      clearTimeout(timeout);
      stop();
    };
  }, [stage]);

  if (state === 'skip') {
    return null;
  }

  return (
    <AnimatePresence custom={stage}>
      {isVisible && (
        <motion.div
          data-splash-screen
          initial={{ opacity: 1 }}
          variants={LEAVE}
          custom={stage}
          exit="exit"
          className={cn(
            'fixed inset-0 z-[60]',
            stage !== 'loading' && 'pointer-events-none',
          )}
        >
          <div
            ref={paperRef}
            className="absolute inset-0 flex items-center justify-center bg-background [contain:paint]"
          >
            <div className="texture" />

            <div className="opacity-45">
              <GhibliBackground />
            </div>

            <motion.div
              className="h-full w-full"
              animate={
                stage === 'loading' ? undefined : { opacity: 0, scale: 0.98 }
              }
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <SplashCode onDone={handleDone} />
            </motion.div>
          </div>
          <canvas
            ref={edgeRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
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
