import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

export function readDist(relativePath) {
  return readFileSync(join(DIST, relativePath), "utf8");
}

export function distHtmlFiles(dir = DIST) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return distHtmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

test("feature posters ship as webp, not jpeg", () => {
  const posters = readdirSync(join(DIST, "features/posters"));
  const jpegs = posters.filter((f) => f.endsWith(".jpg"));
  assert.deepEqual(jpegs, [], `expected no .jpg posters, found: ${jpegs}`);
  const webps = posters.filter((f) => f.endsWith(".webp"));
  assert.ok(
    webps.length >= 13,
    `expected at least 13 .webp posters, found ${webps.length}`,
  );
});

test("every poster stays lean", () => {
  // 110 KB per poster: the largest legitimate poster today is 103 KB, and a
  // JPEG-sized regression or an unoptimized export blows past this cap.
  // Per-file rather than a frozen directory total, so adding posters later
  // does not invalidate the guard.
  const MAX_POSTER_BYTES = 112640;
  const dir = join(DIST, "features/posters");
  for (const file of readdirSync(dir)) {
    const size = statSync(join(dir, file)).size;
    assert.ok(
      size <= MAX_POSTER_BYTES,
      `${file} is ${Math.round(size / 1024)}KB, max 110KB`,
    );
  }
});

test("no rendered page references a .jpg poster", () => {
  const offenders = distHtmlFiles().filter((file) =>
    /posters\/[^"']*\.jpg/.test(readFileSync(file, "utf8")),
  );
  assert.deepEqual(
    offenders.map((f) => f.slice(DIST.length)),
    [],
    "pages still reference a .jpg poster",
  );
});

test("homepage videos stay deferred", () => {
  const html = readDist("index.html");
  const videoTags = html.match(/<video\b[^>]*>/g) || [];
  assert.ok(videoTags.length > 0, "expected videos on the homepage");
  const eager = videoTags.filter((tag) => !tag.includes('preload="none"'));
  assert.deepEqual(eager, [], "every homepage video must keep preload=none");
});
