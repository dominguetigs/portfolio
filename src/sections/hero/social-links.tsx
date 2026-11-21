'use client';

import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';

import { CONTACT_INFO } from '@/constants';
import { useEntrance } from '@/components/splash-screen/splash-state';

import { contentSocial } from './animations';

export function SocialLinks() {
  const entrance = useEntrance(contentSocial);

  return (
    <motion.div
      {...entrance}
      className="flex flex-wrap justify-center gap-4 mb-16"
    >
      {CONTACT_INFO.social.map(({ name, url, icon }) => (
        <a key={name} href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            {icon} {name}
          </Button>
        </a>
      ))}
    </motion.div>
  );
}
