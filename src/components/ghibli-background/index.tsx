'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const EASE = 'cubic-bezier(0.25, 0.4, 0.3, 1)';
const CROSSFADE_MS = 2500;

const paintings = [
  {
    src: '/bg-light.png',
    opacity: { light: 0.35, dark: 0 },
    className: 'opacity-35 dark:opacity-0',
  },
  {
    src: '/bg-dark.png',
    opacity: { light: 0, dark: 0.6 },
    className: 'opacity-0 dark:opacity-60',
  },
];

/**
 * The painted landscape behind the page: day in light mode, night in dark mode.
 *
 * Both paintings are stacked and the `.dark` class (set by next-themes before
 * the first paint) picks one, so the background is in the server HTML. A theme
 * change flips the class at once (next-themes disables CSS transitions while
 * it switches), so the cross-fade runs on the Web Animations API instead.
 */
export function GhibliBackground() {
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
        {paintings.map(painting => (
          <Image
            key={painting.src}
            data-painting
            src={painting.src}
            alt=""
            fill
            sizes="100vw"
            className={cn('object-cover', painting.className)}
            style={{ objectPosition: '40% 20%' }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/30 to-transparent dark:from-background/90 dark:via-background/40" />
    </div>
  );
}
