'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
  type RootState,
} from '@react-three/fiber';
import {
  ClampToEdgeWrapping,
  DataTexture,
  Matrix3,
  RepeatWrapping,
  RGBAFormat,
  LinearFilter,
  NoColorSpace,
  ShaderMaterial,
  type Texture,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
} from 'three';

import { cn } from '@/lib/utils';

import {
  paintingFragmentShader,
  paintingVertexShader,
} from './painting-shader';
import scene from './scene.json';
import { createSceneInput, type SceneInput } from './scene-input';
import { createRealSky, type RealSky } from './real-sky';
import { frameMatrix, VIEW } from './sky-layers';
import { createMeteors, stepMeteors, type Meteors } from './meteors';
import { MoonLabel } from './moon-label';

import dayBase from './assets/day-base.webp';
import dayClouds from './assets/day-clouds.webp';
import dayCloudsStill from './assets/day-clouds-still.webp';
import dayData from './assets/day-data.webp';
import nightSky from './assets/night-sky.webp';
import dayBehind from './assets/day-behind.webp';
import nightBehind from './assets/night-behind.webp';
import milkyWay from './assets/milkyway.webp';

// Static imports: the build gives each layer a content-hashed URL, cached for
// good and never mixed with an older version of another layer.
const URLS = [
  dayBase,
  dayClouds,
  dayData,
  dayBehind,
  dayCloudsStill,
  nightSky,
  nightBehind,
  milkyWay,
].map(image => image.src);

/** How often the real sky is redrawn as it turns (it moves ~3.5 px a minute). */
const SKY_REFRESH_SECONDS = 20;

function moonPhaseUniform(sky: RealSky) {
  const { phase, illumination } = sky.layers.moon;
  return new Vector3(
    Math.cos(2 * Math.PI * phase),
    phase < 0.5 ? 1 : -1,
    illumination,
  );
}

/**
 * The moment the sky shows: now; in development, `window.__skyDate =
 * '2026-05-15T21:00-03:00'` holds another (the Southern Cross high).
 */
function skyDate() {
  if (process.env.NODE_ENV !== 'production') {
    const held = (window as { __skyDate?: string }).__skyDate;
    if (held) return new Date(held);
  }
  return new Date();
}

/** Redraws the sky for that moment and hands it to the shader. */
function refreshSky(material: ShaderMaterial, sky: RealSky, elapsed: number) {
  sky.layers.update(skyDate());
  sky.stars.needsUpdate = true;
  sky.updatedAt = elapsed;
  material.uniforms.uSkyFrame.value.fromArray(frameMatrix(sky.layers.frame));
  material.uniforms.uMoonPhase.value.copy(moonPhaseUniform(sky));
}

// Matches the static painting's scale (ghibli-background): a margin for the
// parallax to move into without reaching the painting's edge.
const PAINTING_ZOOM = 1.04;

// The page's background tokens (globals.css), as raw sRGB like the paintings.
// Not THREE.Color: it would convert them to linear and warm the whole sky.
function srgb(hex: number) {
  return new Vector3(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255,
  );
}
const PAPER = srgb(0xf1dfbe);
const NIGHT = srgb(0x020618);

type PaintingSet = 'day' | 'night';

function lightCircle(set: PaintingSet) {
  const { centerX, centerY, reach, body } = scene[set].light;
  return new Vector4(centerX, centerY, reach, body);
}

function behindBox(set: PaintingSet) {
  const { x, y, width, height } = scene[set].light.behind;
  return new Vector4(x, y, width, height);
}

/** The light's glow profile (scene.json) as a 64 x 1 texture. */
function glowProfile(set: PaintingSet) {
  return lookupTexture(scene[set].light.glow);
}

