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

**Decision:** Ladôme Ateliê (site and panel) is the latest work and opens the projects section, above the tabs, with the site as the protagonist: a browser-framed gallery of the real site (cover, the 3D thread, the globe, the atelier's hook), its four highlights, then the panel in a smaller card. The panel shows only its sign-in screen, since it is behind a login.
**Images:** screenshots of the public site taken read-only; none shows a person (the founder's portrait and customers' photos are left out).
**See:** `src/sections/projects/featured-project.tsx`, `public/projects/ladome/`.
