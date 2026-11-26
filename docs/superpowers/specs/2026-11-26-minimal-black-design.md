# blackmetal.tech: minimal black

Date: 2026-11-26. Status: chosen by the owner ("A") after rejecting the full-bleed acts as too heavy.

## Intent

The owner wants the site minimal and black. Trust is carried by type, pictures and whitespace, not by effects.

## Goals, non-goals, anti-goals

- Goals: pure black page; each game is a name, its tier, one picture, a few facts and its links.
- Non-goals: animation, glow, fog, gradients, panels over pictures, the painted night and treelines, moving clips.
- Anti-goals: anything that reads as heavy; fancy or sarcastic text; "real X" wording.

## Approaches

1. **A. Pure black (taken):** type and pictures only.
2. **B. Black with the night kept:** logo art and treelines stay. Rejected by the owner's choice.

## The design

- Background `#000`, text `#ece6da`, secondary `#8d8d8d`, hairline rules `#222`. Same two typefaces as before.
- Header: logo, house name, "Burn the textbook", the liner.
- One block per game, in order Gigawatt, Spike, Grid, Equilibrium, Circuits, Loadpath, each separated by a hairline:
  - the name in the display face, left; the tier in small grey capitals, right;
  - one 16:9 picture, the width of the column (about 1000 px);
  - under it two columns: "What you learn" (four lines) and "Platforms" plus the links Play, Download, Wiki, Source.
  - Loadpath has no Play or Download.
- On phones the columns stack.
- 404 and the share image follow (black).

## My calls

- Tiers are plain grey text; colour coding is dropped with everything else.
- One picture per game: the eleven spare stills and the four clips are removed.
- The closing "Still in the forge" line stays and names nothing.
- Pushed to `main` when done, as the owner asked for the last change and dislikes what is live.

## Left to the builder

Sizes and spacing.
