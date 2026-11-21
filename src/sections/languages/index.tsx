'use client';

import { useRef, type CSSProperties } from 'react';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { motion, useInView, useReducedMotion } from 'motion/react';

import { SectionHeader, MotionSection } from '@/sections/ui';

import { BUNTING, LANGUAGES } from './constants';

/** The string's sag at its middle, px (it hangs as y = TOP + 4·SAG·u(1−u)). */
const TOP = 6;
const SAG = 24;
const hang = (u: number) => TOP + 4 * SAG * u * (1 - u);

/**
 * Languages as festa junina bunting (D-019): each language on its own flag,
 * small coloured flags between them. They are hung one after another along
 * the string when it comes into view, sway on their own and swing with the
 * painting's wind (--wind).
 */
export function LanguagesSection() {
  const t = useTranslations('Index.Languages');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const still = useReducedMotion();
  const shown = still || inView;

  return (
    <MotionSection id="languages" className="py-16" delay={0.1}>
      <SectionHeader title={t('title')} />

      <div ref={ref} className="relative h-48 sm:h-52">
        <svg
          aria-hidden="true"
          viewBox={`0 0 100 ${TOP + SAG + 8}`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: TOP + SAG + 8 }}
        >
          <path
            d={`M0 ${TOP}Q50 ${TOP + 2 * SAG} 100 ${TOP}`}
            vectorEffect="non-scaling-stroke"
            style={{
              fill: 'none',
              stroke: 'var(--flag-string)',
              strokeWidth: 1.5,
            }}
          />
        </svg>

        <ul>
          {BUNTING.map((slot, index) => {
            const language =
              'language' in slot ? LANGUAGES[slot.language] : null;
            const sway = {
              '--sway-duration': `${2.2 + ((index * 0.41) % 1.2)}s`,
              '--sway-delay': `${-((index * 0.77) % 2.4)}s`,
            } as CSSProperties;
            return (
              <li
                key={slot.u}
                aria-hidden={language ? undefined : true}
                className={
                  language
                    ? 'absolute -translate-x-1/2'
                    : 'absolute hidden -translate-x-1/2 sm:block'
                }
                style={{ left: `${slot.u * 100}%`, top: hang(slot.u) - 2 }}
              >
                <motion.div
                  initial={still ? false : { opacity: 0, rotate: -28, y: -8 }}
                  animate={
                    shown
                      ? { opacity: 1, rotate: 0, y: 0 }
                      : { opacity: 0, rotate: -28, y: -8 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 9,
                    delay: 0.2 + slot.u * 0.9,
                  }}
                  style={{ originX: 0.5, originY: 0 }}
                >
                  <div className="flag-lean">
                    <div className="flag-sway" style={sway}>
                      {language ? (
                        <motion.div
                          whileHover={{ rotate: [0, -6, 5, -3, 0] }}
                          transition={{ duration: 0.8 }}
                          style={{ originX: 0.5, originY: 0 }}
                        >
                          <LanguageFlag
                            name={t(`languages.${language.key}.name`)}
                            level={t(`languages.${language.key}.level`)}
                            flag={language.flag}
                            color={language.color}
                          />
                        </motion.div>
                      ) : (
                        <div
                          className="bunting-flag h-9 w-7"
                          style={{
                            background:
                              'color' in slot ? slot.color : undefined,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </MotionSection>
  );
}

function LanguageFlag({
  name,
  level,
  flag,
  color,
}: {
  name: string;
  level: string;
  flag: string;
  color: string;
}) {
  return (
    <div className="bunting-flag bunting-paper flex w-24 flex-col items-center px-1 pb-9 text-center sm:w-36">
      <div className="h-2.5 w-full" style={{ background: color }} />
      <div className="relative mt-3 h-8 w-8 overflow-hidden rounded-full border border-border">
        <Image src={flag} alt="" fill sizes="32px" className="object-cover" />
      </div>
      <h3 className="mt-2 text-sm font-bold text-card-foreground sm:text-base">
        {name}
      </h3>
      <p className="text-[0.65rem] leading-tight text-muted-foreground sm:text-xs">
        {level}
      </p>
    </div>
  );
}
