'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import {
  profileImageContainer,
  profileImageCurtainLeft,
  profileImageCurtainMiddle,
  profileImageCurtainRight,
} from './animations';

export function ProfileImage() {
  const t = useTranslations('Index.Hero');

  return (
    <motion.div {...profileImageContainer} className="mb-6 relative">
      <div className="w-48 h-48 mx-auto relative mb-6 overflow-hidden rounded-full border-4 border-primary/20 shadow-lg">
        <motion.div
          className="absolute inset-0 bg-primary z-10"
          {...profileImageCurtainLeft}
        />

        <motion.div
          className="absolute inset-0 bg-background z-10"
          {...profileImageCurtainMiddle}
        />

        <motion.div
          className="absolute inset-0 bg-primary/40 z-10"
          {...profileImageCurtainRight}
        />

        <div className="relative w-full h-full">
          <Image
            src="/hero-profile.png"
            alt={t('alt.profile')}
            fill
            sizes="(max-width: 768px) 100vw, 192px"
            className="object-cover"
            style={{
              filter: 'contrast(1.05) saturate(1.1)',
            }}
            priority
          />
        </div>
      </div>

      <div className="absolute -z-10 w-64 h-64 rounded-full blur-3xl bg-primary/10 opacity-60 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
    </motion.div>
  );
}
