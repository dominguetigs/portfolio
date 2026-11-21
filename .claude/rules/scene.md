---
paths:
  - 'src/scene/**'
  - 'scripts/scene/**'
  - 'src/components/ghibli-background/**'
---

# The living painting

How it works and why: `docs/scene.md`.

- At rest the canvas must match the static painting (it fades in over it). Keep the cover fit, `object-position: 40% 20%` and the 1.04 zoom identical in `ghibli-background` and the shader, and keep every colour raw sRGB: textures `NoColorSpace`, page colours as `Vector3`, never `THREE.Color`.
- three.js is imperative: mutate textures, materials and uniforms in module-level helpers or `useFrame`, never in render (the React Compiler lint rules reject it).
- Cap the per-frame clock step at 0.12 s for anything time-based; a stalled frame must not jump.
- A painting change means re-running `python3 scripts/scene/split_painting.py --debug <dir>` and checking the recomposite error and the masks.
- Check a change in a browser with WebGL (Playwright with `--use-angle=swiftshader`, or `--use-angle=metal --enable-gpu --ignore-gpu-blocklist` for real frame times): the day at rest, a full sunset, the night, a phone width, and the console (no warnings). In development `window.__sceneT = 0.7` holds the time of day (0 day, 1 night; the sun's elevation is `35 → 10°` over 0–0.2, then `10 → −16°`), for exact frames of any moment of the evening, close-ups of the sun and the moon included.
- The real sky (`sky-model.ts`, `sky-layers.ts`): check a change against known events with the clock fixed (Playwright `page.clock.setFixedTime`): the south celestial pole at (768, 385), the Southern Cross below the horizon on a November evening and high on a May one. A fixed clock freezes CSS transitions, so test the labels without it (`page.clock.install({ time })` lets time flow from that moment), or in development hold the sky with `window.__skyDate = '2026-05-15T21:00-03:00'` (the Southern Cross high). The stars are built by `scripts/scene/build_sky.py` from the download named in its docstring. A shooting star lasts about a second: catch it by reading `uMeteorState` through a temporary hook and screenshotting while its head is above 0 (a frame diff mostly finds the twinkle and the fireflies).
