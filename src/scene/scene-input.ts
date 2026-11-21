import { Vector2 } from 'three';

import { SWEEP_EVENT } from '@/components/theme-toggle/use-theme-toggle';

const NIGHT_FALL_SECONDS = 4.2;

function isDark() {
  return document.documentElement.classList.contains('dark');
}

// Gentle at both ends and not too fast in the middle, so dusk lingers.
function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export type SceneInput = {
  /** -1..1 on both axes, smoothed. */
  pointer: Vector2;
  /** The wind: 0 calm .. 1 a strong gust (scroll speed), smoothed. */
  wind: number;
  /** Accumulated wind travel, so gusts speed the waves up without a jump. */
  windPhase: number;
  /** How far the wind has pushed the clouds; settles back when it calms. */
  cloudPush: number;
  /** The pointer's local breeze: where (CSS px) and how strong (0..1). */
  breeze: Vector2;
  breezeStrength: number;
  /** Seconds since a gust last carried leaves across (large: none). */
  leafAge: number;
  leafSeed: number;
  /** 0 at the top of the page, 1 one screen down (clamped at 1.5). */
  scroll: number;
  /** Time of day: 0 day, 1 night, animated when the theme changes. */
  t: number;
  /** Call every frame. */
  update: (delta: number, elapsed: number) => void;
  /** Starts listening; returns the cleanup. */
  listen: () => () => void;
};

/**
 * What the living painting listens to: the pointer (or the phone's tilt), the
 * scroll, and the theme. Plain mutable state, read every frame, never React
 * state.
 */
export function createSceneInput(): SceneInput {
  const target = new Vector2();
  const start = isDark() ? 1 : 0;
  let tween = { from: start, to: start, start: 0 };

  // The wind, fed by the scroll's speed and the pointer's.
  let scrollSpeed = 0; // px/s, decays when the scroll stops
  let lastScroll = { y: 0, at: 0 };
  let pointerSpeed = 0;
  let lastPointer = { x: 0, y: 0, at: 0 };
  let leafStart = -100;
  // null until the first measurement; -1 is above the first section (the hero).
  let sectionIndex: number | null = null;
  let sections: number[] = [];
  let measuredAt = -1;

  const measureSections = () => {
    sections = [...document.querySelectorAll('section[id]')].map(
      el => el.getBoundingClientRect().top + window.scrollY,
    );
  };

  const input: SceneInput = {
    pointer: new Vector2(),
    wind: 0,
    windPhase: 0,
    cloudPush: 0,
    breeze: new Vector2(),
    breezeStrength: 0,
    leafAge: 100,
    leafSeed: 0,
    scroll: 0,
    t: start,

    update(delta, elapsed) {
      // Frame-rate independent smoothing; a stalled frame does not jump.
      const dt = Math.min(delta, 0.12);
      const step = 1 - Math.exp(-dt * 2.5);
      input.pointer.lerp(target, step);

      // A gust comes fast and dies down slowly; under it, a breeze that
      // never quite stops.
      scrollSpeed *= Math.exp(-dt * 3);
      const breeze =
        0.18 + 0.1 * Math.sin(elapsed * 0.21) * Math.sin(elapsed * 0.13);
      const gust = Math.min(scrollSpeed / 2600, 1);
      const windTarget = Math.max(breeze, gust);
      const rate = windTarget > input.wind ? 6 : 0.9;
      input.wind += (windTarget - input.wind) * (1 - Math.exp(-dt * rate));
      input.windPhase += dt * (1.1 + 3.2 * input.wind);
      input.cloudPush +=
        (input.wind * 0.018 - input.cloudPush) * (1 - Math.exp(-dt * 0.6));

      pointerSpeed *= Math.exp(-dt * 2.2);
      input.breezeStrength = Math.min(pointerSpeed / 1800, 1);

      // Section to section, a gust carries a few leaves across. Positions
      // are measured at most every half second, never per frame.
      if (elapsed - measuredAt > 0.5) {
        measuredAt = elapsed;
        measureSections();
      }
      const line = window.scrollY + window.innerHeight * 0.5;
      let index = -1;
      for (let i = 0; i < sections.length; i++)
        if (line >= sections[i]) index = i;
      if (sections.length && index !== sectionIndex) {
        const crossed = sectionIndex !== null;
        sectionIndex = index;
        if (crossed && elapsed - leafStart > 4) {
          leafStart = elapsed;
          input.leafSeed = (input.leafSeed + 1) % 97;
          scrollSpeed = Math.max(scrollSpeed, 2000);
        }
      }
      input.leafAge = elapsed - leafStart;

      if (tween.start < 0) tween.start = elapsed;
      const progress = Math.min(
        (elapsed - tween.start) / NIGHT_FALL_SECONDS,
        1,
      );
      input.t = tween.from + (tween.to - tween.from) * easeInOutSine(progress);
    },

    listen() {
      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        target.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * 2 - 1,
        );
        const now = performance.now();
        const gap = Math.max(now - lastPointer.at, 8);
        if (gap < 200) {
          const moved = Math.hypot(
            event.clientX - lastPointer.x,
            event.clientY - lastPointer.y,
          );
          pointerSpeed = Math.max(pointerSpeed, (moved / gap) * 1000);
        }
        lastPointer = { x: event.clientX, y: event.clientY, at: now };
        input.breeze.set(event.clientX, event.clientY);
      };
      const onLeave = () => target.set(0, 0);

      // Phones: the tilt drives the parallax, relative to how the phone was
      // held at first. Where the browser asks for permission first (iOS), no
      // event arrives and the scene simply ignores the tilt.
      let rest: { beta: number; gamma: number } | null = null;
      const onTilt = (event: DeviceOrientationEvent) => {
        if (event.beta == null || event.gamma == null) return;
        rest ??= { beta: event.beta, gamma: event.gamma };
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        target.set(
          clamp((event.gamma - rest.gamma) / 20),
          clamp((event.beta - rest.beta) / 20),
        );
      };

      const onScroll = () => {
        input.scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
        const now = performance.now();
        const gap = Math.max(now - lastScroll.at, 8);
        if (gap < 250) {
          const speed = (Math.abs(window.scrollY - lastScroll.y) / gap) * 1000;
          scrollSpeed = Math.max(scrollSpeed, speed);
        }
        lastScroll = { y: window.scrollY, at: now };
      };
      onScroll();

      // Night falls (or the sun rises) from wherever the sky is now, so a
      // quick second click turns it around smoothly. The toggle announces it
      // at once (the page's colours follow later); any other theme change
      // (the system's) is seen on the class.
      const turn = (to: number) => {
        if (to === tween.to) return;
        tween = { from: input.t, to, start: -1 };
      };
      const onSweep = (event: Event) =>
        turn((event as CustomEvent<string>).detail === 'dark' ? 1 : 0);
      const observer = new MutationObserver(() => turn(isDark() ? 1 : 0));
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      window.addEventListener(SWEEP_EVENT, onSweep);
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('deviceorientation', onTilt, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener(SWEEP_EVENT, onSweep);
        window.removeEventListener('pointermove', onPointer);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('deviceorientation', onTilt);
        window.removeEventListener('scroll', onScroll);
      };
    },
  };

  return input;
}
