'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';

import { CONTACT_INFO } from '@/constants';

import { contentSocial } from './animations';

export function SocialLinks() {
  return (
    <motion.div
      {...contentSocial}
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
