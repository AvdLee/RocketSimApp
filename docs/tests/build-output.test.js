import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const INF_SLIDER_SOURCE = readFileSync(
  fileURLToPath(new URL("../src/lib/utils/infSlider.ts", import.meta.url)),
  "utf8",
);
const LAZY_VIDEO_SOURCE = readFileSync(
  fileURLToPath(new URL("../src/lib/utils/lazyVideo.ts", import.meta.url)),
  "utf8",
);

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

test("Teams page preserves its conversion funnel contract", () => {
  const html = readDist("for-teams/index.html");

  assert.match(html, /data-teams-trial-form/);
  assert.match(html, /utm_content=for_teams_hero_form/);
  assert.match(html, /utm_content=for_teams_proof/);
  assert.match(html, /utm_content=for_teams_bottom/);
  assert.match(html, /CTA:\+Team\+Page\+-\+Proof\+Start\+Trial/);
  assert.match(html, /CTA:\+Team\+Page\+-\+Start\+Trial/);
  assert.match(
    html,
    /\/docs\/support\/how-to-get-rocketsim-approved-at-work\//,
  );
  assert.match(html, /€10 per seat\/month, billed annually/);
});

test("Teams portal media ships with immediate and lazy-loaded fallbacks", () => {
  const html = readDist("for-teams/index.html");

  assert.match(
    html,
    /poster="\/features\/posters\/team-insights-dashboard\.webp"/,
  );
  assert.match(html, /data-src="\/features\/team-insights-dashboard\.mp4"/);
  assert.match(html, /class="js-lazy-video\b/);
  assert.match(html, /RocketSim for Teams user settings showing active users/);
  assert.match(
    html,
    /RocketSim for Teams subscription settings showing the license key/,
  );
});

test("Teams insight examples keep their accessibility and evidence contracts", () => {
  const html = readDist("for-teams/index.html");

  assert.match(
    html,
    /Scrolling build insight examples; focus to pause animation/,
  );
  assert.match(html, /Each card shows an independent example/);
  assert.match(html, /\+13s \(\+31\.7%\)/);
  assert.match(html, /one matched Mac configuration/);
  assert.match(html, /<th scope="col"[^>]*>Percentile<\/th>/);
  assert.match(html, /something we could never have justified/);
  assert.match(html, /total game-changer/);
  assert.doesNotMatch(html, /<article[^>]*data-insight-variant[^>]*tabindex=/);
  assert.match(INF_SLIDER_SOURCE, /aria-hidden/);
  assert.match(INF_SLIDER_SOURCE, /element\.tabIndex = -1/);
  assert.match(INF_SLIDER_SOURCE, /ResizeObserver/);
});

test("lazy video utility preserves explicit pauses", () => {
  assert.match(LAZY_VIDEO_SOURCE, /userPaused/);
  assert.match(LAZY_VIDEO_SOURCE, /if \(!state\.userPaused\)/);
  assert.match(LAZY_VIDEO_SOURCE, /state\.autoPausing = true/);
});

test("Teams page keeps its SEO metadata and legacy redirect", () => {
  const html = readDist("for-teams/index.html");
  assert.match(
    html,
    /RocketSim for Teams: Faster iOS Development and Build Insights/,
  );
  assert.match(
    html,
    /Give your iOS team over 30 faster Simulator and physical-device workflows/,
  );
  assert.match(html, /https:\/\/www\.rocketsim\.app\/for-teams/);

  const redirect = readDist("team-insights/index.html");
  assert.match(redirect, /\/for-teams/);
});

test("camera doc emits FAQPage structured data", () => {
  const html = readDist(
    "docs/features/capturing/simulator-camera-support/index.html",
  );
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
  const faq = blocks.find((b) => b["@type"] === "FAQPage");
  assert.ok(faq, "expected a FAQPage JSON-LD block");
  const questions = (faq.mainEntity || []).filter(
    (entry) => entry["@type"] === "Question",
  );
  assert.ok(
    questions.length >= 3,
    `expected at least 3 questions in the FAQPage, found ${questions.length}`,
  );
});
