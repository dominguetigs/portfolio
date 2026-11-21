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
- [x] Content: "almost 12 years" of experience; Ladôme Ateliê as the featured project above the tabs, the site first and its panel after (D-007).
- [x] The theme icon no longer depends on the stored theme while rendering (it caused a hydration mismatch once the header was server-rendered); the "more projects on GitHub" link pointed at `undefined`.
- [x] Experience from the user's LinkedIn (2026-11-20): Fintalk (current) to Find, one or more roles per company; data-driven (`src/sections/experience/constants.ts` for dates, places and stacks; words in the messages, English from LinkedIn, Portuguese and Spanish translated).

### 1 + 2 · The living sky and the sunset — done, awaiting the user's test

How it works: `docs/scene.md`.

- [x] The two paintings split offline into sky, clouds, sun or moon, land and a depth/grass map (`scripts/scene/split_painting.py`; D-004: painted layers, procedural motion).
- [x] One fullscreen shader (R3F) brings them back together: layers move in depth with the pointer, the scroll and the phone's tilt; clouds drift; the grass catches the wind; the sun breathes.
- [x] The theme toggle is a sunset (or a sunrise): golden hour, dusk, the sun going down behind the hills, the moon rising, stars, fireflies over the grass; reversible mid-way.
- [x] It fades in over the static painting (identical at rest, measured), only after the splash and when the browser is idle; never with reduced motion or without WebGL; 30 fps on phones.
- [x] Console clean in dev: the splash's head script renders from the server only, next-themes' script is inert when React re-creates it (both were re-created when the root layout remounts on a locale change); the paintings load eagerly as the LCP; three pinned to 0.182 (D-008).
- [x] The splash can no longer trap the page: if React has not started it within 6 s (a script that failed or was blocked), the head script skips it. Found on the phone through the LAN: Next 16 blocks dev resources from origins outside `allowedDevOrigins` (now `192.168.*.*`), so the page never hydrated.
- [x] The page's colours follow the sunset: they start to change when the sky darkens and arrive with it; text turns quickly in the middle so it stays readable (`docs/scene.md` › The page follows the sunset).
- [x] The painting no longer tears under parallax: one base warped by a smooth depth instead of separate sky and land layers (D-009); found by the user (a split tree crown, pale outlines along the hills).
- Not done: the "now in São Paulo" mode (optional in the plan).

### 3 · The real sky (astronomy)

- At night the stars come from a real catalogue (about 5,000 naked-eye stars), placed as they are over São Paulo at the visitor's moment, with the real moon phase.
- Touching a bright star names it; constellations in a thin line.

### 4 · The wind — done, awaiting the user's test

- [x] One wind for the scene: a breeze that never stops, gusts from the scroll's speed, the pointer's own breeze; it combs the grass, pushes the clouds a little and carries the fireflies.
- [x] From one section to the next, a gust carries a few leaves across the screen.

### 5 · Every section gets a place

- Scrolling is walking down into the valley: the hero is the sky, the middle the hills, the footer the ground.
- Skills at night become constellations (a category is a constellation, a skill a star, its brightness the level). By day, today's cards.
- Experience: the painting's fence continues down the page as the timeline, one post per job.
- Contact: a mailbox on the fence; a sent message flies off with the wind.
- Splash (D-005): the code box stays, shorter; the code "paints" the scene, a pencil sketch of the landscape that watercolour fills in.

## How the 3D is built

See `docs/scene.md` and `.claude/rules/scene.md`. From the Ladôme scene, still to come with phase 5: content-aligned geometry (orthographic camera, 1 unit = 1 CSS px, `position.y = -scrollY`), DOM measured at most every 200 ms per target, a scene that does not restart when the phone's browser bar changes the viewport height.

## Open questions

- "Almost 12 years" (LinkedIn starts in January 2015), "for now", the user said on 2026-11-21.
- The résumé PDFs in `public/cv` stop at Tagme.
