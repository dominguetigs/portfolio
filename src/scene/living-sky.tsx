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

const LAYERS = ['sky', 'clouds', 'light', 'land', 'data'] as const;
const URLS = (['day', 'night'] as const).flatMap(set =>
  LAYERS.map(layer => `/scene/${set}-${layer}.webp`),
);

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

function lightBox(set: keyof typeof scene) {
  const { x, y, width, height } = scene[set].light;
  return new Vector4(x, y, width, height);
}

// three.js is imperative; these helpers keep its mutations out of React's
// render, where the React Compiler rules forbid them.

function createPaintingMaterial(textures: Texture[]) {
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
  const [
    dSky,
    dClouds,
    dLight,
    dLand,
    dData,
    nSky,
    nClouds,
    nLight,
    nLand,
    nData,
  ] = textures;

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
      uPointer: { value: new Vector2() },
      uScroll: { value: 0 },
      uPaper: { value: PAPER },
      uNight: { value: NIGHT },
      uDaySky: { value: dSky },
      uDayClouds: { value: dClouds },
      uDayLight: { value: dLight },
      uDayLand: { value: dLand },
      uDayData: { value: dData },
      uDayLightBox: { value: lightBox('day') },
      uNightSky: { value: nSky },
      uNightClouds: { value: nClouds },
      uNightLight: { value: nLight },
      uNightLand: { value: nLand },
      uNightData: { value: nData },
      uNightLightBox: { value: lightBox('night') },
    },
  });
}

function step(
  material: ShaderMaterial,
  input: SceneInput,
  state: RootState,
  delta: number,
) {
  const u = material.uniforms;
  input.update(delta, state.clock.elapsedTime);
  state.gl.getDrawingBufferSize(u.uResolution.value);
  u.uTime.value = state.clock.elapsedTime;
  u.uT.value = input.t;
  u.uPointer.value.copy(input.pointer);
  u.uScroll.value = input.scroll;
}

function Painting({ onFirstFrame }: { onFirstFrame: () => void }) {
  const textures = useLoader(TextureLoader, URLS);
  const material = useMemo(() => createPaintingMaterial(textures), [textures]);
  const [input] = useState(createSceneInput);
  const [started, setStarted] = useState(false);

  useEffect(() => input.listen(), [input]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    step(material, input, state, delta);
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
          <Painting onFirstFrame={() => setVisible(true)} />
        </Suspense>
      </Canvas>
    </div>
  );
}
