import type { Vector3, Vector4 } from 'three';

import scene from './scene.json';

/**
 * Now and then, once night has fallen, a shooting star falls towards the
 * land and goes behind the hills, its trail lingering a moment in the sky
 * (the shader draws it: `meteorLight`, hidden by the land like the stars).
 */
const FIRST_AFTER = [5, 12];
const GAP = [25, 75];
/** Where it appears: painting pixels above the painted horizon. */
const HEIGHT_ABOVE = [230, 470];
/** How steeply it falls, degrees below the horizontal. */
const SLOPE = [38, 68];
/** Painting pixels a second (about 30° to 45° a second). */
const SPEED = [420, 600];
/** Its trail, painting pixels. */
const TRAIL = [90, 150];
/** How long the trail lingers once the head is behind the hills, seconds. */
const LINGER = 0.3;
/** It ends this far below the painted horizon: well behind the hills. */
const BELOW = 40;

const WIDTH = scene.day.width;
const HEIGHT = scene.day.height;

export type Meteors = {
  /** Seconds of night until the next one. */
  wait: number;
  /** Seconds since it appeared, and its flight (age >= travel + LINGER: gone). */
  age: number;
  travel: number;
  bright: number;
};

const between = ([a, b]: number[]) => a + Math.random() * (b - a);

export function createMeteors(): Meteors {
  return { wait: between(FIRST_AFTER), age: 0, travel: -LINGER, bright: 0 };
}

/**
 * Steps the shooting stars by `dt` seconds at `night` (0 day .. 1 night) on
 * a screen of `size` CSS pixels, and hands the current one to the shader:
 * `meteor` its path in painting pixels, `state` the head's progress along it
 * (below 0: none), its brightness, and its trail as a fraction of the path.
 */
export function stepMeteors(
  meteors: Meteors,
  dt: number,
  night: number,
  size: { width: number; height: number },
  zoom: number,
  meteor: Vector4,
  state: Vector3,
) {
  if (meteors.age < meteors.travel + LINGER) {
    meteors.age += dt;
    const { age, travel } = meteors;
    const flare = Math.min(age / 0.08, 1);
    const linger = age > travel ? 1 - (age - travel) / LINGER : 1;
    if (linger <= 0) {
      state.x = -1;
      return;
    }
    state.x = Math.min(age / travel, 1);
    state.y = meteors.bright * flare * linger;
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

  // Where it goes behind the hills, then back up its path to where it
  // appears (on the screen, the other way if it would start off it).
  const horizon = scene.day.horizon;
  const endX = left + shown * (0.15 + 0.7 * Math.random());
  const endY = horizon + BELOW;
  const startY = Math.max(top + 24, horizon - between(HEIGHT_ABOVE));
  const run = (endY - startY) / Math.tan((between(SLOPE) * Math.PI) / 180);
  let startX = endX - run * (Math.random() < 0.5 ? 1 : -1);
  if (startX < left + 20 || startX > left + shown - 20) {
    startX = 2 * endX - startX;
  }
  meteor.set(startX, startY, endX, endY);

  const length = Math.hypot(endX - startX, endY - startY);
  meteors.age = 0;
  meteors.travel = length / between(SPEED);
  meteors.bright = 0.65 + 0.35 * Math.random();
  meteors.wait = between(GAP);
  state.set(0, 0, between(TRAIL) / length);
}
