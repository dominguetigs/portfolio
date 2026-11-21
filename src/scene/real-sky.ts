import { CanvasTexture, LinearFilter, NoColorSpace } from 'three';

import { createSkyLayers, type SkyLayers } from './sky-layers';

/**
 * The real sky (phase 3) shared by the painting and the moon's label: its
 * stars and their texture, and how far night has fallen (the label only
 * answers at night).
 */
export type RealSky = {
  layers: SkyLayers;
  stars: CanvasTexture;
  night: { value: number };
  updatedAt: number;
  /** In development, the moment held by `window.__skyDate`. */
  heldDate?: string;
};

export function createRealSky(): RealSky {
  const layers = createSkyLayers();
  const stars = new CanvasTexture(layers.stars);
  stars.flipY = false;
  stars.colorSpace = NoColorSpace;
  stars.generateMipmaps = false;
  stars.minFilter = LinearFilter;
  stars.magFilter = LinearFilter;
  return { layers, stars, night: { value: 0 }, updatedAt: 0 };
}
