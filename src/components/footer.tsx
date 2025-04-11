'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { HeartIcon } from './icons';

export function Footer() {
  const t = useTranslations('Index.Footer');

  return (
    <footer className="mt-20 mb-8 lg:mb-0 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1.5">
        {t('madeWith')}

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
          <HeartIcon className="lucide lucide-heart" />
        </motion.span>

        {t('by')}

        <a
          href="https://linkedin.com/in/gustavo-domingueti"
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
