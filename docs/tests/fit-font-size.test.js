import { test } from "node:test";
import assert from "node:assert/strict";

import { fitFontSize } from "../src/lib/utils/fitFontSize.ts";

// A title that sets on one line up to `wrapsAt`, and on two lines above it.
const title =
  (wrapsAt, leading = 1) =>
  (size) =>
    (size <= wrapsAt ? 1 : 2) * size * leading;

const bounds = { min: 32, max: 64, precision: 0.25 };

test("shrinks the title until it matches the target height", () => {
  const size = fitFontSize(title(40), 110, bounds);
  assert.ok(Math.abs(size - 55) <= 0.25, `got ${size}`);
});

test("wraps onto another line when that lands closer to the target", () => {
  // One line tops out at 50px tall; two lines at 51px are 102px tall.
  const size = fitFontSize(title(50), 100, bounds);
  assert.ok(size > 50 && size <= 50.25, `got ${size}`);
});

test("stays on fewer lines when rewrapping overshoots by more", () => {
  // One line at 60px is 60px tall; two lines at 61px are 122px tall.
  const size = fitFontSize(title(60), 70, bounds);
  assert.ok(size >= 59.75 && size <= 60, `got ${size}`);
});

test("keeps within the bounds", () => {
  assert.equal(fitFontSize(title(40), 400, bounds), 64);
  assert.equal(fitFontSize(title(64), 10, bounds), 32);
});
