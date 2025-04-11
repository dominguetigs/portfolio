import { Variants } from 'framer-motion';

export const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
      duration: 0.5,
      delayChildren: 0.1,
    },
  },
};

export const titleVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const descriptionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.99 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.1,
      ease: 'easeOut',
    },
  },
};

export const leftColVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 16,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
};

export const rightColVariants: Variants = {
  hidden: { opacity: 0, x: 15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 16,
    },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export const dialogContentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
      duration: 0.3,
    },
  },
};

export const dialogItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

export const heartAnimation: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

export const confettiVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: (i: number) => ({
    scale: [0, 1, 0.8],
    opacity: [0, 1, 0],
    x: [0, (i % 2 === 0 ? 1 : -1) * (Math.random() * 80 + 30)],
    y: [0, -(Math.random() * 100 + 50)],
    rotate: [0, Math.random() * 360],
    transition: {
      duration: 1.5 + Math.random() * 0.8,
      ease: 'easeOut',
    },
  }),
};

export const formInputFocusAnimation = {
  whileFocus: { scale: 1.01 },
  transition: { type: 'spring', stiffness: 300, damping: 15 },
};

export const submitButtonAnimation = (isSubmitting: boolean) => ({
  whileHover: { scale: isSubmitting ? 1 : 1.02 },
  whileTap: { scale: isSubmitting ? 1 : 0.98 },
});
