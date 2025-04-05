'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Index.Footer');

  return (
    <footer className="mt-16 pb-8 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1.5">
        {t('madeWith')}{' '}
        <motion.span
          className="text-primary"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </motion.span>{' '}
        {t('by')}{' '}
        <a
          href="https://linkedin.com/in/dominguetigs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline hover:brightness-110 transition-all cursor-pointer"
        >
          Gustavo Domingueti
        </a>
      </p>
    </footer>
  );
}
