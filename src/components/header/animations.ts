export const springAnimation = {
  hover: {
    y: 3,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  initial: {
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 5,
      velocity: 10,
    },
  },
};

export const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};
