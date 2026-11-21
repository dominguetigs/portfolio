import sky from './sky.json';
import {
  moonPhase,
  project,
  skyFrame,
  VIEW,
  type MoonPhase,
  type SkyFrame,
} from './sky-model';
import scene from './scene.json';

const WIDTH = 1536;
const HEIGHT = 1024;
const MAG_LIMIT = 5.8;

export type NamedStar = {
  x: number;
  y: number;
  name: string;
  es?: string;
  constellation?: string;
};

export type SkyLayers = {
  /** Stars: RGB on black, painting pixels. */
  stars: HTMLCanvasElement;
  /** Constellation lines: R every line, G the highlighted constellation. */
  lines: HTMLCanvasElement;
  frame: SkyFrame;
  moon: MoonPhase;
  /** The bright named stars above the painted horizon, for the labels. */
  named: NamedStar[];
  /** Redraws everything for that moment. */
  update: (date: Date) => void;
  /** Redraws the lines with one constellation picked out (or none). */
  highlight: (constellation: string | null) => void;
};

type Row = [number, number, number, number, number, number];
const STARS = sky.stars as Row[];
const NAMES = sky.names as Record<
  string,
  { name: string; es?: string; c?: string }
>;
const LINES = sky.lines as Record<string, number[][]>;

function canvas() {
  const c = document.createElement('canvas');
  c.width = WIDTH;
  c.height = HEIGHT;
  return c;
}

/** Hidden by the land: below the painted horizon, give or take the hills. */
function aboveLand(y: number, alt: number) {
  return alt > 1 && y < scene.day.horizon - 24;
}

/**
 * The real sky's layers for the night painting: drawn on 2D canvases in
 * painting pixels and handed to the shader as textures, redrawn every few
 * seconds as the sky turns (about 3.5 px a minute).
 */
export function createSkyLayers(): SkyLayers {
  const stars = canvas();
  const lines = canvas();
  let highlighted: string | null = null;

  const layers: SkyLayers = {
    stars,
    lines,
    frame: skyFrame(new Date()),
    moon: moonPhase(new Date()),
    named: [],

    update(date) {
      layers.frame = skyFrame(date);
      layers.moon = moonPhase(date);
      drawStars();
      drawLines();
    },

    highlight(constellation) {
      if (constellation === highlighted) return;
      highlighted = constellation;
      drawLines();
    },
  };

  function drawStars() {
    const ctx = stars.getContext('2d')!;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'lighter';
    const named: NamedStar[] = [];

    STARS.forEach(([ra, dec, mag, r, g, b], i) => {
      const p = project(ra, dec, layers.frame);
      if (
        !p.front ||
        p.alt < -2 ||
        p.x < -20 ||
        p.x > WIDTH + 20 ||
        p.y < -20 ||
        p.y > HEIGHT
      ) {
        return;
      }
      // Brighter stars are larger and whiter at the core; magnitude 5.8 is a
      // pinpoint at the edge of seeing.
      const k = Math.max(0, Math.min(1, (MAG_LIMIT - mag) / 7.2));
      const radius = 0.7 + 1.8 * Math.pow(k, 1.2);
      const intensity = 0.34 + 0.66 * Math.pow(k, 0.8);
      const color = (a: number) =>
        `rgb(${Math.round(r * 255 * a)},${Math.round(g * 255 * a)},${Math.round(b * 255 * a)})`;
      ctx.fillStyle = color(intensity);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      if (mag < 1.8) {
        const halo = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          radius * 4,
        );
        halo.addColorStop(0, color(0.35 * intensity));
        halo.addColorStop(1, 'rgb(0,0,0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const name = NAMES[i];
      if (name && aboveLand(p.y, p.alt)) {
        named.push({
          x: p.x,
          y: p.y,
          name: name.name,
          es: name.es,
          constellation: name.c,
        });
      }
    });
    layers.named = named;
  }

  function drawLines() {
    const ctx = lines.getContext('2d')!;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    for (const [id, segments] of Object.entries(LINES)) {
      const picked = id === highlighted;
      ctx.strokeStyle = picked ? 'rgb(0,255,0)' : 'rgb(255,0,0)';
      ctx.lineWidth = picked ? 1.6 : 1.1;
      ctx.beginPath();
      for (const [ra0, dec0, ra1, dec1] of segments) {
        const a = project(ra0, dec0, layers.frame);
        const b = project(ra1, dec1, layers.frame);
        if (!a.front || !b.front || (a.alt < -5 && b.alt < -5)) continue;
        // Like a star chart: the line stops short of each star.
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const length = Math.hypot(dx, dy);
        if (length < 14 || length > 700) continue;
        const gap = 6 / length;
        ctx.moveTo(a.x + dx * gap, a.y + dy * gap);
        ctx.lineTo(b.x - dx * gap, b.y - dy * gap);
      }
      ctx.stroke();
    }
  }

  layers.update(new Date());
  return layers;
}

/** The constellation names (pt, en, es) from the sky data. */
export function constellationName(id: string | undefined, locale: string) {
  if (!id) return undefined;
  const names = (sky.constellations as Record<string, Record<string, string>>)[
    id
  ];
  if (!names) return undefined;
  return (names[locale] ?? names.en).replace(/ /g, ' ');
}

/** The equatorial frame as a 3 × 3 matrix (columns right, up, forward). */
export function frameMatrix(frame: SkyFrame) {
  const { right, up, forward } = frame;
  return [
    right[0],
    right[1],
    right[2],
    up[0],
    up[1],
    up[2],
    forward[0],
    forward[1],
    forward[2],
  ];
}

export { VIEW };
