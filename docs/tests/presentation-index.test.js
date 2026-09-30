import { test } from "node:test";
import assert from "node:assert/strict";

import {
  indexForKey,
  nearestIndex,
  scrollToReveal,
} from "../src/lib/utils/presentationIndex.ts";

test("arrow keys along the orientation move to the neighbouring item", () => {
  assert.equal(indexForKey("ArrowRight", 1, 4, "horizontal"), 2);
  assert.equal(indexForKey("ArrowLeft", 1, 4, "horizontal"), 0);
  assert.equal(indexForKey("ArrowDown", 1, 4, "vertical"), 2);
  assert.equal(indexForKey("ArrowUp", 1, 4, "vertical"), 0);
});

test("arrow keys wrap around at either end", () => {
  assert.equal(indexForKey("ArrowRight", 3, 4, "horizontal"), 0);
  assert.equal(indexForKey("ArrowLeft", 0, 4, "horizontal"), 3);
  assert.equal(indexForKey("ArrowDown", 6, 7, "vertical"), 0);
});

test("Home and End jump to the first and last item", () => {
  assert.equal(indexForKey("Home", 2, 4, "horizontal"), 0);
  assert.equal(indexForKey("End", 1, 7, "vertical"), 6);
});

test("keys across the orientation, and other keys, do nothing", () => {
  assert.equal(indexForKey("ArrowDown", 1, 4, "horizontal"), undefined);
  assert.equal(indexForKey("ArrowLeft", 1, 4, "vertical"), undefined);
  assert.equal(indexForKey("Enter", 1, 4, "horizontal"), undefined);
});

test("a swipe settles on the slide whose start is closest to the scroll position", () => {
  // Slide starts of a track with 900px slides and a 20px gap.
  const starts = [0, 920, 1840, 2760];
  assert.equal(nearestIndex(starts, 0), 0);
  assert.equal(nearestIndex(starts, 400), 0);
  assert.equal(nearestIndex(starts, 500), 1);
  assert.equal(nearestIndex(starts, 1900), 2);
  // Scrolled past the last start, as the end of a track can be.
  assert.equal(nearestIndex(starts, 3200), 3);
});

test("a track scrolled all the way to its end settles on the last slide", () => {
  // On wide screens the last slides cannot scroll to their start.
  const starts = [0, 920, 1840, 2760];
  assert.equal(nearestIndex(starts, 2300, 2300), 3);
  assert.equal(nearestIndex(starts, 1900, 2300), 2);
});

test("a tab already inside the scrolling row needs no scroll", () => {
  const row = { scrollLeft: 0, start: 0, end: 375, padding: 20 };
  assert.equal(scrollToReveal(row, { start: 124, end: 228 }), undefined);
});

test("a tab cut off at the end scrolls in up to the row's padding", () => {
  // The fourth 104px tab of a 375px row, starting at 332.
  const row = { scrollLeft: 0, start: 0, end: 375, padding: 20 };
  assert.equal(scrollToReveal(row, { start: 332, end: 436 }), 81);
});

test("a tab cut off at the start scrolls back to the row's padding", () => {
  const row = { scrollLeft: 180, start: 0, end: 375, padding: 20 };
  assert.equal(scrollToReveal(row, { start: -76, end: 28 }), 84);
});
