'use client';

import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import {
  profileImageWrapperAnimation,
  primaryLayerAnimation,
  backgroundLayerAnimation,
  imageScaleAnimation,
  gradientOverlayAnimation,
  borderAnimation,
} from './animations';

export function ProfileImage() {
  const t = useTranslations('Index.About');

  return (
    <motion.div className="col-span-1" {...profileImageWrapperAnimation}>
      <div className="relative w-full aspect-square max-w-[300px] md:max-w-none mx-auto md:mx-0 overflow-hidden rounded-lg shadow-lg">
        <motion.div
          className="absolute inset-0 bg-primary z-10"
          {...primaryLayerAnimation}
        />

        <motion.div
          className="absolute inset-0 bg-background z-10"
          {...backgroundLayerAnimation}
        />

        <motion.div className="relative w-full h-full" {...imageScaleAnimation}>
          <Image
            src="/hero-profile-2.png"
            alt={t('alt.profileImage')}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 300px, 100%"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          {...gradientOverlayAnimation}
        />

        <motion.div
          className="absolute inset-0 border-4 border-primary/0 rounded-lg"
          {...borderAnimation}
        />
      </div>
    </motion.div>
  );
}
