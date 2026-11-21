import sky from './sky.json';
import {
  moonPhase,
  project,
  skyFrame,
  VIEW,
  type MoonPhase,
  type SkyFrame,
} from './sky-model';

const WIDTH = 1536;
const HEIGHT = 1024;
const MAG_LIMIT = 5.8;

export type SkyLayers = {
  /** Stars: RGB on black, painting pixels. */
  stars: HTMLCanvasElement;
  frame: SkyFrame;
  moon: MoonPhase;
  /** Redraws the sky for that moment. */
  update: (date: Date) => void;
};

type Row = [number, number, number, number, number, number];
const STARS = sky.stars as Row[];

/**
 * The real sky for the night painting: the stars drawn on a 2D canvas in
 * painting pixels and handed to the shader as a texture, redrawn every few
 * seconds as the sky turns (about 3.5 px a minute).
 */
export function createSkyLayers(): SkyLayers {
  const stars = document.createElement('canvas');
  stars.width = WIDTH;
  stars.height = HEIGHT;

  const layers: SkyLayers = {
    stars,
    frame: skyFrame(new Date()),
    moon: moonPhase(new Date()),

    update(date) {
      layers.frame = skyFrame(date);
      layers.moon = moonPhase(date);
      drawStars();
    },
  };

  function drawStars() {
    const ctx = stars.getContext('2d')!;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'lighter';

    for (const [ra, dec, mag, r, g, b] of STARS) {
      const p = project(ra, dec, layers.frame);
      if (
        !p.front ||
        p.alt < -2 ||
        p.x < -20 ||
        p.x > WIDTH + 20 ||
        p.y < -20 ||
        p.y > HEIGHT
      ) {
        continue;
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
    }
  }

  layers.update(new Date());
  return layers;
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
