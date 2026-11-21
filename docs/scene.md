---
summary: How the living painting works — the layers, the shader, the sunset, the fallback — and what each choice protects
read_when: any change to src/scene, scripts/scene, the painted background or the theme toggle's sky
sources:
  - scripts/scene/split_painting.py
  - src/scene
  - src/components/ghibli-background/index.tsx
verified: none
---

# The living painting

Phases 1 and 2 of `docs/roadmap.md`: the painted landscape breathes (clouds drift, the grass catches the wind, the sun breathes, layers move in depth with the pointer, the scroll and the phone's tilt), and the theme toggle is a sunset or a sunrise.

## From painting to layers (offline)

`scripts/scene/split_painting.py` (numpy, pillow, scipy; about a minute) splits each painting — `public/bg-light.png` (day) and `public/bg-dark.png` (night) — into `public/scene/`:

| File                | What                                                                                                                                                                                                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<set>-sky.webp`    | the sky alone: clouds, sun or moon and land removed, the holes filled from the clear sky around (normalized convolution). Under the land it continues the sky from well above the horizon, so parallax never uncovers leftover treetops.                                                                        |
| `<set>-clouds.webp` | the clouds (RGBA, 75% size), matted against that sky so they composite back exactly. Found with a top-hat (grey opening wider than any cloud); around the sun or moon the baseline is the radial median, because the glow is symmetric and clouds are not. Clouds win over the light: the sun sits behind them. |
| `<set>-light.webp`  | the sun or the moon with its glow, as a sprite; its box is in `src/scene/scene.json`                                                                                                                                                                                                                            |
| `<set>-land.webp`   | hills, trees and meadow, the painting itself with a soft land alpha (land = what touches the bottom edge, by green/blue ratio)                                                                                                                                                                                  |
| `<set>-data.webp`   | half size; R depth (0 sky, 0.25 at the horizon to 1 at the bottom), G grass (the meadow, not the dark crowns)                                                                                                                                                                                                   |

The two paintings show the same valley but are not aligned pixel to pixel, so each one has its own masks. The `--debug DIR` flag writes the masks and a recomposite (sky + light + clouds + land), whose mean error against the painting should stay under 0.005.

## On the page

- `GhibliBackground` always renders the two static paintings (server HTML, `object-cover`, `object-position: 40% 20%`, `scale(1.04)` around that point) and the CSS gradient towards the page colour. With `live` (the page's background, not the splash's) it adds `LivingSkyGate` **above** that gradient.
- `LivingSkyGate` mounts the scene once the splash is gone and the browser is idle, never with `prefers-reduced-motion` or without WebGL; three.js and R3F load only then (`next/dynamic`, `ssr: false`). An error boundary leaves the static painting on any failure.
- `LivingSky` draws one fullscreen quad (`painting-shader.ts`) and fades in over the static painting after its first frame. At rest it matches the static painting to about 1/255 on average (measured), so the fade cannot be seen. That needs: the same cover fit and zoom, the colours as raw sRGB everywhere (textures `NoColorSpace`, `flat` + `linear` canvas, the page colours as `Vector3`, never `THREE.Color`, which converts to linear and warms the sky), and the page's bottom gradient drawn in the shader (which is also what lets the fireflies glow above it).
- `frameloop="demand"` driven by a ticker: 60 fps on a fine pointer, 30 on phones; DPR at most 1.5 (1.25 on phones). The painting is soft and washed out, more pixels buy nothing.

## The shader

Everything is in image pixels (1536 × 1024). Order: sky → sun or moon → clouds → land, for the day and the night paintings, then mixed by the time of day, washed into the page colour (35% by day, 60% by night, more at golden hour and dusk), the page's bottom gradient, and the fireflies on top.

- **Parallax**: each layer moves by its depth (sky 0, clouds 0.08, land per pixel from the data map), up to 1.2% of the width; driven by the pointer, the scroll (0 to 1.5 screens) and the tilt. The 4% zoom is the margin it moves into.
- **Clouds** drift back and forth (±4.5% over about four minutes) instead of wrapping: no seam, and they never empty the sky.
- **Wind**: bright bands travel across the grass, like a gust combing a field (phase 4 makes it one wind for the whole page).
- **Sunset** (`uT` 0 → 1 over 4.2 s, ease-in-out sine, reversible mid-way): the sky leans towards a golden-hour gradient, then a dusk one; the sun turns orange and goes down behind the hills (the land layer hides it); clouds warm, then turn pink; the land darkens to violet; the night painting fades in, the moon rises from behind the hills, stars twinkle, fireflies light up over the grass. The page colour darkens only from 35% of the way.
- The UI's colours switch at once with the theme, as before; only the sky takes its time.

## Limits and decisions

- three.js is pinned to 0.182: R3F 9.8 still uses `THREE.Clock`, which logs a deprecation warning from r183 (D-008).
- iOS asks for permission before it sends the tilt; without it the scene ignores the tilt (no prompt is shown).
- The canvas is fixed behind the whole page; the scroll only moves the layers in depth. Walking down into the valley is phase 5.
