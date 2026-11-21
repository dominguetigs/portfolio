'use client';

import { createElement, useSyncExternalStore } from 'react';

/**
 * The splash covers a page that is already rendered (server HTML), so the
 * content is there for crawlers and for the first paint. It shows once per
 * browser session and never when the visitor asks for reduced motion.
 *
 * `<html data-splash>` carries the state, set before the first paint by
 * SplashHeadScript (in the layout's <head>):
 * - `show`: the splash is on screen (the page does not scroll)
 * - `skip`: already seen in this session, reduced motion, or the page's
 *   scripts never ran (CSS hides it)
 * - `done`: it has just finished
 */

const SEEN_KEY = 'splash-seen';
const DONE_EVENT = 'splash:done';

// Failsafe: if the splash has not come alive (React never hydrated: a script
// that failed to load or was blocked), skip it, so the page under it shows.
const FAILSAFE_MS = 6000;

const SPLASH_HEAD_SCRIPT = `try{var d=document.documentElement;d.dataset.splash=sessionStorage.getItem('${SEEN_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches?'skip':'show';if(d.dataset.splash==='show')setTimeout(function(){if(d.dataset.splash==='show'&&!d.dataset.splashLive)d.dataset.splash='skip'},${FAILSAFE_MS})}catch(e){document.documentElement.dataset.splash='skip'}`;

/** The splash is running: the head script's failsafe leaves it alone. */
export function markSplashLive() {
  document.documentElement.dataset.splashLive = '1';
}

/**
 * Sets `data-splash` before the first paint (place it in <head>). It renders
 * into the server HTML only: a <script> React creates on the client never runs
 * and makes React warn, and the root layout remounts on the client whenever
 * the locale changes. React leaves server-only nodes in <head> alone.
 */
export function SplashHeadScript() {
  if (typeof window !== 'undefined') return null;
  return createElement('script', {
    dangerouslySetInnerHTML: { __html: SPLASH_HEAD_SCRIPT },
  });
}

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
