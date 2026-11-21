# Portfolio

Gustavo Domingueti's personal portfolio (gustavodomingueti.com.br): a one-page Next.js App Router site in three languages, with a Ghibli-style painted landscape that turns from day to night with the theme.

- `src/app/[locale]` — the only page (statically generated per locale), its metadata and the Open Graph image. `src/app/api/contact` sends the contact form through Resend; `src/app/sitemap.ts` and `robots.ts` sit at the root.
- `src/sections/<section>` — one folder per section (hero, about, skills, projects, experience, education, languages, contact), each with its components, `constants`, `animations` and `types`.
- `src/components` — shared pieces (header, nav menu, footer, splash screen, the painted background, theme and language switchers). `src/components/ui` keeps only the shadcn/ui components in use.
- `messages/{pt,en,es}.json` — every piece of copy, through next-intl; `src/i18n` holds the routing; `src/proxy.ts` redirects to a locale.
- `src/scene` — the living painting (React Three Fiber, one shader) over the static paintings; its layers come from `scripts/scene/split_painting.py` into `src/scene/assets/`.
- `src/app/globals.css` — the theme tokens (light and `.dark`), the paper texture, the dark-mode contrast overrides and the splash rules.

Stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, `motion`, three.js + React Three Fiber (`src/scene` only, loaded lazily), next-intl (`next/root-params`), next-themes, react-hook-form + zod, Resend. Deployed on Vercel.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npx tsc --noEmit     # typecheck
npm run build
node scripts/cv/build.mjs   # the résumés in public/cv, from the same data as the site (Google Chrome, headless)
```

No test runner: a change is checked with lint, typecheck, build and a browser pass at 390px and 1440px, in light and dark, in at least two locales. The splash shows once per browser session: test it in a fresh context, and test everything else with `sessionStorage['splash-seen'] = '1'`.

## Working rules

- Talk to the user in Brazilian Portuguese. Code, comments, docs and commit messages are in English. Copy lives in `messages/*.json`: a new key goes into all three files.
- Commit only when the user says so (`../CLAUDE.md`). Messages follow Conventional Commits (commitlint enforces the type and a lower-case subject); husky runs lint-staged on commit.
- This is Next.js 16: its APIs differ from older versions. The docs ship in `node_modules/next/dist/docs/`; read the relevant guide before writing Next.js code, and heed deprecation notices.

## Where the context lives

- `docs/roadmap.md` — the modernization plan ("the painting comes alive"), phase by phase, with what is done. Read it before any work on `feat/living-landscape`.
- `docs/scene.md` — how the living painting works (layers, shader, sunset, fallback). `.claude/rules/scene.md` loads with its files.
- `docs/decisions.md` — why things are so, with a status per decision. Never contradict a `[final]` one without asking; record what the user decides there, in the same piece of work.

## Navigating the code

- Cartog first for TS/TSX: `cartog_outline` / `cartog_map` instead of reading whole files, `cartog_refs` / `cartog_impact` before changing anything shared from `src/components`, `src/hooks` or `src/utils`, `cartog_changes` for what moved since the last commit, `cartog_rag_search` to find code by concept (kind `document` for `docs/`).
- Cartog does not parse CSS or JSON. Use grep for `src/app/globals.css` (tokens, texture, dark-mode overrides) and for `messages/*.json`.
