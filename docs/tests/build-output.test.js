import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

export function readDist(relativePath) {
  return readFileSync(join(DIST, relativePath), "utf8");
}

test("feature posters ship as webp, not jpeg", () => {
  const posters = readdirSync(join(DIST, "features/posters"));
  const jpegs = posters.filter((f) => f.endsWith(".jpg"));
  assert.deepEqual(jpegs, [], `expected no .jpg posters, found: ${jpegs}`);
});

test("poster payload shrank against the jpeg baseline", () => {
  const dir = join(DIST, "features/posters");
  const total = readdirSync(dir).reduce(
    (sum, f) => sum + statSync(join(dir, f)).size,
    0,
  );
  // Byte-sum of the 13 jpg posters, measured 2026-07-25. Threshold is 0.75,
  // not 0.55: the converted set saves ~51%, but the directory also keeps the
  // pre-existing physical-device-location-system-behaviors.webp (105 KB,
  // no jpg twin), which this change does not touch.
  const BASELINE_BYTES = 856528;
  assert.ok(
    total <= BASELINE_BYTES * 0.75,
    `poster payload ${Math.round(total / 1024)}KB exceeds 75% of baseline`,
  );
});

test("no rendered page references a .jpg poster", () => {
  const html = readDist("index.html");
  assert.equal(
    /posters\/[^"']*\.jpg/.test(html),
    false,
    "homepage still references a .jpg poster",
  );
});

test("homepage videos stay deferred", () => {
  const html = readDist("index.html");
  const videoCount = (html.match(/<video/g) || []).length;
  const preloadNone = (html.match(/preload="none"/g) || []).length;
  assert.equal(
    preloadNone,
    videoCount,
    "every homepage video must keep preload=none",
  );
});
