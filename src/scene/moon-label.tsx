'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import type { RealSky } from './real-sky';
import scene from './scene.json';

const WIDTH = scene.night.width;
const HEIGHT = scene.night.height;
// The painting's fit on the screen (ghibli-background and the shader).
const ZOOM = 1.04;
const POSITION = { x: 0.4, y: 0.2 };

/** Under these the pointer is on the page, not on the sky. */
const ON_PAGE =
  'a,button,input,textarea,select,label,[role="button"],[role="tab"],h1,h2,h3,h4,p,li,dt,dd,span,img,svg';

const LABEL_MS = 4000;

type Label = { x: number; y: number; phase: string; lit: string };

/**
 * At night, pointing at the moon (or touching it, for a few seconds) gives
 * its phase and how much of it is lit. Only over the sky itself: never over
 * the page's text or controls.
 */
export function MoonLabel({ sky }: { sky: RealSky }) {
  const t = useTranslations('Index.Sky');
  const [label, setLabel] = useState<Label | null>(null);

  useEffect(() => {
    let hideAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const find = (x: number, y: number): Label | null => {
      if (sky.night.value < 0.92) return null;
      if (document.elementFromPoint(x, y)?.closest(ON_PAGE)) return null;

      const scale =
        Math.max(window.innerWidth / WIDTH, window.innerHeight / HEIGHT) * ZOOM;
      const moon = scene.night.light;
      const left = (window.innerWidth - WIDTH * scale) * POSITION.x;
      const top = (window.innerHeight - HEIGHT * scale) * POSITION.y;
      const cx = left + moon.centerX * scale;
      const cy = top + moon.centerY * scale;
      const reach = (moon.body + 8) * scale;
      if (Math.hypot(x - cx, y - cy) >= reach) return null;

      const { name, illumination } = sky.layers.moon;
      return {
        x: cx,
        y: cy - reach,
        phase: (t.raw('moonPhases') as string[])[name],
        lit: t('illuminated', { percent: Math.round(illumination * 100) }),
      };
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const found = find(event.clientX, event.clientY);
      if (found) {
        setLabel(found);
      } else if (Date.now() > hideAt) {
        setLabel(null);
      }
    };

    const onTap = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      const found = find(event.clientX, event.clientY);
      clearTimeout(timer);
      setLabel(found);
      if (!found) return;
      hideAt = Date.now() + LABEL_MS;
      timer = setTimeout(() => setLabel(null), LABEL_MS);
    };

    const onScroll = () => {
      if (Date.now() > hideAt) setLabel(null);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onTap, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onTap);
      window.removeEventListener('scroll', onScroll);
    };
  }, [sky, t]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full pb-3 transition-opacity duration-300',
        label ? 'opacity-100' : 'opacity-0',
      )}
      style={label ? { left: label.x, top: label.y } : undefined}
    >
      {label && (
        <div className="whitespace-nowrap rounded-md border border-white/10 bg-[#020618]/70 px-2.5 py-1 text-center shadow-sm backdrop-blur-sm">
          <div className="text-xs font-semibold text-white/90">
            {label.phase}
          </div>
          <div className="text-[0.65rem] text-white/60">{label.lit}</div>
        </div>
      )}
    </div>
  );
}
