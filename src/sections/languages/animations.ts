import { Variants } from 'framer-motion';

export const languageItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const getLanguageItemTransition = (delay: number = 0) => ({
  duration: 0.5,
  delay,
  type: 'spring',
  stiffness: 100,
  damping: 12,
});

export const skillBarItemVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1 },
};

export const getSkillBarItemTransition = (index: number) => ({
  duration: 0.4,
  delay: 0.2 + index * 0.1,
  type: 'spring',
  stiffness: 200,
});

export const inViewOptions = {
  triggerOnce: true,
  threshold: 0.2,
  rootMargin: '-50px 0px',
};
