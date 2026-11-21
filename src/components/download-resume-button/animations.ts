export const springAnimation = {
  hover: {
    y: 3,
    transition: { type: 'spring' as const, stiffness: 400, damping: 10 },
  },
  initial: {
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 5,
      velocity: 10,
    },
  },
};
