'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode, useEffect, useState } from 'react';

import { useSplashGone } from '@/components/splash-screen/splash-state';

const LivingSky = dynamic(() => import('./living-sky'), { ssr: false });

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    // Anything that goes wrong in the scene leaves the static painting.
    return this.state.failed ? null : this.props.children;
  }
}

function canRun() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return gl != null;
  } catch {
    return false;
  }
}

/**
 * Brings the painting to life once the page is seen and the browser is idle:
 * after the splash, never with reduced motion or without WebGL. three.js and
 * the scene are loaded only then, so they stay out of the first paint.
 */
export function LivingSkyGate() {
  // Not while the splash tears open: loading three.js and compiling the
  // shader would stall the tear.
  const splashGone = useSplashGone();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!splashGone || !canRun()) return;

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 2000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, [splashGone]);

  if (!ready) return null;

  return (
    <SceneBoundary>
      <LivingSky />
    </SceneBoundary>
  );
}
