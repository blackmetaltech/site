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
