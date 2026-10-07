import { test } from "node:test";
import assert from "node:assert/strict";

import { containedRect, focusTransform } from "../src/lib/utils/focusZoom.ts";

const frame = { width: 1600, height: 900 };

test("contained media letterboxes in the middle of its box", () => {
  const box = { left: 0, top: 0, ...frame };
  // Square media in a 16:9 box: bars left and right.
  assert.deepEqual(containedRect(box, 1), {
    left: 350,
    top: 0,
    width: 900,
    height: 900,
  });
  // Wider than the box: bars above and below.
  assert.deepEqual(containedRect(box, 4), {
    left: 0,
    top: 250,
    width: 1600,
    height: 400,
  });
});

test("the focus moves to the middle of the frame", () => {
  const media = { left: 0, top: 0, ...frame };
  // Halfway between the middle and the right edge, a third of the way down.
  const { x, y, scale } = focusTransform(frame, media, {
    x: 0.6,
    y: 0.45,
    zoom: 2,
  });
  assert.equal(scale, 2);
  // The focus, at (960, 405), lands on (800, 450).
  assert.equal(800 + x + scale * (960 - 800), 800);
  assert.equal(450 + y + scale * (405 - 450), 450);
});

test("media that covers the frame never shows its edge", () => {
  const media = { left: 0, top: 0, ...frame };
  // A focus in the top-left corner: the media's corner stays in the frame's.
  const { x, y } = focusTransform(frame, media, { x: 0, y: 0, zoom: 1.5 });
  assert.equal(x, 400);
  assert.equal(y, 225);
});

test("media smaller than the frame stays inside it", () => {
  // A portrait image, letterboxed and small.
  const media = containedRect({ left: 0, top: 0, ...frame }, 0.5);
  // Zoomed 2.5 it is 1125px wide, still narrower than the frame. Its left
  // edge can't reach the middle: the right edge would leave the frame.
  const { x } = focusTransform(frame, media, { x: 0, y: 0.5, zoom: 2.5 });
  const right = media.left + media.width;
  assert.equal(800 + x + 2.5 * (right - 800), 1600);
});

test("no zoom on media centred on its focus leaves it in place", () => {
  const media = containedRect(
    { left: 24, top: 24, width: 1552, height: 852 },
    1.5,
  );
  assert.deepEqual(focusTransform(frame, media, { x: 0.5, y: 0.5, zoom: 1 }), {
    x: 0,
    y: 0,
    scale: 1,
  });
});
