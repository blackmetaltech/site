# Full-bleed acts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn each game card on blackmetal.tech into a full-bleed act with a moving picture, a tier label and a Play panel, and add a Loadpath alpha card.

**Architecture:** Still one static page (`index.html`) and one stylesheet (`style.css`), no build step. One small Node script (`scripts/check-site.mjs`, no dependencies, run by `node --test`) reads the HTML and fails on broken references, missing tiers or missing accessibility attributes. Clips are H.264 MP4 cut with ffmpeg from each game's own GIFs.

**Tech Stack:** HTML, CSS, MP4/WebP, Node `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-25-full-bleed-acts-design.md`

## Global Constraints

- Static files only; deployed by `.github/workflows/pages.yml` (it copies `index.html 404.html style.css favicon.svg robots.txt sitemap.xml CNAME assets`; `scripts/` and `docs/` are not deployed, which is correct).
- Order of acts: Gigawatt, Spike, Grid, Equilibrium, Circuits, Loadpath.
- Tiers: Gigawatt and Spike stable; Grid, Equilibrium, Circuits beta; Loadpath alpha.
- Tier colours: stable `#9fe3b4`, beta `#8fd3f0`, alpha `#f0b56a`.
- Clips: 960 px wide, 15 fps, 8 s, no sound, each under 250 KB. Autoplay, muted, loop, lazy; still shot as poster; not played under `prefers-reduced-motion: reduce`.
- Loadpath has no Play and no Download link.
- Text: short, plain, straight. No "real X" wording. No "COBANANA".
- Gigawatt links stay `http://`.
- Versions shown: Gigawatt 0.9.5, Spike 0.5.2, Grid 1.18.1, Equilibrium 0.13.0, Circuits 0.6.0.

## Review Focus

- A phone about 390 px wide: the title, pitch and panel must fit without horizontal scroll and text must stay readable over the picture. (Task 2 test: no fixed width above 360 px in the phone media block; Task 4 screenshot.)
- A browser that refuses autoplay or a video that fails to load: the poster still shows and the links still work. (Task 2 test: every `video` has a `poster` whose file exists.)
- Reduced motion: nothing loops. (Task 2 test: stylesheet contains a reduced-motion rule that pauses video.)
- Keyboard use: every link is reachable and has a visible focus ring. (Task 2 test: no link has `outline: none` in the stylesheet.)
- A still image referenced but missing from disk gives a blank act. (Task 1 test: every `src`, `poster` and CSS `url()` resolves to a file.)

---

### Task 1: Media

**Files:**
- Create: `assets/clips/{grid,blackout...}.mp4` and posters in `assets/shots/`
- Create: `scripts/check-site.mjs`
- Delete: unreferenced files in `assets/shots/`

**Interfaces:**
- Produces: `scripts/check-site.mjs`, runnable as `node --test scripts/check-site.mjs`; it reads `index.html` and `style.css` from the repo root.

- [ ] **Step 1: Write the failing test** in `scripts/check-site.mjs`: `assets resolve` (every `src=`, `poster=` and `url("...")` in `index.html` and `style.css` points to an existing file, skipping `http` and `data:`), and `no unreferenced shots` (every file in `assets/shots/` is referenced).
- [ ] **Step 2: Run** `node --test scripts/check-site.mjs`. Expected: FAIL on unreferenced shots (seven of them today).
- [ ] **Step 3:** Cut clips with ffmpeg from `cobanana/grid/site/assets/shots/blackout.gif`, `cobanana/equilibrium/site/assets/shots/night-trip.gif`, `cobanana/circuits/docs/readme/wb-measure-2-1.gif` using the Global Constraints values. Look for a Gigawatt, Spike or Loadpath clip under `/home/ixaxaar/src/ai-factory` and the game repos; use the still where none exists.
- [ ] **Step 4:** Delete the unreferenced shots: `grid-city`, `grid-finale`, `grid-mill-3d`, `grid-river`, `grid-street-3d`, `grid-towers-3d`, `equilibrium-hall`.
- [ ] **Step 5: Run** the test. Expected: `assets resolve` PASS, `no unreferenced shots` PASS once Task 2 references the new posters (until then it fails only on the new posters).
- [ ] **Step 6: Commit** `media: clips and posters for the acts; drop unused shots`.

