---
summary: The modernization plan ("the painting comes alive"), phase by phase, with what is done and what is next
read_when: starting any work on the branch feat/living-landscape, choosing the next step, or checking why a phase is shaped the way it is
sources: [src/components/ghibli-background, src/components/splash-screen, src/app/[locale]]
verified: none
---

# Roadmap · the painting comes alive

All of this lives on `feat/living-landscape` (D-002). Nothing reaches `main` until the user has seen the whole result; the user merges it.

## The idea (D-003)

Keep the essence: the painted landscape (hills, trees, fence, clouds), the sun by day and the moon by night, the paper texture, the sepia and olive palette, the 2px borders, the drawn portrait, the three languages.

Go beyond it the way the Ladôme site did with its knit photograph: the painting itself starts to move, and every new visual comes from what is already in it (sky, sun, moon, clouds, hills, grass, trees, fence) or from Gustavo's own interests (astronomy, physics, mechatronics, code). No characters or imagery borrowed from films.

## Phases

Order: 0 → 1 + 2 → 4 → 3 → 5 (D-006). Each phase is one batch the user tests on a phone and on the web before the next starts.

### 0 · Foundation — done, awaiting the user's test

- [x] Next.js 15.2 → 16.4 (`middleware.ts` → `proxy.ts`; `next/root-params` instead of `setRequestLocale`; flat ESLint config from `eslint-config-next`), React 19.3, `framer-motion` → `motion`, husky 9, Node.js 24 (`engines.node: 24.x`, which Vercel follows over the project setting).
- [x] The page renders on the server: the splash used to gate the whole page (about 6.5 s on every visit, with nothing in the HTML). Now the content is in the static HTML, the splash covers it once per browser session and never with reduced motion, and the hero's entrance waits for the splash to leave (`splash-state.ts`).
- [x] `/en`, `/pt`, `/es` are statically generated (SSG).
- [x] The painted background is in the server HTML; the day/night cross-fade runs on the Web Animations API (next-themes disables CSS transitions while switching).
- [x] Removed 35 unused shadcn components, the hook only they used, and about 30 packages only they needed.
- [x] The paper texture is self-hosted (`public/textures/paper.webp`, 59 KB instead of a 324 KB PNG from another site); the unused brushed-metal texture variable is gone.
- [x] Images go through `next/image` with AVIF enabled (the old `quality={100}` is gone; Next 16 only allows 75 by default).
- [x] Zoom is no longer blocked (`user-scalable=no` and the `orientation` meta removed; `viewport` export).
- [x] SEO: metadata per language, canonical and hreflang, Open Graph per language with a generated preview image (JPEG of about 60 KB, small enough for WhatsApp), `sitemap.xml`, `robots.txt`, JSON-LD `Person`.
- [x] The contact route validates with the form's zod schema and creates the Resend client per request (the build no longer fails without `RESEND_API_KEY`).
- [x] The new React Compiler lint rules pass (setState in effects, refs read during render).
- [ ] **Waiting on the user:** the content review (see "Open questions").

### 1 · The living sky (hero)

- Split the painting into layers (sky, far hills, near hills and trees) plus a depth map made once, offline, so it moves in 2.5D with the pointer, the scroll and the phone's gyroscope.
- Clouds drift, the grass ripples, the sun breathes.
- Fallback when WebGL fails, the device is weak, or the visitor asks for reduced motion: today's static painting.
- Art (D-004): the sky and hills are painted images; whatever moves (grass, cloud overlay, stars, fireflies) is procedural.

### 2 · Time passes (the theme toggle)

- The toggle becomes a sunset or a sunrise: the sun goes down behind the hills, the sky turns golden, then magenta, then night; stars appear, the moon rises, fireflies come out over the grass. The UI colours follow.
- Optional: an "now in São Paulo" mode where the sky follows Gustavo's real local time.

### 3 · The real sky (astronomy)

- At night the stars come from a real catalogue (about 5,000 naked-eye stars), placed as they are over São Paulo at the visitor's moment, with the real moon phase.
- Touching a bright star names it; constellations in a thin line.

### 4 · The wind (the thread through the page)

- One wind field moves the grass, clouds, fireflies and leaves.
- Scroll speed is a gust, the pointer a local breeze; between sections a gust carries a few leaves.

### 5 · Every section gets a place

- Scrolling is walking down into the valley: the hero is the sky, the middle the hills, the footer the ground.
- Skills at night become constellations (a category is a constellation, a skill a star, its brightness the level). By day, today's cards.
- Experience: the painting's fence continues down the page as the timeline, one post per job.
- Contact: a mailbox on the fence; a sent message flies off with the wind.
- Splash (D-005): the code box stays, shorter; the code "paints" the scene, a pencil sketch of the landscape that watercolour fills in.

## How the 3D will be built (from the Ladôme scene)

- One fixed `<Canvas>` behind the content; the text stays in the DOM (SEO, accessibility, i18n).
- Orthographic camera, 1 unit = 1 CSS px, `position.y = -scrollY` each frame.
- three.js / R3F load with `next/dynamic` after the first paint and stay out of the LCP.
- Measure the DOM at most every 200 ms per target, never per frame; cap the per-frame clock step at 0.12 s.
- On phones: capped DPR, a scene that does not restart when the browser bar changes the viewport height, paused when the tab is hidden.
- A path rule (`.claude/rules/three.md`) and a scene doc, as in Ladôme.

## Open questions

- Content: is "Tagme · 2023 – Atual" still current? "quase 10 anos" of experience? Should Ladôme Ateliê join the projects as featured work (it is the strongest R3F and shader work, and the portfolio does not show it)?