/** A 64 × 1 RGB lookup (scene.json) as a texture, sampled linearly. */
function lookupTexture(samples: number[][]) {
  const data = new Uint8Array(samples.length * 4);
  samples.forEach(([r, g, b], i) => {
    data.set(
      [r, g, b].map(v => Math.round(Math.min(Math.max(v, 0), 1) * 255)),
      i * 4,
    );
    data[i * 4 + 3] = 255;
  });
  const texture = new DataTexture(data, samples.length, 1, RGBAFormat);
  texture.colorSpace = NoColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// three.js is imperative; these helpers keep its mutations out of React's
// render, where the React Compiler rules forbid them.

function createPaintingMaterial(textures: Texture[], sky: RealSky) {
  for (const texture of textures) {
    // Image rows top-down, colours untouched: the shader mixes in the same
    // sRGB space the browser uses for the static painting.
    texture.flipY = false;
    texture.colorSpace = NoColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.needsUpdate = true;
  }
  const [dBase, dClouds, dData, dBehind, dCloudsStill, nSky, nBehind, mwMap] =
    textures;
  // The Milky Way map wraps around in right ascension.
  mwMap.wrapS = RepeatWrapping;

  return new ShaderMaterial({
    vertexShader: paintingVertexShader,
    fragmentShader: paintingFragmentShader,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uResolution: { value: new Vector2(1, 1) },
      uImageSize: { value: new Vector2(scene.day.width, scene.day.height) },
      uObjectPosition: { value: new Vector2(0.4, 0.2) },
      uZoom: { value: PAINTING_ZOOM },
      uTime: { value: 0 },
      uT: { value: 0 },
      uHorizonY: { value: scene.day.horizon },
      uPointer: { value: new Vector2() },
      uScroll: { value: 0 },
      uPixelRatio: { value: 1 },
      uWind: { value: 0 },
      uWindPhase: { value: 0 },
      uCloudPush: { value: 0 },
      uBreeze: { value: new Vector2(-9999, -9999) },
      uBreezeStrength: { value: 0 },
      uLeafAge: { value: 100 },
      uLeafSeed: { value: 0 },
      uPaper: { value: PAPER },
      uNight: { value: NIGHT },
      uDayBase: { value: dBase },
      uDayClouds: { value: dClouds },
      uDayCloudsStill: { value: dCloudsStill },
      uNightCloudDark: { value: new Vector3(...scene.nightClouds.dark) },
      uNightCloudLight: { value: new Vector3(...scene.nightClouds.light) },
      uNightCloudMoonlit: { value: new Vector3(...scene.nightClouds.moonlit) },
      uNightCloudLuma: { value: new Vector2(...scene.nightClouds.luma) },
      uNightCloudMoonReach: { value: scene.nightClouds.moonReach },
      uNightCloudAlpha: { value: scene.nightClouds.alpha },
      uDayData: { value: dData },
      // Where the sun's centre ends, its disc just below the hills.
      uSunSetY: {
        value: scene.day.horizon + scene.day.light.body + 20,
      },
      uDayBehind: { value: dBehind },
      uDayBehindBox: { value: behindBox('day') },
      uDayGlow: { value: glowProfile('day') },
      uDayLightCircle: { value: lightCircle('day') },
      uNightSky: { value: nSky },
      uNightLand: { value: lookupTexture(scene.nightLand) },
      uNightBehind: { value: nBehind },
      uNightBehindBox: { value: behindBox('night') },
      uNightGlow: { value: glowProfile('night') },
      uNightLightCircle: { value: lightCircle('night') },
      uStars: { value: sky.stars },
      uMeteor: { value: new Vector4() },
      uMeteorState: { value: new Vector2(-1, 0) },
      uMilkyWay: { value: mwMap },
      uSkyFrame: {
        value: new Matrix3().fromArray(frameMatrix(sky.layers.frame)),
      },
      uView: { value: new Vector3(VIEW.cx, VIEW.cy, VIEW.scale) },
      uMoonPhase: { value: moonPhaseUniform(sky) },
    },
  });
}

