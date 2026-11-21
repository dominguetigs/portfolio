import { Vector2, Vector4 } from 'three';

import scene from './scene.json';

/**
 * Now and then, once night has fallen, a shooting star: a short streak down
 * the part of the sky on the screen, under a second, every half a minute to
 * a minute and a half (the shader draws it: `meteorLight`).
 */
const FIRST_AFTER = [5, 12];
const GAP = [25, 75];
const LIFE = [0.6, 1.1];
/** Painting pixels (about 8° to 18°). */
const LENGTH = [110, 240];
/** How steeply it falls, degrees below the horizontal. */
const SLOPE = [15, 55];
/** It never reaches this close to the painted horizon (the hills). */
const ABOVE_HILLS = 150;

const WIDTH = scene.day.width;
const HEIGHT = scene.day.height;

export type Meteors = {
  /** Seconds of night until the next one. */
  wait: number;
  /** Seconds since it began; its life (age >= life: none in the sky). */
  age: number;
  life: number;
};

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

export function createMeteors(): Meteors {
  return { wait: between(FIRST_AFTER), age: 1, life: 1 };
}

/**
 * Steps the shooting stars by `dt` seconds at `night` (0 day .. 1 night)
 * on a screen of `size` CSS pixels, and hands the current one to the shader:
 * `meteor` its path in painting pixels, `state` its progress (below 0: none)
 * and brightness.
 */
export function stepMeteors(
  meteors: Meteors,
  dt: number,
  night: number,
  size: { width: number; height: number },
  zoom: number,
  meteor: Vector4,
  state: Vector2,
) {
  if (meteors.age < meteors.life) {
    meteors.age += dt;
    state.x = Math.min(meteors.age / meteors.life, 1);
    if (meteors.age >= meteors.life) state.x = -1;
    return;
  }
  if (night < 0.98) {
    meteors.wait = Math.max(meteors.wait, between(FIRST_AFTER));
    return;
  }
  meteors.wait -= dt;
  if (meteors.wait > 0) return;

  // The part of the painting on the screen (its cover fit, as the shader's).
  const scale = Math.max(size.width / WIDTH, size.height / HEIGHT) * zoom;
  const left = ((WIDTH * scale - size.width) * 0.4) / scale;
  const top = ((HEIGHT * scale - size.height) * 0.2) / scale;
  const shown = size.width / scale;
  const lowest = scene.day.horizon - ABOVE_HILLS;

  const length = Math.min(between(LENGTH), shown * 0.6);
  const slope = (between(SLOPE) * Math.PI) / 180;
  const fromX = left + shown * (0.12 + 0.76 * Math.random());
  const fromY = Math.max(top, 0) + 30 + Math.random() * 260;
  // Towards the middle of the screen, so it stays on it.
  const side = fromX < left + shown / 2 ? 1 : -1;
  let dx = Math.cos(slope) * length * side;
  let dy = Math.sin(slope) * length;
  if (fromY + dy > lowest) {
    const k = Math.max(0.3, (lowest - fromY) / dy);
    dx *= k;
    dy *= k;
  }
  meteor.set(fromX, fromY, fromX + dx, fromY + dy);
  state.set(0, 0.65 + 0.35 * Math.random());
  meteors.age = 0;
  meteors.life = between(LIFE);
  meteors.wait = between(GAP);
}
