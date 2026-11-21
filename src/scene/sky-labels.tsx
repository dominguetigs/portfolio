'use client';

import { useEffect, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { highlightConstellation, type RealSky } from './real-sky';
import scene from './scene.json';
import { constellationName } from './sky-layers';

const WIDTH = scene.night.width;
const HEIGHT = scene.night.height;
// The painting's fit on the screen (ghibli-background and the shader).
const ZOOM = 1.04;
const POSITION = { x: 0.4, y: 0.2 };

/** Under these the pointer is on the page, not on the sky. */
const ON_PAGE =
  'a,button,input,textarea,select,label,[role="button"],[role="tab"],h1,h2,h3,h4,p,li,dt,dd,span,img,svg';

const STAR_REACH = 20;
const LABEL_MS = 4000;

type Label = { x: number; y: number; title: string; detail?: string };

function fit() {
  const scale =
    Math.max(window.innerWidth / WIDTH, window.innerHeight / HEIGHT) * ZOOM;
  return {
    scale,
    x: (window.innerWidth - WIDTH * scale) * POSITION.x,
    y: (window.innerHeight - HEIGHT * scale) * POSITION.y,
  };
}

/**
 * At night, pointing at a bright star (or touching it) names it and picks
 * out its constellation; pointing at the moon gives its phase. Only over the
 * sky itself: never over the page's text or controls.
 */
export function SkyLabels({ sky }: { sky: RealSky }) {
  const locale = useLocale();
  const t = useTranslations('Index.Sky');
  const [label, setLabel] = useState<Label | null>(null);

  useEffect(() => {
    let hideAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const clear = () => {
      setLabel(null);
      highlightConstellation(sky, null);
    };

    const find = (x: number, y: number): Label | null => {
      if (sky.night.value < 0.92) return null;
      const target = document.elementFromPoint(x, y);
      if (target?.closest(ON_PAGE)) return null;

      const f = fit();
      const moon = scene.night.light;
      const mx = f.x + moon.centerX * f.scale;
      const my = f.y + moon.centerY * f.scale;
      if (Math.hypot(x - mx, y - my) < (moon.body + 8) * f.scale) {
        const { name, illumination } = sky.layers.moon;
        highlightConstellation(sky, null);
        return {
          x: mx,
          y: my - (moon.body + 8) * f.scale,
          title: (t.raw('moonPhases') as string[])[name],
          detail: t('illuminated', { percent: Math.round(illumination * 100) }),
        };
      }

      let best: { d: number; star: (typeof sky.layers.named)[number] } | null =
        null;
      for (const star of sky.layers.named) {
        const d = Math.hypot(
          x - (f.x + star.x * f.scale),
          y - (f.y + star.y * f.scale),
        );
        if (d < STAR_REACH && (!best || d < best.d)) best = { d, star };
      }
      if (!best) return null;
      const { star } = best;
      highlightConstellation(sky, star.constellation ?? null);
      return {
        x: f.x + star.x * f.scale,
        y: f.y + star.y * f.scale,
        title: locale === 'es' && star.es ? star.es : star.name,
        detail: constellationName(star.constellation, locale),
      };
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const found = find(event.clientX, event.clientY);
      if (found) {
        setLabel(found);
      } else if (Date.now() > hideAt) {
        clear();
      }
    };

    // A touch names a star for a few seconds.
    const onTap = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      const found = find(event.clientX, event.clientY);
      clearTimeout(timer);
      if (!found) return clear();
      setLabel(found);
      hideAt = Date.now() + LABEL_MS;
      timer = setTimeout(clear, LABEL_MS);
    };

    const onScroll = () => {
      if (Date.now() > hideAt) clear();
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
  }, [sky, locale, t]);

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
            {label.title}
          </div>
          {label.detail && (
            <div className="text-[0.65rem] text-white/60">{label.detail}</div>
          )}
        </div>
      )}
    </div>
  );
}
