import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { getLoadingCode } from './utils';

const CHAR_WIDTH = 0.56;
const COMPLETION_DELAY = 1000;
const PROGRESS_INCREMENT = 2;
const PROGRESS_INTERVAL = 50;
const TYPING_INTERVAL = 70;

export function useTypingCode(locale: string, onComplete?: () => void) {
  const loadingCode = useMemo(() => getLoadingCode(locale), [locale]);

  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });

  const hasCompletedRef = useRef(false);

  const calculateCursorPosition = useCallback((text: string) => {
    const lines = text.split('\n');
    const top = (lines.length - 1) * 1.5;
    const lastLine = lines[lines.length - 1];
    const left = (lastLine.length + 1) * CHAR_WIDTH;
    return { top, left };
  }, []);

  useEffect(() => {
    if (currentIndex < loadingCode.length) {
      const timer = setTimeout(() => {
        const nextIndex = currentIndex + 1;
        const newCode = loadingCode.slice(0, nextIndex);

        setDisplayedCode(newCode);
        setCurrentIndex(nextIndex);
        setProgressWidth((nextIndex / loadingCode.length) * 80);
        setCursorPosition(calculateCursorPosition(newCode));
      }, TYPING_INTERVAL);

      return () => clearTimeout(timer);
    }

    if (currentIndex === loadingCode.length) {
      const lines = loadingCode.split('\n');
      const lastLine = lines[lines.length - 1];
      const left = (lastLine.length + 1) * CHAR_WIDTH;

      setCursorPosition({ top: (lines.length - 1) * 1.5, left });

      const interval = setInterval(() => {
        setProgressWidth(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + PROGRESS_INCREMENT;
        });
      }, PROGRESS_INTERVAL);

      const timeout = setTimeout(() => {
        setProgressWidth(100);

        if (!hasCompletedRef.current && onComplete) {
          hasCompletedRef.current = true;
          onComplete();
        }
      }, COMPLETION_DELAY);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentIndex, loadingCode, calculateCursorPosition, onComplete]);

  return { displayedCode, progressWidth, cursorPosition };
}
