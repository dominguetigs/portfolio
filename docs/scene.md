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

`scripts/scene/split_painting.py` (numpy, pillow, scipy; about a minute and a half) takes each painting — `public/bg-light.png` (day) and `public/bg-dark.png` (night) — into `src/scene/assets/` (imported, so the build names each file by its content hash and no browser or CDN mixes an old layer with a new one):

| File                   | What                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<set>-base.webp`      | the painting itself, sun or moon included, with only its drifting clouds taken out (the sky behind them filled from the clear sky around, by normalized convolution); alpha = land. **Saved with `exact`**: without it the WebP encoder throws away the colour under transparent pixels, which here is the whole sky.                                                                     |
| `<set>-clouds.webp`    | the drifting clouds (RGBA, 75% size), matted against that sky so they composite back exactly. Found with a top-hat (a grey opening wider than any cloud). Whole clouds only: one that reaches the horizon band or the sun's or moon's glow stays in the base, and specks stay too, so no cloud is cut in two, the horizon haze never drifts and no drifting cloud opens a hole in a glow. |
| `<set>-light.webp`     | the moon's (or sun's) disc as a sprite, drawn only while it moves                                                                                                                                                                                                                                                                                                                         |
| `<set>-behind.webp`    | the clean sky behind the disc and its rim, matched in brightness to the ring around it, for the place the disc leaves                                                                                                                                                                                                                                                                     |
| `<set>-data.webp`      | half size; R a smooth depth (rising from a little above the horizon to the bottom, blurred: no step between sky and land), G grass (the meadow, not the dark crowns)                                                                                                                                                                                                                      |
| `src/scene/scene.json` | the disc's box, centre and radius, the glow's reach, the `behind` box, and the glow's **radial profile**: 64 RGB samples of what each ring adds over the clean sky (the median, so clouds do not count), fading to nothing at the reach                                                                                                                                                   |

The two paintings show the same valley but are not aligned pixel to pixel, so each one has its own masks. `--debug DIR` writes the masks, the base, the depth and a recomposite at rest (base + clouds), whose mean error against the painting should stay under 0.005.

**Why one base and not separate sky and land layers** (D-009): two layers that move against each other tear wherever the mask is not perfect — a tree crown split in two, the filled sky showing as a pale outline along the hills. One image warped by a smooth depth cannot tear; only what really moves (clouds, sun, moon) is separate, and it is hidden by the base's own land mask, sampled at the same warped point.

## On the page

- `GhibliBackground` always renders the two static paintings (server HTML, `object-cover`, `object-position: 40% 20%`, `scale(1.04)` around that point) and the CSS gradient towards the page colour. With `live` (the page's background, not the splash's) it adds `LivingSkyGate` **above** that gradient.
- `LivingSkyGate` mounts the scene once the splash is gone and the browser is idle, never with `prefers-reduced-motion` or without WebGL; three.js and R3F load only then (`next/dynamic`, `ssr: false`). An error boundary leaves the static painting on any failure.
- `LivingSky` draws one fullscreen quad (`painting-shader.ts`) and fades in over the static painting after its first frame. At rest it matches the static painting to about 1/255 on average (measured), so the fade cannot be seen. That needs: the same cover fit and zoom, the colours as raw sRGB everywhere (textures `NoColorSpace`, `flat` + `linear` canvas, the page colours as `Vector3`, never `THREE.Color`, which converts to linear and warms the sky), and the page's bottom gradient drawn in the shader (which is also what lets the fireflies glow above it).
- `frameloop="demand"` driven by a ticker: 60 fps on a fine pointer, 30 on phones; DPR at most 1.5 (1.25 on phones). The painting is soft and washed out, more pixels buy nothing.

## The shader

Everything is in image pixels (1536 × 1024). For the day and the night paintings: the base warped by its depth, the sun or moon, then the clouds (both hidden by the land), then mixed by the time of day, washed into the page colour (35% by day, 60% by night, more at golden hour and dusk), the page's bottom gradient, the leaves and the fireflies on top.

- **Parallax**: the base is sampled at `uv + parallax(depth)`, up to 1.1% of the width at the bottom; driven by the pointer, the scroll (0 to 1.5 screens) and the tilt. The 4% zoom is the margin it moves into.
- **The wind** (phase 4, `scene-input.ts`): a breeze that never quite stops, gusts from the scroll's speed (fast in, slow out) and the pointer's own breeze. Its phase accumulates, so a gust speeds the grass waves up without a jump. It pushes the clouds a little (they settle back), carries the fireflies, and ripples the grass around the moving pointer.
- **Leaves**: crossing from one section to the next (at most every 4 s) sends nine leaves across the screen, fluttering, spinning and turning over; by night they are silhouettes. Drawn in screen pixels, after the page's gradient.
- **Clouds** drift back and forth (±4.5% over about four minutes) instead of wrapping: no seam, and they never empty the sky.
- **Sunset** (`uT` 0 → 1 over 4.2 s, ease-in-out sine, reversible mid-way): the sky leans towards a golden-hour gradient, then a dusk one; clouds warm, then turn pink; the land darkens to violet; the night painting fades in, stars twinkle, fireflies light up over the grass.
- **The sun and the moon** (D-011): at rest they are the painting's own, untouched. While they move, the shader subtracts the glow profile where the light was, puts the matched clean sky where the disc and its rim were, and adds the profile where the light is now (orange as the sun sets), plus the moon's disc sprite (its craters). At the first and last instant that is exactly the painting, and the profile fades to nothing at its reach, so there is no ring anywhere. The sun is drawn by the profile alone (its disc is uniform). The painted sun breathes with a soft additive pulse.

## The page follows the sunset

`use-theme-toggle.ts`: with the sky live (`html[data-sky="live"]`) and motion allowed, a click starts the sunset at once (`theme:sweep` event) and turns the icon at once (`data-theme-to`), and sets `.dark` 1.5 s later, when the sky starts to darken. The colour tokens are registered as colours in JS (`register-color-tokens.ts`: the CSS build drops `@property` rules it does not own), so `:root` interpolates them: surfaces over 1.6 s, ink (text) in a quick 0.4 s turn in the middle, when the surfaces cross mid-grey, so text never fades into its background. The dark-mode olive text is tokens too (`--primary-ink*`). While it sweeps, `html[data-sweep]` stops the elements' own transitions. Without the sky, the theme changes at once.

## Limits and decisions

- three.js is pinned to 0.182: R3F 9.8 still uses `THREE.Clock`, which logs a deprecation warning from r183 (D-008).
- iOS asks for permission before it sends the tilt; without it the scene ignores the tilt (no prompt is shown).
- The canvas is fixed behind the whole page; the scroll only moves the layers in depth. Walking down into the valley is phase 5.