function step(
  material: ShaderMaterial,
  input: SceneInput,
  sky: RealSky,
  meteors: Meteors,
  state: RootState,
  delta: number,
) {
  const u = material.uniforms;
  input.update(delta, state.clock.elapsedTime);
  // In development, `window.__sceneT = 0.7` holds the time of day (0 day,
  // 1 night) for a look at any moment of the evening.
  if (process.env.NODE_ENV !== 'production') {
    const held = (window as { __sceneT?: number }).__sceneT;
    if (typeof held === 'number') input.t = held;
  }
  sky.night.value = input.t;
  // (In development, a new `window.__skyDate` redraws the sky at once.)
  const heldDate =
    process.env.NODE_ENV !== 'production'
      ? (window as { __skyDate?: string }).__skyDate
      : undefined;
  if (
    heldDate !== sky.heldDate ||
    state.clock.elapsedTime - sky.updatedAt > SKY_REFRESH_SECONDS
  ) {
    sky.heldDate = heldDate;
    refreshSky(material, sky, state.clock.elapsedTime);
  }
  state.gl.getDrawingBufferSize(u.uResolution.value);
  u.uTime.value = state.clock.elapsedTime;
  u.uT.value = input.t;
  u.uPointer.value.copy(input.pointer);
  u.uScroll.value = input.scroll;
  const ratio = state.gl.getPixelRatio();
  u.uPixelRatio.value = ratio;
  u.uWind.value = input.wind;
  u.uWindPhase.value = input.windPhase;
  u.uCloudPush.value = input.cloudPush;
  u.uBreeze.value.set(input.breeze.x * ratio, input.breeze.y * ratio);
  u.uBreezeStrength.value = input.breezeStrength;
  u.uLeafAge.value = input.leafAge;
  u.uLeafSeed.value = input.leafSeed;
  stepMeteors(
    meteors,
    Math.min(delta, 0.12),
    input.t,
    state.size,
    PAINTING_ZOOM,
    u.uMeteor.value,
    u.uMeteorState.value,
  );
}

function Painting({
  sky,
  onFirstFrame,
}: {
  sky: RealSky;
  onFirstFrame: () => void;
}) {
  const textures = useLoader(TextureLoader, URLS);
  const material = useMemo(
    () => createPaintingMaterial(textures, sky),
    [textures, sky],
  );
  // useMemo, not useState: Fast Refresh recreates it when the code changes,
  // so an edit never leaves an older input object behind.
  const input = useMemo(() => createSceneInput(), []);
  const meteors = useMemo(() => createMeteors(), []);
  const [started, setStarted] = useState(false);

  useEffect(() => input.listen(), [input]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    step(material, input, sky, meteors, state, delta);
    if (!started) {
      setStarted(true);
      onFirstFrame();
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/**
 * Drives the demand frameloop: the painting moves slowly, so phones draw at
 * 30 fps (battery) and the rest at the display's rate. requestAnimationFrame
 * stops by itself in a hidden tab.
 */
function Ticker({ fps }: { fps: number }) {
  const invalidate = useThree(state => state.invalidate);

  useEffect(() => {
    const interval = 1000 / fps - 2;
    let last = 0;
    let id = requestAnimationFrame(function loop(now) {
      if (now - last >= interval) {
        last = now;
        invalidate();
      }
      id = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, [fps, invalidate]);

  return null;
}

/**
 * The painting brought to life: drawn on a canvas over the static painting,
 * which it fades in on top of once its first frame is ready (and which stays
 * as the fallback).
 */
export default function LivingSky() {
  const [visible, setVisible] = useState(false);
  // Client only (ssr: false): the sky is drawn on 2D canvases.
  const [sky] = useState(createRealSky);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.sky;
    },
    [],
  );
  // The painting is soft and shown washed out: 1.5 device px per CSS px is as
  // sharp as it needs to be, and phones stay at 1.25. (Client only: this
  // component is loaded with ssr: false.)
  const [{ dpr, fps }] = useState(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    return {
      dpr: Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5),
      fps: coarse ? 30 : 60,
    };
  });

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-1000 ease-out',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <Canvas
        flat
        linear
        dpr={dpr}
        frameloop="demand"
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        orthographic
        camera={{ position: [0, 0, 1] }}
      >
        <Ticker fps={fps} />
        <Suspense fallback={null}>
          <Painting
            sky={sky}
            onFirstFrame={() => {
              // The theme toggle sweeps only while the sky is live.
              document.documentElement.dataset.sky = 'live';
              setVisible(true);
            }}
          />
        </Suspense>
      </Canvas>
      <MoonLabel sky={sky} />
    </div>
  );
}
