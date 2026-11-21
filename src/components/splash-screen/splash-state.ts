'use client';

import { useSyncExternalStore } from 'react';

/**
 * The splash covers a page that is already rendered (server HTML), so the
 * content is there for crawlers and for the first paint. It shows once per
 * browser session and never when the visitor asks for reduced motion.
 *
 * `<html data-splash>` carries the state, set before the first paint by
 * SPLASH_HEAD_SCRIPT (in the layout's <head>):
 * - `show`: the splash is on screen (the page does not scroll)
 * - `skip`: already seen in this session, or reduced motion (CSS hides it)
 * - `done`: it has just finished
 */

const SEEN_KEY = 'splash-seen';
const DONE_EVENT = 'splash:done';

export const SPLASH_HEAD_SCRIPT = `try{var d=document.documentElement;d.dataset.splash=sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches?'skip':'show'}catch(e){document.documentElement.dataset.splash='skip'}`;

function subscribe(onChange: () => void) {
  window.addEventListener(DONE_EVENT, onChange);
  return () => window.removeEventListener(DONE_EVENT, onChange);
}

function readState() {
  return document.documentElement.dataset.splash ?? 'skip';
}

/** `show` on the server and during hydration, then the real state. */
export function useSplashState() {
  return useSyncExternalStore(subscribe, readState, () => 'show');
}

/** True once the splash is gone (or was never shown). */
export function useSplashDone() {
  return useSplashState() !== 'show';
}

export function finishSplash() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Private mode or blocked storage: the splash shows again next visit.
  }
  document.documentElement.dataset.splash = 'done';
  window.dispatchEvent(new Event(DONE_EVENT));
}

type EntrancePreset = { initial?: unknown; animate?: unknown };

/**
 * Holds an entrance animation at its `initial` state while the splash is on
 * screen, so the reveal plays when the page is actually seen.
 */
export function useEntrance<T extends EntrancePreset>(preset: T): T {
  const done = useSplashDone();
  return done ? preset : { ...preset, animate: preset.initial };
}
