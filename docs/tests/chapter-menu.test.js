import { test } from "node:test";
import assert from "node:assert/strict";

import { chapterMenuState } from "../src/lib/utils/chapterMenu.ts";

// Viewport coordinates, as getBoundingClientRect() reports them, for a
// 1000px-high window under an 82px header.
const viewport = { header: 82, height: 1000 };
const chapters = [
  { id: "agents", top: 500, bottom: 1500 },
  { id: "captures", top: 1500, bottom: 2600 },
  // Reviews sit between captures and network.
  { id: "network", top: 3400, bottom: 4400 },
];

test("the main menu shows while the glance grid is still below the header", () => {
  const state = chapterMenuState({ ...viewport, glanceBottom: 200, chapters });
  assert.deepEqual(state, { chapters: false, current: undefined });
});

test("the chapter menu takes over once the glance grid scrolls under the header", () => {
  const state = chapterMenuState({ ...viewport, glanceBottom: 82, chapters });
  assert.equal(state.chapters, true);
});

test("the current chapter is the one across the reading line", () => {
  // The reading line sits 45% down the window, at 450px.
  const scrolled = (by) =>
    chapterMenuState({
      ...viewport,
      glanceBottom: 82 - by,
      chapters: chapters.map(({ id, top, bottom }) => ({
        id,
        top: top - by,
        bottom: bottom - by,
      })),
    }).current;

  assert.equal(scrolled(0), undefined, "agents starts below the line");
  assert.equal(scrolled(200), "agents");
  assert.equal(scrolled(1100), "captures");
  assert.equal(scrolled(2500), undefined, "between chapters, none is current");
  assert.equal(scrolled(3000), "network");
});

test("no chapter is current while the main menu shows", () => {
  const state = chapterMenuState({
    ...viewport,
    glanceBottom: 600,
    chapters: [{ id: "agents", top: 400, bottom: 1600 }],
  });
  assert.deepEqual(state, { chapters: false, current: undefined });
});
