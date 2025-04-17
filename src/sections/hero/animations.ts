export const profileImageContainer = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.8, type: 'spring' },
};

export const profileImageCurtainLeft = {
  initial: { x: '0%' },
  animate: { x: '100%' },
  transition: {
    duration: 0.8,
    delay: 0.4,
    ease: [0.645, 0.045, 0.355, 1.0],
  },
};

export const profileImageCurtainMiddle = {
  initial: { x: '0%' },
  animate: { x: '100%' },
  transition: {
    duration: 0.8,
    delay: 0.6,
    ease: [0.645, 0.045, 0.355, 1.0],
  },
};

export const profileImageCurtainRight = {
  initial: { x: '0%' },
  animate: { x: '-100%' },
  transition: {
    duration: 0.8,
    delay: 0.8,
    ease: [0.645, 0.045, 0.355, 1.0],
  },
};

export const textCursor = {
  animate: {
    opacity: [1, 0],
    transition: {
      repeat: Infinity,
      duration: 0.6,
      repeatType: 'reverse' as const,
    },
  },
};

export const contentTitle = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const contentDescription = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay: 0.2 },
};

export const contentSocial = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.4 },
};

export const arrowMotion = {
  initial: { rotate: 0 },
  animate: {
    rotate: [0, 8, 0, -8, 0],
    transition: {
      delay: 0.15,
      duration: 0.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
};

export const scrollDownButton = {
  initial: {
    opacity: 0,
    scale: 1.2,
    y: -15,
    filter: 'blur(3px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    filter: 'blur(2px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const scrollUpButton = {
  initial: {
    opacity: 0,
    scale: 1.2,
    y: -15,
    filter: 'blur(3px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    filter: 'blur(2px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
