'use client';

import { motion } from 'motion/react';

import { CONTACT_INFO } from '@/constants';
import { useEntrance } from '@/components/splash-screen/splash-state';

import { contentDescription } from './animations';

export function ContactInfo() {
  const entrance = useEntrance(contentDescription);

  return (
    <motion.div {...entrance} className="space-y-4 mb-8">
      <p className="text-muted-foreground">{CONTACT_INFO.location}</p>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {CONTACT_INFO.email}
        </a>

        <span className="hidden sm:inline text-muted-foreground">&bull;</span>

        <a
          href={`tel:${CONTACT_INFO.phone}`}
          className="text-muted-foreground hover:text-foreground"
        >
          {CONTACT_INFO.phone}
        </a>
      </div>
    </motion.div>
  );
}
