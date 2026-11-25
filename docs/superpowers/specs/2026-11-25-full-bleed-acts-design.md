# blackmetal.tech: full-bleed acts

Date: 2026-11-25. Status: waiting for the owner's approval.

## Intent

The site is the front window of an AI factory for engineering games. A visitor should see at once which
games are ready to play, want to try one, and get a peek at what is coming. The owner chose the current
page structure (logo over the painted night, one card per game down the page, a treeline between cards) and
asked for the work to go into look and feel: fancy and unique, so people try the games.

## Goals, non-goals, anti-goals

- Goals: every game card is a full-bleed act with a moving picture and a clear way in; each card says its
  tier; the pipeline is visible.
- Non-goals: new pages, a blog, analytics, a build step. Still one static page, GitHub Pages, no cookies.
- Anti-goals: text that is fancy or sarcastic; "real X" wording; anything that reads as a SaaS site;
  changing the structure the owner kept.

## Tiers

| Tier | Games |
|---|---|
| Stable | Gigawatt, Spike |
| Beta | Grid, Equilibrium, Circuits |
| Alpha | Loadpath (in development, no download) |

The stable tier is the owner's call (they play, they are public). Lenscraft and the ideas are not on the
site; the closing "Still in the forge" line stays and names nothing.

## Approaches

1. **Living night** (chosen look, not taken alone): keep the plates, add twinkle, lantern, fog, sheen.
   Calm, no structural change. Owner did not pick it.
2. **Full-bleed act** (taken): the picture runs edge to edge, title over it, a panel on the left with the
   way in. Loudest, most "click me". Widens the card.
3. **Etched gatefold**: record-sleeve frame, serif facts, film grain. Quietest.

Trade-off accepted with 2: the card is wider than before and the page is longer on a phone. Borrowed from
the other two: the fog in the game's colour and the plate treatment where they do not change the structure.

## The design

**Top of the page.** Unchanged: logo, house name, "Burn the textbook", the liner. The liner becomes the
factory line ("An AI factory for engineering games"). My call.

**One act per game**, in this order: Gigawatt, Spike (stable), Grid, Equilibrium, Circuits (beta), Loadpath
(alpha). Each act:

- Moving picture, edge to edge, about 60 to 65 vh tall on desktop. Falls back to the still shot.
- Over the picture, top centre: tier label with its colour dot (stable green, beta blue, alpha amber),
  the game's name in the display face with its glow, the pitch line.
- Left, over the picture: a dark panel with the game's colour on its edge. It holds "What you learn",
  platforms and version, then the links: Play, Download, Wiki, Source. Loadpath has no Play or Download.
- Under the picture, inside the act's width: two smaller stills and the "Source on GitHub" line.
- Dark gradients top and bottom so text reads, and so the picture fades into the night.
- The treeline stays between acts, tinted by the game's colour above it.

**Phones (700 px and less).** The act stacks: title over the picture, then the panel as a plain block
under it, then the two stills side by side. My call.

**Moving pictures.** Short clips cut from each game's own GIFs: H.264 MP4, 960 px wide, 15 fps, 8 s, no
sound, each under about 250 KB (the three cut so far are 50 to 150 KB). Autoplay, muted, loop, lazy; the
still shot is the poster. With "reduce motion" on, the clip does not play. My call. Clips exist for Grid,
Equilibrium and Circuits; for Gigawatt, Spike and Loadpath the builder checks for a clip and otherwise
uses the still.

**Housekeeping in the same change.** Search description names all six games; the share image shows six
games with current shots; Spike shows 0.5.2; unused screenshots are removed; the 404 page follows.

## Constraints

- Static files only, deployed by the existing GitHub Pages workflow.
- Owner rules from the factory: short, plain, straight text; no "real X" wording; no COBANANA.
- Gigawatt's subdomain serves HTTP only. Its links stay HTTP until the owner fixes DNS (factory decision 5).
- Fonts from Google Fonts, as now.

## Left to the builder

- Exact sizes, gradients and timings, as long as text contrast holds and the picture stays the hero.
- Which frame of each clip is the poster.
- Whether the treelines need a new crop once cards are full-bleed.

## Out of scope

HTTPS for Gigawatt, versions of games beyond what is live today, and any change on the game sites.
