'use client';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { bioSectionAnimation } from './animations';
import { BioItem } from './bio-item';
import { BIO_SECTIONS } from './constants';

export function BioSection() {
  const t = useTranslations('Index.About');
  const translations = BIO_SECTIONS(t);

  return (
    <motion.div
      className="col-span-1 md:col-span-2 prose prose-lg dark:prose-invert"
      {...bioSectionAnimation}
    >
      <div className="space-y-10">
        {translations.map(({ icon, title, content }, index) => (
          <BioItem
            key={title}
            icon={icon}
            title={title}
            content={content}
            delayOffset={0.3 + index * 0.2}
          />
        ))}
      </div>
    </motion.div>
  );
}
