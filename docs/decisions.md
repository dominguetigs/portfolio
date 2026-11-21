---
summary: Why things are the way they are, with a status per decision
read_when: before proposing a visual, UX or tooling change; when the user decides something
sources: []
verified: none
---

# Decisions

Each heading carries an ID and a status: `[final]`, `[hypothesis]`, `[pending]`, `[rejected]`, `[superseded by D-xxx]`. Never contradict a `[final]` decision or bring back a `[rejected]` one without asking. New decisions go at the end.

### D-001 · Cartog for code navigation, on trial [hypothesis]

`2026-11-20` · source: the user ("igual fiz no repo ladome")

**Decision:** `.cartog.toml` at the root lets the cartog plugin index the repo (code graph plus semantic search, local models); agents query it before reading whole files.
**Confirms when:** together with Ladôme's D-003 (around 2026-11-23), `cartog savings` shows it is used and saves reading. Otherwise delete `.cartog.toml` and `.cartog/` here too.
**Limits:** it parses neither CSS nor JSON (grep `globals.css` and `messages/*.json`).

### D-002 · The modernization lives on its own branch [final]

`2026-11-20` · source: the user

**Decision:** all of the roadmap happens on `feat/living-landscape`, branched from `main`. Nothing goes to production until the user has seen the final result; if they like it, they merge it into `main` themselves.
**See:** `docs/roadmap.md`.

### D-003 · "The painting comes alive", keeping the essence [final]

`2026-11-20` · source: proposal accepted by the user

**Decision:** keep the painted landscape, the day/night theme, the paper texture, the palette, the 2px borders, the drawn portrait and the three languages. New visuals (R3F and shaders) come from what is already in the painting or from Gustavo's interests (astronomy, physics, mechatronics, code); no characters or imagery borrowed from films.
**See:** `docs/roadmap.md` › The idea.

### D-004 · Hybrid art: painted layers, procedural motion [final]

`2026-11-20` · source: proposal accepted by the user

**Decision:** the sky and the hills are painted images split into layers (with a depth map); whatever moves (grass, cloud overlay, stars, fireflies, leaves) is procedural.
**Why:** in Ladôme a fully procedural render did not come close to the photographed knit; a painterly style forgives more, but the painting is the identity.

### D-005 · The splash keeps the code, and the code paints the scene [final]

`2026-11-20` · source: proposal accepted by the user

