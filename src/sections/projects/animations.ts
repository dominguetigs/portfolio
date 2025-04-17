import { Variants } from 'framer-motion';

export const descriptionAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.03, margin: '-30px 0px 0px 0px' },
  transition: { duration: 0.4, delay: 0.15 },
};

export const tabsAnimation = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    amount: 0.03,
    margin: '-30px 0px 0px 0px',
  },
  transition: { duration: 0.4, delay: 0.2 },
};

export const projectCardAnimation: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export const getProjectCardTransition = (index: number) => ({
  duration: 0.3,
  delay: 0.05 + index * 0.05,
  ease: 'easeOut' as const,
});

export const projectCardViewport = {
  once: true,
  amount: 0.1,
  margin: '-20px 0px 0px 0px',
};

export const viewMoreButtonAnimation = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.8 },
  transition: { duration: 0.3, delay: 0.3 },
};

export const projectsSectionDelay = 0.1;

export const projectsDescriptionAnimation = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.03, margin: '-30px 0px 0px 0px' },
  transition: { duration: 0.4, delay: 0.15 },
};

export const githubViewMoreAnimation = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.8 },
  transition: { duration: 0.3, delay: 0.3 },
};
