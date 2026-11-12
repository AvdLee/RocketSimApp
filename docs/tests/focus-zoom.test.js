import { test } from "node:test";
import assert from "node:assert/strict";

import { focusTransform } from "../src/lib/utils/focusZoom.ts";

const size = { width: 1600, height: 900 };

test("the focus moves to the middle of the image", () => {
  // Halfway between the middle and the right edge, a third of the way down.
  const { x, y, scale } = focusTransform(size, { x: 0.6, y: 0.45, zoom: 2 });
  assert.equal(scale, 2);
  // The focus, at (960, 405), lands on (800, 450).
  assert.equal(800 + x + scale * (960 - 800), 800);
  assert.equal(450 + y + scale * (405 - 450), 450);
});

test("the image never shows past its edge", () => {
  // A focus in the top-left corner: the corner stays put.
  assert.deepEqual(focusTransform(size, { x: 0, y: 0, zoom: 1.5 }), {
    x: 400,
    y: 225,
    scale: 1.5,
  });
  // And in the bottom-right corner.
  assert.deepEqual(focusTransform(size, { x: 1, y: 1, zoom: 1.5 }), {
    x: -400,
    y: -225,
    scale: 1.5,
  });
});

test("no zoom on a centred focus leaves the image in place", () => {
  assert.deepEqual(focusTransform(size, { x: 0.5, y: 0.5, zoom: 1 }), {
    x: 0,
    y: 0,
    scale: 1,
  });
});
