export const backgroundImageAnimation = {
  initial: { opacity: 0, scale: 1.02, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 3.5,
      ease: [0.25, 0.4, 0.3, 1],
    },
  },
  exit: { opacity: 0, scale: 0.98, y: -20 },
  transition: {
    opacity: { duration: 2.5, ease: [0.25, 0.4, 0.3, 1] },
    scale: { duration: 3.0, ease: [0.25, 0.4, 0.3, 1] },
    y: { duration: 3.0, ease: [0.25, 0.4, 0.3, 1] },
  },
};

export const gradientOverlayAnimation = {
  initial: { opacity: 0.7 },
  animate: { opacity: 1 },
  transition: { duration: 2.0 },
};