**Decision:** the code box stays (it is the developer's signature), shorter. In phase 5 it "paints" the scene: a pencil sketch of the landscape that watercolour fills in. Since phase 0 it shows once per browser session, over a page that is already rendered, and never with reduced motion.

### D-006 · Phase order and batches [final]

`2026-11-20` · source: proposal accepted by the user

**Decision:** 0 (foundation) → 1 + 2 (living sky, sunset toggle) → 4 (wind) → 3 (real sky) → 5 (sections). Each phase is one batch the user tests on a phone and on the web before the next starts.

### D-007 · Ladôme is the featured project, the site first [final]

`2026-11-20` · source: the user

**Decision:** Ladôme Ateliê (site and panel) is the latest work and opens the projects section, above the tabs, with the site as the protagonist: its cover in a browser frame (with the phone view; the rest is on the site itself, 2026-11-21, the user), its four highlights, then the panel in a smaller card. The panel shows only its sign-in screen, since it is behind a login.
**Images:** screenshots of the public site taken read-only; none shows a person (the founder's portrait and customers' photos are left out).
**See:** `src/sections/projects/featured-project.tsx`, `public/projects/ladome/`.

### D-008 · three.js pinned to 0.182 [final]

`2026-11-20` · source: found while building phase 1

**Decision:** `three` and `@types/three` stay at 0.182.0.
**Why:** React Three Fiber 9.8 (the latest) still creates a `THREE.Clock`, which logs a deprecation warning on every load from three r183. Nothing the scene uses needs a newer three.
**Revisit when:** a React Three Fiber release moves to `THREE.Timer`.

### D-009 · One warped base, not separate sky and land layers [final]

`2026-11-21` · source: the user's report (a split tree crown, pale outlines on the hills)

**Decision:** the scene draws the painting as one image (its clouds and sun or moon taken out) warped by a smooth depth; only the clouds and the sun or moon are separate, hidden by the base's land mask at the same warped point.
**Why:** separate sky and land layers moving against each other tear wherever the mask is imperfect; a single image under a smooth warp cannot.
**Rejected:** more, finer layers (more edges to tear).

### D-010 · The page's colours follow the sunset [final]

`2026-11-21` · source: the user ("da melhor forma possível")

**Decision:** with the living sky on, the theme toggle starts the sky at once, the icon at once, and the page's colours when the sky starts to darken; surfaces glide, text turns quickly in the middle. Without the sky, the theme switches at once.
**See:** `docs/scene.md` › The page follows the sunset.

### D-011 · The sun and the moon stay painted at rest [final]

`2026-11-21` · source: the user ("esse círculo luminoso em volta da lua e do sol ... nada natural", also during the switch)

**Decision:** at rest the sun and the moon are the painting's own. Only while they move does the scene take them out and draw them again, with the glow as a radial profile measured from the painting (subtracted where the light was, added where it is) and the moon's disc as a sprite.
**Rejected:** cutting the light and its glow out as a sprite against a reconstructed sky (a ring wherever the reconstruction and the painting disagree), and clouds drifting through a glow (holes in it).

### D-012 · One set of clouds for the day and the night [final]

`2026-11-21` · source: the user ("parece que as nuvens diferem quando é noite e quando é dia, não deveria"; "as estrelas também não deveriam piscar sobre as nuvens")

**Decision:** the day's clouds are the only clouds. The night painting loses its own (its sky becomes a smooth fit of the painted one) and shows the day's, relit; the static night painting (`public/bg-night.webp`) is baked the same way. The stars sit behind the clouds.
**Rejected:** cross-fading two paintings with different clouds (the clouds visibly change shape during the switch).

### D-013 · The night painting looks south, at the real sky [final]

`2026-11-21` · source: phase 3 of the roadmap, accepted by the user

**Decision:** the night painting shows the real sky over São Paulo at the visitor's moment, looking due south from the horizon to about 59° up: the circumpolar southern sky (the Southern Cross, the Pointers, Canopus, Achernar, the Magellanic Clouds) is always there, turning around the pole. The moon keeps its painted place, with its real phase. Star and constellation data from d3-celestial (BSD-3-Clause); the Milky Way is modelled.
**Why south:** the painting's sky is only ~59° tall; any other direction would often show little that is recognisable, while the south always holds the Cross's sky (and the Cross is on the Brazilian flag).
**Rejected:** placing the moon at its real position (the painting is composed around it).

### D-014 · One landscape, relit by the hour [final]

`2026-11-21` · source: the user ("até as árvores do cenário estão diferentes no dia e na noite, gostaria que tudo fosse idêntico"; "gosto mais da paisagem que estava de dia")

**Decision:** the day painting is the only landscape. The night keeps from its painting only the sky (a smooth gradient), the moon, and its colours: the day's land is relit by a lookup from the day land's brightness to the night land's colour, and the day's clouds by colours from the night's clouds. Everything in between follows the sun's elevation (golden hour, sunset, civil and nautical twilight): the sky is replaced by a twilight gradient warm towards the sun, the clouds are lit pink from below, then grey, the land goes into shade, then the blue hour, then moonlight; the brightest stars come out first.
**The land's edge** is found as what departs from the clear sky filled in behind it (not "everything below each column's first land", which stepped into blocks between the treetops and missed the far tree lines).
**Rejected:** cross-fading two paintings of different landscapes.

### D-015 · The static night painting in the moon's phase [final]

`2026-11-21` · source: the user ("a lua entrar cheia fica estranho")

**Decision:** the static night painting is baked in 24 phases (`public/night/night-NN.webp`); an inline head script picks today's before the first paint, and the live scene draws the same rounded phase, so it fades in over an identical moon. The phase is shown to about a day.

### D-016 · The splash ends by tearing open [final]

`2026-11-21` · source: the user ("É possível fazer uma revelação da tela com esse rasgado parecido com esse site: summer-afternoon.vlucendo.com"), accepted after their look at it

**Decision:** when the code box has run, it fades and the splash's paper tears open from the centre over 1.5 s, the page already waking under it (`paper-tear.ts`). The hole is a level set of a noise field fixed on the screen (`|p - c| + roughness(p) < R`), so its ragged edge keeps a paper's scale as it grows; it runs faster along a few random directions and differs on every visit. It is cut out of the paper with `clip-path: path()`; a canvas over it draws the pale band of exposed fibres, loose fibres reaching into the hole and the paper's soft shadow on the page. Without `clip-path: path()` the splash fades as before. The living sky waits until the paper is gone (`useSplashGone`): loading three.js during the tear would stall it.
**Rejected:** a WebGL reveal (three.js is not loaded yet, and must not be before the page shows); a fixed torn shape scaled up (its edge would coarsen as it grows).

### D-017 · The sun and the moon move as light added to the sky [final]

`2026-11-21` · source: the user ("a lua quando começa a subir atrás da montanha, fica nítido a sombra em volta dela"; "o mais real possível")

**Decision:** while they move, the sun and the moon are what the painted light adds over the clean sky (disc and glow), added to the sky of that moment, not a cut-out disc laid over it. The moon comes up from behind the hills gold and whitens as it climbs; the sun keeps its disc down to the hills (it touches them at about +4° and is gone just after 0°), turning orange and flattening a little. At rest both are the painting, untouched (live and static still match).
**Why:** a cut-out carries the night sky it was painted on, so over the brighter twilight its edge showed as a dark ring; the sun drawn by its glow alone lost its disc as soon as it moved.
**Rejected:** a cut-out with a softer edge (the ring only blurs); moving the sun at the painting's own pace (its disc, about 7° across here, would still show in the blue hour).
