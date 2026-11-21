'use client';

import { useRef, type CSSProperties } from 'react';

import { motion, useInView, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

import type { GardenSkill } from './constants';
import { PlantArt } from './plant-art';

/**
 * A raised bed of the garden: its plants grow in when it comes into view,
 * sway on their own and lean with the painting's wind (--wind, set by the
 * living sky as the page is scrolled); a plant wiggles under the pointer.
 * Each wears a wooden marker with its name.
 */
export function GardenBed({
  title,
  hint,
  skills,
  small = false,
}: {
  title: string;
  hint: string;
  skills: GardenSkill[];
  small?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  // Well inside the screen, once the section itself has faded in.
  const inView = useInView(ref, { once: true, margin: '0px 0px -22% 0px' });
  const still = useReducedMotion();

  return (
    <div>
      <h3 className="mb-3 flex items-baseline gap-2 text-lg font-bold text-card-foreground">
        {title}
        <span className="text-sm text-muted-foreground">{hint}</span>
      </h3>
      <ul
        ref={ref}
        className="grid grid-cols-3 gap-y-3 sm:grid-cols-4 md:grid-cols-6"
      >
        {skills.map((skill, index) => (
          <Plant
            key={skill.name}
            skill={skill}
            index={index}
            small={small}
            from={still ? 'grown' : 'hidden'}
            to={still || inView ? 'grown' : 'hidden'}
          />
        ))}
      </ul>
    </div>
  );
}

const WIGGLE = {
  wiggle: {
    rotate: [0, -7, 6, -3, 1.5, 0],
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

type Growth = 'hidden' | 'grown';

function Plant({
  skill,
  index,
  small,
  from,
  to,
}: {
  skill: GardenSkill;
  index: number;
  small: boolean;
  from: Growth;
  to: Growth;
}) {
  const Icon = skill.icon;
  // Each plant keeps its own rhythm, and each marker its own tilt.
  const sway = {
    '--sway-duration': `${2.6 + ((index * 0.37) % 1.1)}s`,
    '--sway-delay': `${-((index * 0.83) % 3)}s`,
  } as CSSProperties;
  const tilt = ((index * 37) % 7) - 3;

  return (
    // The item hands its growth down itself: a whileHover would otherwise
    // cut it off from a parent's.
    <motion.li
      initial={from}
      animate={to}
      whileHover="wiggle"
      className="relative flex flex-col items-stretch"
    >
      <div
        className={cn(
          'plant-lean px-1',
          small ? 'h-14 sm:h-16' : 'h-28 sm:h-32',
        )}
      >
        <div className="plant-sway h-full" style={sway}>
          <motion.div variants={WIGGLE} className="h-full origin-bottom">
            <PlantArt kind={skill.plant} delay={0.3 + index * 0.08} />
          </motion.div>
        </div>
      </div>

      <Soil index={index} />

      <div
        className="absolute inset-x-0.5 bottom-3 flex flex-col items-center"
        style={{ rotate: `${tilt}deg` }}
      >
        <span className="garden-marker flex max-w-full items-center gap-1 rounded-[3px] px-1.5 py-0.5 text-center text-[0.7rem] leading-tight">
          <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
          {skill.name}
        </span>
        <span aria-hidden="true" className="garden-stake h-2 w-1" />
      </div>
    </motion.li>
  );
}

/** The bed's soil under one plant: a mound, a few pebbles, the front plank. */
function Soil({ index }: { index: number }) {
  const bump = 3 + (index % 3);
  return (
    <div aria-hidden="true" className="relative -mt-1">
      <svg
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="block h-6 w-full"
      >
        <path
          d={`M0 9Q25 ${9 - bump} 50 ${4 + (index % 2)}Q75 ${9 - bump} 100 9V24H0Z`}
          style={{ fill: 'var(--garden-soil)' }}
        />
        <path
          d="M0 15Q50 11 100 15V24H0Z"
          style={{ fill: 'var(--garden-soil-dark)', opacity: 0.55 }}
        />
        {[18, 37, 63, 84].map((x, k) => (
          <ellipse
            key={x}
            cx={x + ((index * 7 + k * 5) % 9)}
            cy={13 + ((index + k) % 3) * 2}
            rx={1.6}
            ry={1}
            style={{ fill: 'var(--garden-soil-dark)' }}
          />
        ))}
      </svg>
      <div className="garden-plank h-2.5" />
    </div>
  );
}
