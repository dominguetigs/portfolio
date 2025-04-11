export const iconVariants = {
  rotate: {
    dark: {
      rotate: 45,
      scale: 1.1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    light: {
      rotate: 45,
      scale: 1.1,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    initial: {
      rotate: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  },
};
