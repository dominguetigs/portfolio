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

Phases 1 to 4 of `docs/roadmap.md`: the painted landscape breathes (clouds drift, the grass catches the wind, the sun breathes, layers move in depth with the pointer, the scroll and the phone's tilt), and the theme toggle is a sunset or a sunrise.

## From painting to layers (offline)

`scripts/scene/split_painting.py` (numpy, pillow, scipy; about a minute and a half) takes each painting — `public/bg-light.png` (day) and `public/bg-dark.png` (night) — into `src/scene/assets/` (imported, so the build names each file by its content hash and no browser or CDN mixes an old layer with a new one):

| File                                       | What                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<set>-base.webp`                          | the day: the painting itself, sun included, with only its drifting clouds taken out (the sky behind them filled from the clear sky around, by normalized convolution). The night: no clouds of its own (D-012) — a smooth fit of its painted sky (the painting kept only in a band just above the horizon, for the treetops), the moon's glow and disc, its land. Alpha = land. **Saved with `exact`**: without it the WebP encoder throws away the colour under transparent pixels, which here is the whole sky. |
| `day-clouds.webp`, `day-clouds-still.webp` | **the only clouds, day and night** (D-012): the ones that drift (RGBA, 75% size, matted against the clean sky) and the ones that stay (those touching the sun's glow; in the day's base by day, drawn relit by night). Found with a top-hat (a grey opening wider than any cloud). Whole clouds only: one that reaches the horizon band stays in the base, and specks stay too, so no cloud is cut in two and the horizon haze never drifts.                                                                      |
| `<set>-light.webp`                         | the moon's (or sun's) disc as a sprite, drawn only while it moves                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `<set>-behind.webp`                        | the clean sky behind the disc and its rim, matched in brightness to the ring around it, for the place the disc leaves                                                                                                                                                                                                                                                                                                                                                                                             |
| `<set>-data.webp`                          | half size; R a smooth depth (rising from a little above the horizon to the bottom, blurred: no step between sky and land), G grass (the meadow, not the dark crowns)                                                                                                                                                                                                                                                                                                                                              |
| `public/bg-night.webp`                     | the static night painting: the night's base with the day's clouds relit, baked with the shader's own formula, so the canvas still fades in over an identical picture (`public/bg-dark.png` is its source)                                                                                                                                                                                                                                                                                                         |
| `src/scene/scene.json`                     | the disc's box, centre and radius, the glow's reach, the `behind` box, and `nightClouds` (how the day's clouds look by night: body and edge colours measured from the night painting's own clouds, the day clouds' brightness range, the moon's silver, the alpha), and the glow's **radial profile**: 64 RGB samples of what each ring adds over the clean sky (the median, so clouds do not count), fading to nothing at the reach                                                                              |

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
- **One set of clouds** (D-012): the clouds are drawn after the day and night paintings are mixed, the same shapes in the same places; only their light changes (white, golden, pink, then night blue with a silver edge towards the moon). The stars are drawn before them and masked by their coverage, so they never shine through a cloud; the moon passes behind them.
- **Sunset** (superseded by the section on one landscape, below; `uT` 0 → 1 over 6 s, ease-in-out sine, reversible mid-way): the sky leans towards a golden-hour gradient, then a dusk one; clouds warm, then turn pink; the land darkens to violet; the night painting fades in, stars twinkle, fireflies light up over the grass.
- **The sun and the moon** (D-011): at rest they are the painting's own, untouched. While they move, the shader subtracts the glow profile where the light was, puts the matched clean sky where the disc and its rim were, and adds the profile where the light is now (orange as the sun sets), plus the moon's disc sprite (its craters). At the first and last instant that is exactly the painting, and the profile fades to nothing at its reach, so there is no ring anywhere. The sun is drawn by the profile alone (its disc is uniform). The painted sun breathes with a soft additive pulse.

## One landscape, relit by the hour (D-014)

The day painting is the only landscape. `uT` (the toggle's progress over 6 s) drives the sun's elevation: 35° → 10° quickly, then 10° → −16° slowly, so golden hour, sunset (0°), civil (−6°) and nautical (−12°) twilight each get their time; a sunrise is the same evening backwards. From the elevation:

- **Sky:** the painted sky (its clouds taken out into layers) gives way, from 14° down, to a twilight gradient (`twilightColors`: horizon, middle, top, from photographs of clear evenings), warmer towards the sun; from −6° the night's sky (`night-sky.webp`: the night painting's sky as a smooth gradient, its moon and glow) takes over.
- **Sun:** moves down to the horizon at 0° and behind the hills, whiter high and orange low, with an aureole that grows near the horizon.
- **Clouds** (`cloudLight`): warm in golden hour, lit pink from below at sunset, grey as the light leaves them, then the night's colours. The same shapes all the time.
- **Land:** warm, then in shade once the sun touches the hills, then the blue hour (dark, flat, cool), then moonlight: `nightLand`, a lookup (scene.json `nightLand`, 64 samples) from the day land's brightness to the night painting's land colour, matched by quantiles.
- **Moon:** rises with the dusk, already pale in the twilight; stars come out by brightness from −4°; the Milky Way and constellations from −9°; fireflies from −8°.
- **Land edge:** `land_from_sky` in the art script: what departs from the clear sky (filled in behind the land from sure-sky pixels: bright and blue) is land, with a soft edge that follows every crown and the far tree lines.

## The real sky (phase 3)

The night painting shows the sky over São Paulo as it is at the visitor's moment, looking **south** (D-013): from the horizon (y ≈ 734) to about 59° up, about 115° across, in a stereographic projection centred due south and tilted 30° up (`sky-model.ts`). Everything in the frame lies within ~65° of the south celestial pole, which sits fixed at (768, 385): the Southern Cross, the Pointers (Rigil Kentaurus and Hadar), Canopus, Achernar, Carina and the Magellanic Clouds, turning around the pole in real time. (In November evenings the Cross is below the horizon and rises before dawn; in May evenings it is at the top of the frame.)

- **Data** (`scripts/scene/build_sky.py` → `src/scene/sky.json`, 84 KB): 1,582 stars to magnitude 5.8 south of declination −18°, with colour from B−V; the IAU names of the 67 brightest; the constellation lines; constellation names in pt (hand-written in the script), en and es. From the d3-celestial package's data (BSD-3-Clause, © 2015 Olaf Frohn; XHIP stars, IAU names and lines), downloaded to a scratch folder when the data must be rebuilt, not kept in the repo.
- **Milky Way** (`src/scene/assets/milkyway.webp`): modelled along the galactic plane (wider and brighter towards Sagittarius and through Carina–Crux–Centaurus, the Coalsack and the Great Rift dark, clumped by noise) plus the two Magellanic Clouds, as an RA/Dec map; the shader turns each pixel back into the sky (inverse stereographic, `uSkyFrame`) to sample it.
- **Stars and lines** are drawn on 2D canvases in painting pixels (`sky-layers.ts`) and redrawn every 20 s (the sky turns about 3.5 px a minute); the shader samples them where the night painting is, so they sit behind the land and the clouds, are hidden by the moon's disc and washed out near it, twinkle with a slow noise (one phase per star), and are added **after** the painting is washed into the page (washed, they would all but disappear).
- **The moon** stays where it is painted, with its real phase, rounded to one of 24 (D-015: the static night painting is baked in each and picked before the first paint): the terminator on the disc (seen from the southern hemisphere, a waxing moon is lit on the left), the unlit side the sky behind plus the air's glow (the glow is in front of the disc, so a dark limb has no bright edge), the glow scaled by the lit fraction.
- **Names** (`sky-labels.tsx`): at night, pointing at a bright star (or touching it, for 4 s) shows its name and its constellation, whose lines are picked out; pointing at the moon shows its phase and lit fraction (`Index.Sky` in the messages). Never over the page's text or controls.
- Accuracy: J2000 positions without precession (~0.4° by 2026), mean sidereal time, the mean lunar month (phase within about half a day). Checked against known events: the pole at 23.6°, the Cross below the horizon on a November evening and at 50° on a May one, the full moon of 2026-11-24 and the new moon of 2026-12-09.

## The page follows the sunset

`use-theme-toggle.ts`: with the sky live (`html[data-sky="live"]`) and motion allowed, a click starts the sunset at once (`theme:sweep` event) and turns the icon at once (`data-theme-to`), and sets `.dark` 1.5 s later, when the sky starts to darken. The colour tokens are registered as colours in JS (`register-color-tokens.ts`: the CSS build drops `@property` rules it does not own), so `:root` interpolates them: surfaces over 1.6 s, ink (text) in a quick 0.4 s turn in the middle, when the surfaces cross mid-grey, so text never fades into its background. The dark-mode olive text is tokens too (`--primary-ink*`). While it sweeps, `html[data-sweep]` stops the elements' own transitions. Without the sky, the theme changes at once.

## Limits and decisions

- three.js is pinned to 0.182: R3F 9.8 still uses `THREE.Clock`, which logs a deprecation warning from r183 (D-008).
- iOS asks for permission before it sends the tilt; without it the scene ignores the tilt (no prompt is shown).
- The canvas is fixed behind the whole page; the scroll only moves the layers in depth. Walking down into the valley is phase 5.
