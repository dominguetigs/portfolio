export const sectionAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.03, margin: '-30px 0px 0px 0px' },
  transition: { duration: 0.4, delay: 0.15 },
};

export const mobileTabsAnimation = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    amount: 0.03,
    margin: '-30px 0px 0px 0px',
  },
  transition: { duration: 0.4, delay: 0.2 },
};

export const skillItemContainerAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: (inView: boolean) =>
    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
  transition: (delay: number) => ({
    duration: 0.5,
    delay,
  }),
};

export const skillItemHeaderAnimation = {
  initial: { opacity: 0 },
  animate: (inView: boolean) => (inView ? { opacity: 1 } : { opacity: 0 }),
  transition: (delay: number) => ({
    duration: 0.5,
    delay: delay + 0.1,
  }),
};

export const categoryIconAnimation = {
  whileHover: {
    scale: 1.2,
    rotate: 5,
  },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};

export const skillItemAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: (inView: boolean) =>
    inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 },
  exit: { opacity: 0, scale: 0.9 },
  transition: (delay: number, index: number) => ({
    duration: 0.3,
    delay: delay + index * 0.08,
    type: 'spring',
    stiffness: 200,
  }),
  whileHover: {
    scale: 1.03,
    y: -5,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15,
      mass: 0.8,
    },
  },
  whileTap: { scale: 0.98 },
};

export const skillIconAnimation = {
  whileHover: {
    scale: 1.3,
    rotate: 5,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 5,
    },
  },
  whileTap: { scale: 0.9 },
};

export const skillLevelDotAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: (inView: boolean) =>
    inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 },
  transition: (delay: number, index: number, dotIndex: number) => ({
    delay: delay + index * 0.08 + dotIndex * 0.05,
    duration: 0.3,
  }),
};

export const favoriteStarAnimation = {
  initial: { scale: 0 },
  animate: (inView: boolean) => (inView ? { scale: 1 } : { scale: 0 }),
  transition: (delay: number, index: number) => ({
    delay: delay + index * 0.08 + 0.2,
    type: 'spring',
    stiffness: 300,
  }),
};
