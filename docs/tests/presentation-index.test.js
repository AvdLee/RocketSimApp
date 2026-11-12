import { test } from "node:test";
import assert from "node:assert/strict";

import {
  indexForKey,
  scrollToReveal,
  slidePosition,
  swipeTarget,
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

test("the track's position counts slides, with fractions between them", () => {
  // Where the track rests for each slide: 900px slides and a 20px gap.
  const rests = [0, 920, 1840, 2760];
  assert.equal(slidePosition(rests, 0), 0);
  assert.equal(slidePosition(rests, 460), 0.5);
  assert.equal(slidePosition(rests, 920), 1);
  assert.equal(slidePosition(rests, 2070), 2.25);
  assert.equal(slidePosition(rests, 2760), 3);
});

test("the position stays within the first and last slide", () => {
  // Overscroll past either end, as a trackpad bounce can report.
  const rests = [0, 920, 1840, 2760];
  assert.equal(slidePosition(rests, -40), 0);
  assert.equal(slidePosition(rests, 3200), 3);
});

test("slides that rest short of their start still count as whole slides", () => {
  // On wide screens the last slide cannot scroll to its start, so it rests at
  // the end of the track, 2300 instead of 2760.
  const rests = [0, 920, 1840, 2300];
  assert.equal(slidePosition(rests, 2070), 2.5);
  assert.equal(slidePosition(rests, 2300), 3);
});

test("a swipe settles on the nearest slide", () => {
  const rests = [0, 920, 1840, 2760];
  assert.equal(Math.round(slidePosition(rests, 400)), 0);
  assert.equal(Math.round(slidePosition(rests, 500)), 1);
  assert.equal(Math.round(slidePosition(rests, 1900)), 2);
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

test("a swipe to the left brings in the next item, to the right the previous", () => {
  assert.equal(swipeTarget(-80, 1, 4), 2);
  assert.equal(swipeTarget(80, 1, 4), 0);
});

test("a short swipe, or one past either end, stays put", () => {
  assert.equal(swipeTarget(-20, 1, 4), undefined);
  assert.equal(swipeTarget(80, 0, 4), undefined);
  assert.equal(swipeTarget(-80, 3, 4), undefined);
});
