import { Vector2 } from 'three';

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

  const input: SceneInput = {
    pointer: new Vector2(),
    scroll: 0,
    t: start,

    update(delta, elapsed) {
      // Frame-rate independent smoothing; a stalled frame does not jump.
      const step = 1 - Math.exp(-Math.min(delta, 0.12) * 2.5);
      input.pointer.lerp(target, step);

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
      };
      onScroll();

      // The theme toggle: night falls (or the sun rises) from wherever the sky
      // is now, so a quick second click turns it around smoothly.
      const observer = new MutationObserver(() => {
        const to = isDark() ? 1 : 0;
        if (to === tween.to) return;
        tween = { from: input.t, to, start: -1 };
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      window.addEventListener('pointermove', onPointer, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      window.addEventListener('deviceorientation', onTilt, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        observer.disconnect();
        window.removeEventListener('pointermove', onPointer);
        document.documentElement.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('deviceorientation', onTilt);
        window.removeEventListener('scroll', onScroll);
      };
    },
  };

  return input;
}
