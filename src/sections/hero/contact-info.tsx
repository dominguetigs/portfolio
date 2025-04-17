'use client';

import { motion } from 'framer-motion';

import { CONTACT_INFO } from '@/constants';

import { contentDescription } from './animations';

export function ContactInfo() {
  return (
    <motion.div {...contentDescription} className="space-y-4 mb-8">
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
