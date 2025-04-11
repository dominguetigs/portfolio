'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { backgroundImageAnimation } from './animations';
import { themeImageConfigs } from './constants';

interface BackgroundImageProps {
  theme: string | undefined;
}

export function BackgroundImage({ theme }: BackgroundImageProps) {
  const currentTheme = theme || 'light';
  const imageConfig =
    themeImageConfigs[currentTheme] || themeImageConfigs.light;

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={theme}
        initial={backgroundImageAnimation.initial}
        animate={backgroundImageAnimation.animate}
        exit={backgroundImageAnimation.exit}
        transition={backgroundImageAnimation.transition}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={imageConfig.src}
          alt={imageConfig.alt}
          fill
          priority
          className={`object-cover ${imageConfig.opacity} transition-transform duration-[3500ms] will-change-transform hover:scale-[1.02]`}
          style={{ objectPosition: '40% 20%' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          quality={100}
        />
      </motion.div>
    </AnimatePresence>
  );
}
