'use client';

import { motion } from 'motion/react';

import { SEEDS } from './constants';
import { PlantArt } from './plant-art';

/** The rest of what Gustavo has worked with, kept in a paper seed packet. */
export function SeedPacket({ title, hint }: { title: string; hint: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
      className="relative mt-2"
    >
      {/* The packet's cut top edge. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 6"
        preserveAspectRatio="none"
        className="block h-2 w-full"
      >
        <path
          d={`M0 6${Array.from({ length: 20 }, (_, i) => `L${i * 6 + 3} 0L${i * 6 + 6} 6`).join('')}Z`}
          style={{ fill: 'var(--garden-kraft)' }}
        />
      </svg>
      <div className="garden-packet flex gap-4 rounded-b-md px-4 pb-4 pt-3 sm:px-5">
        <div
          aria-hidden="true"
          className="garden-packet-label hidden h-20 w-16 shrink-0 rounded-md p-1 sm:block"
        >
          <PlantArt kind="seedling" delay={0} />
        </div>
        <div>
          <p className="font-bold text-card-foreground">
            {title}{' '}
            <span className="text-sm text-muted-foreground">{hint}</span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {SEEDS.join(' · ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
