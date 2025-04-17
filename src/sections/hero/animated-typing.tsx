'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { textCursor } from './animations';
import { ANIMATED_TITLES, TYPING_CONFIG } from './constants';

interface AnimatedTitle {
  text: string;
  color?: string;
  icon?: string;
}

export function AnimatedTyping() {
  const t = useTranslations('Index.Hero');
  const titles = useRef<AnimatedTitle[]>(ANIMATED_TITLES(t)).current;
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState({
    currentTitleIndex: 0,
    displayText: '',
    isDeleting: false,
    typingSpeed: TYPING_CONFIG.typingBaseSpeed,
  });

  const updateState = useCallback((newPartialState: Partial<typeof state>) => {
    setState(prevState => ({ ...prevState, ...newPartialState }));
  }, []);

  const typeCharacter = useCallback(
    (text: string, currentLength: number) => {
      updateState({
        displayText: text.substring(0, currentLength + 1),
        typingSpeed:
          TYPING_CONFIG.typingBaseSpeed +
          Math.random() * TYPING_CONFIG.typingVariation,
      });
    },
    [updateState],
  );

  const startDeleting = useCallback(() => {
    updateState({
      isDeleting: true,
      typingSpeed: TYPING_CONFIG.pauseAfterType,
    });
  }, [updateState]);

  const deleteCharacter = useCallback(
    (text: string, currentLength: number) => {
      updateState({
        displayText: text.substring(0, currentLength - 1),
        typingSpeed:
          TYPING_CONFIG.deletingBaseSpeed +
          Math.random() * TYPING_CONFIG.deletingVariation,
      });
    },
    [updateState],
  );

  const moveToNextTitle = useCallback(
    (currentIndex: number, titlesLength: number) => {
      updateState({
        currentTitleIndex: (currentIndex + 1) % titlesLength,
        isDeleting: false,
        displayText: '',
        typingSpeed: TYPING_CONFIG.pauseBeforeNextTitle,
      });
    },
    [updateState],
  );

  const handleTypingAnimation = useCallback(() => {
    const { currentTitleIndex, displayText, isDeleting } = state;
    const currentTitle = titles[currentTitleIndex].text;

    if (!isDeleting && displayText.length < currentTitle.length) {
      typeCharacter(currentTitle, displayText.length);
      return;
    }

    if (!isDeleting) {
      startDeleting();
      return;
    }

    if (isDeleting && displayText.length > 0) {
      deleteCharacter(currentTitle, displayText.length);
      return;
    }

    moveToNextTitle(currentTitleIndex, titles.length);
  }, [
    state,
    titles,
    typeCharacter,
    startDeleting,
    deleteCharacter,
    moveToNextTitle,
  ]);

  useEffect(() => {
    typingTimeoutRef.current = setTimeout(
      handleTypingAnimation,
      state.typingSpeed,
    );

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [handleTypingAnimation, state.typingSpeed]);

  const currentTitle = titles[state.currentTitleIndex];

  return (
    <div className="h-9 md:h-10 flex justify-center items-center">
      <div className="text-xl md:text-2xl relative inline-flex min-h-10 items-center">
        <span className={`${currentTitle.color} font-medium`}>
          {state.displayText}
        </span>

        <motion.div
          {...textCursor}
          className={`ml-1 h-[1.2em] w-[4px] ${currentTitle.color} bg-current inline-block`}
        ></motion.div>
      </div>
    </div>
  );
}