### Task 2: The acts

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- HTML shape per act: `<article class="act <game> tier-<stable|beta|alpha>" id="<game>">` containing `h2.name`, `p.tier`, `p.pitch`, `video.act-clip`, `aside.panel` (with `h3` "What you learn", `ul.learn`, `p.plat`, `p.links`), `div.more` with two stills.
- CSS: `.act` full-bleed; `--glow` per game kept as today; `--tier` per tier class.

- [ ] **Step 1: Add failing tests** to `scripts/check-site.mjs`:
  - `six acts in order`: ids equal `["gigawatt","spike","grid","equilibrium","circuits","loadpath"]`.
  - `tiers`: class contains `tier-stable` for gigawatt and spike, `tier-beta` for grid, equilibrium, circuits, `tier-alpha` for loadpath; each act's `.tier` text is the tier name.
  - `loadpath has no way in`: no link whose text is `Play` or `Download` inside `#loadpath`; every other act has both.
  - `versions`: each act's `.plat` contains its version from the Global Constraints.
  - `videos are safe`: every `video` has `muted`, `loop`, `playsinline`, `preload="none"`, `poster`, and no `autoplay` attribute (playback is started by script only when no reduced motion).
  - `alt and labels`: every `img` has a non-empty `alt`.
  - `description names six games`: the meta description contains all six names, case-insensitive.
  - `css guards`: `style.css` has a `prefers-reduced-motion: reduce` block, no `outline: none` or `outline:0`, and a `@media (max-width: 700px)` block.
- [ ] **Step 2: Run** `node --test scripts/check-site.mjs`. Expected: the new tests FAIL.
- [ ] **Step 3:** Rewrite the six cards in `index.html` to the act shape. Add an inline script (about 6 lines) after `</main>`: for each `video`, if `matchMedia("(prefers-reduced-motion: reduce)")` is false, set `src` from `data-src` on an IntersectionObserver and call `play()`. Update the meta description. Update the liner to "An AI factory for engineering games."
- [ ] **Step 4:** Replace the `.game` rules in `style.css` with `.act` rules: picture about `62vh` tall (`min-height: 380px`) on desktop, gradients top and bottom, title block top centre, panel left at `clamp(20px, 5vw, 70px)`, `.more` under the picture inside the act width. In the `700px` block: panel becomes a full-width block under the picture, `.more` two columns, no fixed width above `360px`. Keep `.treeline`, tinted with `rgba(var(--glow), .14)`.
- [ ] **Step 5: Run** `node --test scripts/check-site.mjs`. Expected: all PASS.
- [ ] **Step 6: Commit** `Acts: every game is a full-bleed act with its tier and a moving picture`.

### Task 3: Share image and 404

**Files:**
- Modify: `assets/og.jpg` (regenerate with ImageMagick: logo, house name, headline, six stills with names)
- Modify: `404.html` (liner and link follow the new panel style)

- [ ] **Step 1:** Compose `assets/og.jpg` at 1200x630 from `assets/night-1600.webp`, the logo SVG and the six main stills; read the result back and check the text is legible.
- [ ] **Step 2:** Update `404.html` so its link matches `.panel .links`.
- [ ] **Step 3: Run** `node --test scripts/check-site.mjs`. Expected: all PASS.
- [ ] **Step 4: Commit** `Share image shows six games; 404 follows`.

### Task 4: Look, then ship

- [ ] **Step 1:** Serve locally (`python3 -m http.server`), take full-page screenshots at 1440x900 and 390x844, read them, and fix what looks wrong (contrast, cropping, overlap).
- [ ] **Step 2:** Run `node --test scripts/check-site.mjs`. Expected: all PASS.
- [ ] **Step 3: Commit** fixes.
- [ ] **Step 4:** Merge `full-bleed-acts` into `main` and push `origin main` (the owner asked for a push when done). GitHub Pages deploys from `main`.
