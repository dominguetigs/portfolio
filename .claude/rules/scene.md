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
- Check a change in a browser with WebGL (Playwright with `--use-angle=swiftshader`): the day at rest, a full sunset (frames every ~0.5 s), the night, a phone width, and the console (no warnings).
- The real sky (`sky-model.ts`, `sky-layers.ts`): check a change against known events with the clock fixed (Playwright `page.clock.setFixedTime`): the south celestial pole at (768, 385), the Southern Cross below the horizon on a November evening and high on a May one. A fixed clock freezes CSS transitions, so test the labels without it.
