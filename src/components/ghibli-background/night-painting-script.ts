'use client';

import { createElement } from 'react';

import { NIGHT_PAINTING_SCRIPT } from '@/scene/sky-model';

/**
 * Picks today's night painting (one per moon phase) before the first paint
 * (place it in <head>). Like SplashHeadScript it must be a client component
 * that renders into the server HTML only: on the client it renders nothing,
 * and React leaves server-only nodes in <head> alone. As a server component
 * its <script> would be hydrated against whatever node sits in its place.
 */
export function NightPaintingScript() {
  if (typeof window !== 'undefined') return null;
  return createElement('script', {
    dangerouslySetInnerHTML: { __html: NIGHT_PAINTING_SCRIPT },
  });
}
