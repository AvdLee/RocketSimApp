import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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
  // Covers the homepage rebuild preview until it replaces `/` at launch.
  for (const page of ["index.html", "home-next/index.html"]) {
    const html = readDist(page);
    const videoTags = html.match(/<video\b[^>]*>/g) || [];
    assert.ok(videoTags.length > 0, `expected videos on ${page}`);
    const eager = videoTags.filter((tag) => !tag.includes('preload="none"'));
    assert.deepEqual(
      eager,
      [],
      `every video on ${page} must keep preload=none`,
    );
  }
});

test("homepage preview stays out of search until launch", () => {
  const html = readDist("home-next/index.html");
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);

  const sitemap = readDist("sitemap-0.xml");
  assert.doesNotMatch(sitemap, /home-next/);
});

test("homepage preview keeps the live App Store campaign attribution", () => {
  // The `ct=` campaign feeds App Store Connect, so each placement must keep
  // the value it has on the live homepage.
  const campaigns = (html, placement) =>
    [
      ...html.matchAll(
        new RegExp(
          `<a[^>]*plausible-event-placement=${placement}\\b[^>]*>`,
          "g",
        ),
      ),
    ].map(([tag]) => tag.match(/[?&]ct=([^&"]+)/)?.[1]);

  const live = readDist("index.html");
  const preview = readDist("home-next/index.html");
  for (const placement of [
    "landing-hero",
    "landing-app-store-reviews",
    "landing-app-store-featured",
  ]) {
    const expected = campaigns(live, placement);
    assert.ok(expected.length > 0, `expected ${placement} on the homepage`);
    assert.deepEqual(campaigns(preview, placement), expected, placement);
  }
});

test("homepage preview only references media that ships", () => {
  // Tile posters are plain public paths, so a typo would not fail the build.
  const html = readDist("home-next/index.html");
  const paths = [...html.matchAll(/(?:src|poster|data-src)="(\/[^"]+)"/g)]
    .map(([, path]) => path)
    .filter((path) => !path.startsWith("//"));
  assert.ok(paths.length > 0, "expected local media on the page");
  const missing = paths.filter((path) => !existsSync(join(DIST, path)));
  assert.deepEqual(missing, []);
});

test("homepage glance tiles follow the chapters placed on the page", () => {
  // The `chapters` array in the page orders the tiles; the `<Chapter>` lines
  // order the sections. They must list the same chapters in the same order.
  const html = readDist("home-next/index.html");
  const tiles = [...html.matchAll(/<a[^>]*data-glance-tile[^>]*>/g)].map(
    ([tag]) => tag.match(/href="#([^"]+)"/)?.[1],
  );
  const sections = [...html.matchAll(/<section[^>]*data-chapter[^>]*>/g)].map(
    ([tag]) => tag.match(/id="([^"]+)"/)?.[1],
  );

  assert.ok(sections.length > 0, "expected chapters on the page");
  assert.deepEqual(tiles, sections);
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

// The chapter sections on the homepage preview, with their inner markup.
// Scripts are left out: Astro renders a component's script inline, next to
// the first instance, and its selectors would read as markup.
function homepageChapters() {
  const html = readDist("home-next/index.html").replace(
    /<script\b[\s\S]*?<\/script>/g,
    "",
  );
  return [
    ...html.matchAll(
      /<section[^>]*\bid="([^"]+)"[^>]*data-chapter[^>]*>([\s\S]*?)<\/section>/g,
    ),
  ].map(([tag, id, body]) => ({
    id,
    presentation: tag.match(/data-presentation="([^"]+)"/)?.[1],
    body,
  }));
}

// The opening tag of the element a control points at through aria-controls.
function controlledElement(body, control) {
  const id = control.match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(id, `expected aria-controls on ${control}`);
  const element = body.match(new RegExp(`<[^>]*\\bid="${id}"[^>]*>`))?.[0];
  assert.ok(element, `expected an element with id "${id}"`);
  return element;
}

const isHidden = (tag) => /\shidden\b/.test(tag);

test("homepage chapters render the presentation their content asks for", () => {
  const chapters = homepageChapters();
  assert.ok(chapters.length > 0, "expected chapters on the page");
  for (const { id, presentation, body } of chapters) {
    const rendered = [
      ...body.matchAll(/data-presentation-root="([^"]+)"/g),
    ].map(([, name]) => name);
    assert.deepEqual(rendered, [presentation], id);
  }
});

