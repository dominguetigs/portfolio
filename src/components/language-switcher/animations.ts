export const springAnimation = {
  hover: {
    scale: 1.1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 10 },
  },
  initial: {
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 8 },
  },
};
