// Checks the static site. Run: node --test scripts/check-site.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const css = readFileSync(path.join(root, "style.css"), "utf8");
const local = (ref) => ref && !/^(https?:|data:|#|\/\/)/.test(ref);
const onDisk = (ref) => existsSync(path.join(root, ref.replace(/^\//, "")));

function section(id) {
  const start = html.indexOf(`id="${id}"`);
  assert.ok(start >= 0, `no element with id ${id}`);
  const open = html.lastIndexOf("<article", start);
  const close = html.indexOf("</article>", start);
  return html.slice(open, close);
}

test("assets resolve", () => {
  const refs = [
    ...[...html.matchAll(/(?:src|href|poster)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/content="(https:\/\/blackmetal\.tech\/assets\/[^"]+)"/g)].map((m) => m[1].replace("https://blackmetal.tech/", "")),
    ...[...html.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]),
  ].filter(local);
  const missing = [...new Set(refs)].filter((r) => !onDisk(r));
  assert.deepEqual(missing, [], `missing files: ${missing.join(", ")}`);
});

test("no unreferenced shots or clips", () => {
  const dir = path.join(root, "assets");
  const files = readdirSync(dir, { recursive: true }).filter((f) => /\.(webp|jpe?g|mp4|png)$/.test(f)).map((f) => `assets/${f}`);
  const orphans = files.filter((f) => !html.includes(f) && !css.includes(f));
  assert.deepEqual(orphans, [], `not used by the page: ${orphans.join(", ")}`);
});

const ORDER = ["gigawatt", "spike", "grid", "equilibrium", "circuits", "loadpath"];
const TIERS = { gigawatt: "stable", spike: "stable", grid: "beta", equilibrium: "beta", circuits: "beta", loadpath: "alpha" };
const VERSIONS = { gigawatt: "0.9.5", spike: "0.5.2", grid: "1.18.1", equilibrium: "0.13.0", circuits: "0.6.0" };

test("six acts in order", () => {
  assert.deepEqual([...html.matchAll(/<article class="act [^"]*" id="([^"]+)"/g)].map((m) => m[1]), ORDER);
});

test("tiers", () => {
  for (const [id, tier] of Object.entries(TIERS)) {
    const act = section(id);
    assert.match(html.slice(html.lastIndexOf("<article", html.indexOf(`id="${id}"`)), html.indexOf(`id="${id}"`)), new RegExp(`tier-${tier}\\b`), `${id} is not ${tier}`);
    assert.equal(act.match(/<p class="tier">([^<]+)</)?.[1].trim().toLowerCase(), tier, `${id} tier text`);
  }
});

test("loadpath has no way in; the others do", () => {
  const words = (id) => [...section(id).matchAll(/<a [^>]*>([^<]+)<\/a>/g)].map((m) => m[1].trim());
  assert.ok(!words("loadpath").some((w) => /^(Play|Download)$/.test(w)));
  for (const id of ORDER.filter((i) => i !== "loadpath")) assert.ok(words(id).includes("Play") && words(id).includes("Download"), `${id} links: ${words(id)}`);
});

test("versions", () => {
  for (const [id, v] of Object.entries(VERSIONS)) assert.match(section(id).match(/<p class="plat">([\s\S]*?)<\/p>/)?.[1] ?? "", new RegExp(v.replaceAll(".", "\\.")), `${id} version`);
});

test("videos are safe", () => {
  const videos = [...html.matchAll(/<video([^>]*)>/g)].map((m) => m[1]);
  assert.equal(videos.length, 4);
  for (const v of videos) {
    for (const a of ["muted", "loop", "playsinline", 'preload="none"', "data-src="]) assert.ok(v.includes(a), `video lacks ${a}`);
    assert.ok(!/\bautoplay\b/.test(v), "video must not autoplay by itself");
    const poster = v.match(/poster="([^"]+)"/)?.[1];
    assert.ok(poster && local(poster) && onDisk(poster), "video needs a poster that exists");
  }
});

test("alt and labels", () => {
  for (const m of html.matchAll(/<img ([^>]*)>/g)) assert.ok(/alt="[^"]+"/.test(m[1]), `img without alt: ${m[1].slice(0, 60)}`);
  for (const m of html.matchAll(/<video ([^>]*)>/g)) assert.ok(/aria-label="[^"]+"/.test(m[1]), "video without aria-label");
});

test("description names six games", () => {
  const d = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
  for (const id of ORDER) assert.ok(d.toLowerCase().includes(id), `description lacks ${id}`);
});

test("css guards", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /outline:\s*(none|0)/);
  assert.match(css, /@media \(max-width: 700px\)/);
  const open = css.indexOf("{", css.indexOf("@media (max-width: 700px)"));
  const phone = css.slice(open, css.indexOf("}\n}", open));
  for (const m of phone.matchAll(/width:\s*(\d+)px/g)) assert.ok(Number(m[1]) <= 360, `phone block sets width ${m[1]}px`);
});