test("homepage tabs follow the ARIA tabs pattern", () => {
  const tabsChapters = homepageChapters().filter(
    ({ presentation }) => presentation === "tabs",
  );
  assert.ok(tabsChapters.length > 0, "expected a tabs chapter");
  for (const { id, body } of tabsChapters) {
    const lists = body.match(/<[^>]*role="tablist"[^>]*>/g) || [];
    assert.equal(lists.length, 1, `${id}: one tab list`);
    assert.match(lists[0], /aria-label="[^"]+"/, `${id}: named tab list`);

    const tabs = body.match(/<button[^>]*role="tab"[^>]*>/g) || [];
    assert.ok(tabs.length > 1, `${id}: expected tabs`);
    const selected = tabs.filter((tab) => /aria-selected="true"/.test(tab));
    assert.equal(selected.length, 1, `${id}: exactly one selected tab`);
    // Roving focus: only the selected tab is in the tab order.
    assert.match(selected[0], /tabindex="0"/, `${id}: selected tab focusable`);
    assert.equal(
      tabs.filter((tab) => /tabindex="-1"/.test(tab)).length,
      tabs.length - 1,
      `${id}: other tabs leave the tab order`,
    );

    for (const tab of tabs) {
      const tabId = tab.match(/\bid="([^"]+)"/)?.[1];
      const panel = controlledElement(body, tab);
      assert.match(panel, /role="tabpanel"/, id);
      assert.match(panel, new RegExp(`aria-labelledby="${tabId}"`), id);
      // Only the selected tab's panel shows.
      assert.equal(
        isHidden(panel),
        !/aria-selected="true"/.test(tab),
        `${id}: panel visibility follows ${tabId}`,
      );
    }
  }
});

test("homepage closer-look buttons disclose their descriptions", () => {
  const closerLooks = homepageChapters().filter(
    ({ presentation }) => presentation === "closer-look",
  );
  assert.ok(closerLooks.length > 0, "expected a closer-look chapter");
  for (const { id, body } of closerLooks) {
    const buttons = body.match(/<button[^>]*aria-expanded[^>]*>/g) || [];
    assert.ok(buttons.length > 1, `${id}: expected tool buttons`);
    const expanded = buttons.filter((b) => /aria-expanded="true"/.test(b));
    assert.equal(expanded.length, 1, `${id}: the first tool starts open`);
    for (const button of buttons) {
      assert.equal(
        isHidden(controlledElement(body, button)),
        !/aria-expanded="true"/.test(button),
        `${id}: description visibility follows its button`,
      );
    }
  }
});

test("homepage galleries follow the ARIA carousel pattern", () => {
  const galleries = homepageChapters().filter(
    ({ presentation }) => presentation === "gallery",
  );
  assert.ok(galleries.length > 0, "expected a gallery chapter");
  for (const { id, body } of galleries) {
    const root = body.match(
      /<[^>]*data-presentation-root="gallery"[^>]*>/,
    )?.[0];
    assert.match(root, /aria-roledescription="carousel"/, id);
    assert.match(root, /aria-label="[^"]+"/, `${id}: named carousel`);

    const slides =
      body.match(/<[^>]*aria-roledescription="slide"[^>]*>/g) || [];
    assert.ok(slides.length > 1, `${id}: expected slides`);
    slides.forEach((slide, index) => {
      assert.match(slide, /role="group"/, `${id}: slide ${index + 1}`);
      assert.match(
        slide,
        new RegExp(`aria-label="${index + 1} of ${slides.length}"`),
        `${id}: slide ${index + 1} names its position`,
      );
    });

    // One picker button per slide, and the first slide starts current.
    const pickers = body.match(/<button[^>]*data-gallery-picker[^>]*>/g) || [];
    assert.equal(pickers.length, slides.length, `${id}: a picker per slide`);
    assert.deepEqual(
      pickers.map((picker) => /aria-current="true"/.test(picker)),
      slides.map((_, index) => index === 0),
      `${id}: first slide current`,
    );
    // The visual counter is aria-hidden; slide changes are announced here.
    assert.match(body, /<[^>]*aria-live="polite"[^>]*data-gallery-status/, id);
    assert.match(body, /<button[^>]*aria-label="Previous highlight"/);
    assert.match(body, /<button[^>]*aria-label="Next highlight"/);
  }
});

test("homepage Teams chapter keeps its Plausible events", () => {
  // See ANALYTICS.md: the names are part of the historical reporting contract.
  const teams = homepageChapters().find(({ id }) => id === "teams");
  assert.ok(teams, "expected the teams chapter");
  const link = (event) =>
    teams.body.match(
      new RegExp(`<a[^>]*plausible-event-name=${event}[\\s"][^>]*>`),
    )?.[0];

  const trial = link("CTA:\\+Homepage\\+Insights\\+-\\+Trial");
  assert.ok(trial, "trial button carries CTA: Homepage Insights - Trial");
  assert.match(
    trial,
    /href="[^"]*\/signup\/trial\?[^"]*utm_content=homepage_insights"/,
  );
  for (const event of [
    "CTA:\\+Homepage\\+Insights\\+-\\+Learn\\+More",
    "CTA:\\+Homepage\\+Mid\\+2\\+-\\+Trial",
  ]) {
    assert.match(link(event) ?? "", /href="\/for-teams\/"/, event);
  }
});
