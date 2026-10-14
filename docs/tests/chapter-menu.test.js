import { test } from "node:test";
import assert from "node:assert/strict";

import { chapterMenuState } from "../src/lib/utils/chapterMenu.ts";

const chapters = (reached) =>
  ["agents", "captures", "network"].map((id, index) => ({
    id,
    reached: index < reached,
  }));

test("the main menu shows while the glance grid is still below the header", () => {
  const state = chapterMenuState({ pastGlance: false, chapters: chapters(0) });
  assert.deepEqual(state, { showChapterMenu: false, current: undefined });
});

test("the chapter menu takes over once the glance grid scrolls under the header", () => {
  const state = chapterMenuState({ pastGlance: true, chapters: chapters(0) });
  assert.deepEqual(state, { showChapterMenu: true, current: undefined });
});

test("the current chapter is the last one to reach the reading line", () => {
  const current = (reached) =>
    chapterMenuState({ pastGlance: true, chapters: chapters(reached) }).current;
  assert.equal(current(1), "agents");
  assert.equal(current(2), "captures");
  // Reached chapters stay current through the sections after them, and the
  // last one until the end of the page.
  assert.equal(current(3), "network");
});

test("no chapter is current while the main menu shows", () => {
  const state = chapterMenuState({ pastGlance: false, chapters: chapters(2) });
  assert.deepEqual(state, { showChapterMenu: false, current: undefined });
});
