import { Variants } from 'framer-motion';

export const educationItemVariants = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  content: {
    whileHover: {
      y: -5,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  },
  text: {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: { duration: 0.3, delay },
    }),
  },
  textWithY: {
    hidden: { opacity: 0, y: 5 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay },
    }),
  },
  badge: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (delay: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, delay, type: 'spring' },
    }),
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400 },
    },
  },
  chevron: (isExpanded: boolean): Variants => ({
    initial: {},
    animate: {
      rotate: isExpanded ? 180 : 0,
      transition: { duration: 0.3 },
    },
  }),
};

export const getAnimationDelay = (
  baseDelay: number,
  index = 0,
  multiplier = 0.05,
) => baseDelay * 0.7 + index * multiplier;

export const sectionDescriptionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, delay: 0.15 },
  },
};
