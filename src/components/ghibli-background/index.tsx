'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { LivingSkyGate } from '@/scene/living-sky-gate';

const EASE = 'cubic-bezier(0.25, 0.4, 0.3, 1)';
const CROSSFADE_MS = 2500;

const paintings = [
  { opacity: { light: 0.35, dark: 0 } },
  { opacity: { light: 0, dark: 0.6 } },
];

// Scaled around the object position, exactly as the living painting is
// (src/scene), so it can fade in without a jump.
const FIT = {
  transform: 'scale(1.04)',
  transformOrigin: '40% 20%',
} as const;

/**
 * The painted landscape behind the page: day in light mode, night in dark mode.
 * With `live`, the living painting (src/scene) fades in over it once ready;
 * the static paintings stay underneath as the fallback.
 *
 * Both paintings are stacked and the `.dark` class (set by next-themes before
 * the first paint) picks one, so the background is in the server HTML. A theme
 * change flips the class at once (next-themes disables CSS transitions while
 * it switches), so the cross-fade runs on the Web Animations API instead.
 */
export function GhibliBackground({ live = false }: { live?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const container = containerRef.current;
    if (!container) return;

    let wasDark = root.classList.contains('dark');

    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains('dark');
      if (isDark === wasDark) return;
      wasDark = isDark;

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      container
        .querySelectorAll<HTMLElement>('[data-painting]')
        .forEach((element, index) => {
          const { opacity } = paintings[index];
          element.animate(
            [
              { opacity: isDark ? opacity.light : opacity.dark },
              { opacity: isDark ? opacity.dark : opacity.light },
            ],
            { duration: CROSSFADE_MS, easing: EASE },
          );
        });
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden"
    >
      <div className="absolute inset-0 motion-safe:animate-[painting-enter_3s_cubic-bezier(0.25,0.4,0.3,1)]">
        <Image
          data-painting
          src="/bg-light.png"
          alt=""
          fill
          sizes="100vw"
          // The visible painting is the LCP, and which one depends on the
          // theme, so both load eagerly instead of one being preloaded.
          loading="eager"
          className="object-cover opacity-35 dark:opacity-0"
          style={{ objectPosition: '40% 20%', ...FIT }}
        />
        {/* The night: the same landscape, relit, with the moon in today's
            phase (D-014). One painting per phase, baked by scripts/scene/
            split_painting.py; NightPaintingScript picks today's before the
            first paint, and only that one is downloaded. */}
        <div
          data-painting
          className="absolute inset-0 bg-cover opacity-0 dark:opacity-60"
          style={{
            backgroundImage: 'var(--night-painting, url(/night/night-12.webp))',
            backgroundPosition: '40% 20%',
            ...FIT,
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent dark:from-background/90 dark:via-background/40" />

      {/* Above the gradient: the living painting draws its own (painting-shader). */}
      {live && <LivingSkyGate />}
    </div>
  );
}
