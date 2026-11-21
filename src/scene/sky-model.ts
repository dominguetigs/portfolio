/**
 * The real sky over São Paulo, as the night painting sees it: looking south,
 * from the horizon to about 50° up. All positions are in painting pixels
 * (1536 × 1024), where the painted horizon sits at y ≈ 734.
 *
 * Accuracy is what a painting needs (a fraction of a degree): J2000 positions
 * without precession, mean sidereal time, the mean lunar month.
 */

const D2R = Math.PI / 180;

/** São Paulo (Praça da Sé). */
export const LATITUDE = -23.5505 * D2R;
const LONGITUDE = -46.6333;

/**
 * The view: centred due south, tilted 30° up, a stereographic projection
 * whose scale puts about 115° across the painting, the horizon at the
 * painted one (y ≈ 734) and the top at about 59° up, so the Southern Cross
 * stays in the frame even at its highest (53.5° from São Paulo).
 */
const TILT = 30 * D2R;
export const VIEW = (() => {
  const scale = 700;
  const horizonY = 734;
  return {
    cx: 768,
    cy: horizonY - 2 * Math.tan(TILT / 2) * scale,
    scale,
    horizonY,
  };
})();

export type Vec3 = [number, number, number];

/** The camera's right, up and forward directions in equatorial coordinates. */
export type SkyFrame = { right: Vec3; up: Vec3; forward: Vec3; zenith: Vec3 };

function julianDay(date: Date) {
  return date.getTime() / 86_400_000 + 2_440_587.5;
}

/** Local sidereal time in São Paulo, radians. */
export function siderealTime(date: Date) {
  const d = julianDay(date) - 2_451_545.0;
  const gmst = 280.46061837 + 360.98564736629 * d;
  return ((((gmst + LONGITUDE) % 360) + 360) % 360) * D2R;
}

/** Where the painting looks, in the equatorial frame, at that moment. */
export function skyFrame(date: Date): SkyFrame {
  const theta = siderealTime(date);
  const sinP = Math.sin(LATITUDE);
  const cosP = Math.cos(LATITUDE);
  const zenith: Vec3 = [cosP * Math.cos(theta), cosP * Math.sin(theta), sinP];
  const north: Vec3 = [-sinP * Math.cos(theta), -sinP * Math.sin(theta), cosP];
  const east: Vec3 = [-Math.sin(theta), Math.cos(theta), 0];
  const s = Math.sin(TILT);
  const c = Math.cos(TILT);
  return {
    // Facing south, west is to the right.
    right: [-east[0], -east[1], -east[2]],
    up: [
      s * north[0] + c * zenith[0],
      s * north[1] + c * zenith[1],
      s * north[2] + c * zenith[2],
    ],
    forward: [
      -c * north[0] + s * zenith[0],
      -c * north[1] + s * zenith[1],
      -c * north[2] + s * zenith[2],
    ],
    zenith,
  };
}

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** A position (degrees, J2000) in painting pixels, and its altitude (degrees). */
export function project(raDeg: number, decDeg: number, frame: SkyFrame) {
  const ra = raDeg * D2R;
  const dec = decDeg * D2R;
  const v: Vec3 = [
    Math.cos(dec) * Math.cos(ra),
    Math.cos(dec) * Math.sin(ra),
    Math.sin(dec),
  ];
  const z = dot(v, frame.forward);
  const k = 2 / (1 + z);
  return {
    x: VIEW.cx + dot(v, frame.right) * k * VIEW.scale,
    y: VIEW.cy - dot(v, frame.up) * k * VIEW.scale,
    alt: Math.asin(dot(v, frame.zenith)) / D2R,
    // Behind the viewer the projection blows up: never draw those.
    front: z > -0.2,
  };
}

export type MoonPhase = {
  /** 0 new, 0.25 first quarter, 0.5 full, 0.75 last quarter. */
  phase: number;
  /** Fraction of the disc lit, 0..1. */
  illumination: number;
  /** Index into the eight phase names (messages: Index.Sky.moonPhases). */
  name: number;
  /** Which of the baked night paintings (public/night/night-NN.webp). */
  bucket: number;
};

const SYNODIC_MONTH = 29.530588861;
const NEW_MOON_EPOCH = 2_451_550.09766;

/**
 * The phases the static night painting is baked in (scripts/scene/
 * split_painting.py, MOON_PHASES): the live scene draws the same rounded
 * phase, so it fades in over an identical moon.
 */
export const MOON_PHASES = 24;

/**
 * Today's night painting, chosen before the first paint (the same arithmetic
 * as moonPhase, inlined): sets --night-painting on <html>.
 */
export const NIGHT_PAINTING_SCRIPT = `try{var a=(Date.now()/864e5+2440587.5-${NEW_MOON_EPOCH})/${SYNODIC_MONTH},b=Math.round((a-Math.floor(a))*${MOON_PHASES})%${MOON_PHASES};document.documentElement.style.setProperty('--night-painting','url(/night/night-'+(b<10?'0':'')+b+'.webp)')}catch(e){}`;

export function moonPhase(date: Date): MoonPhase {
  const age = (julianDay(date) - NEW_MOON_EPOCH) / SYNODIC_MONTH;
  const bucket =
    Math.round((age - Math.floor(age)) * MOON_PHASES) % MOON_PHASES;
  const phase = bucket / MOON_PHASES;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const bounds = [0.0339, 0.216, 0.284, 0.466, 0.534, 0.716, 0.784, 0.9661];
  const index = bounds.findIndex(b => phase < b);
  return { phase, illumination, name: index === -1 ? 0 : index, bucket };
}
