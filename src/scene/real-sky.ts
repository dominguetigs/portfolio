import { CanvasTexture, LinearFilter, NoColorSpace } from 'three';

import { createSkyLayers, type SkyLayers } from './sky-layers';

/**
 * The real sky (phase 3) shared by the painting and the labels: its layers,
 * their textures, and how far night has fallen (the labels only answer at
 * night).
 */
export type RealSky = {
  layers: SkyLayers;
  stars: CanvasTexture;
  lines: CanvasTexture;
  night: { value: number };
  updatedAt: number;
};

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = NoColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  return texture;
}

export function createRealSky(): RealSky {
  const layers = createSkyLayers();
  return {
    layers,
    stars: canvasTexture(layers.stars),
    lines: canvasTexture(layers.lines),
    night: { value: 0 },
    updatedAt: 0,
  };
}

/** The labels picked a constellation: redraw the lines with it picked out. */
export function highlightConstellation(sky: RealSky, id: string | null) {
  sky.layers.highlight(id);
  sky.lines.needsUpdate = true;
}
