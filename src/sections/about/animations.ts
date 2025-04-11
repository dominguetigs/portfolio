export const profileImageWrapperAnimation = {
  initial: { opacity: 1 },
  viewport: {
    once: true,
    amount: 0.03,
    margin: '-30px 0px 0px 0px',
  },
};

export const primaryLayerAnimation = {
  initial: { y: 0 },
  whileInView: { y: '100%' },
  transition: {
    duration: 0.7,
    delay: 0.4,
    ease: [0.645, 0.045, 0.355, 1.0],
  },
  viewport: { once: true },
};

export const backgroundLayerAnimation = {
  initial: { y: 0 },
  whileInView: { y: '100%' },
  transition: {
    duration: 0.7,
    delay: 0.6,
    ease: [0.645, 0.045, 0.355, 1.0],
  },
  viewport: { once: true },
};

export const imageScaleAnimation = {
  initial: { scale: 1.2, filter: 'blur(10px)' },
  whileInView: { scale: 1, filter: 'blur(0px)' },
  transition: {
    duration: 1.2,
    delay: 0.5,
    ease: [0.25, 0.1, 0.25, 1.0],
  },
  viewport: { once: true },
};

export const gradientOverlayAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: {
    duration: 0.8,
    delay: 1.1,
  },
  viewport: { once: true },
};

export const borderAnimation = {
  initial: { borderColor: 'rgba(var(--primary-rgb), 0)' },
  whileInView: { borderColor: 'rgba(var(--primary-rgb), 0.3)' },
  transition: {
    duration: 0.6,
    delay: 1.3,
  },
  viewport: { once: true },
};

export const bioSectionAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  viewport: {
    once: true,
    amount: 0.03,
    margin: '-30px 0px 0px 0px',
  },
};

export const createBioItemAnimation = (delayOffset: number) => ({
  container: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, delay: delayOffset },
  },
  title: {
    initial: { opacity: 0, x: -10 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.4, delay: delayOffset + 0.1 },
  },
  icon: {
    initial: { scale: 0.5, opacity: 0 },
    whileInView: { scale: 1, opacity: 1 },
    viewport: { once: true },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: delayOffset + 0.2,
    },
  },
  content: {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: delayOffset + 0.3 },
  },
});

export const highlightCardsContainerAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    amount: 0.03,
    margin: '-30px 0px 0px 0px',
  },
  transition: { duration: 0.4, delay: 0.25 },
};

export const createCardAnimation = (index: number) => ({
  initial: { opacity: 0, rotateY: 90 },
  whileInView: { opacity: 1, rotateY: 0 },
  viewport: {
    once: true,
    amount: 0.3,
  },
  transition: {
    duration: 0.6,
    delay: 0.3 + index * 0.15,
    type: 'spring',
    stiffness: 80,
  },
});
