import { test } from "node:test";
import assert from "node:assert/strict";

import { svgSize } from "../src/lib/utils/svgSize.ts";

test("reads the size from the viewBox", () => {
  assert.deepEqual(svgSize('<svg viewBox="0 0 1296 350" fill="none">'), {
    width: 1296,
    height: 350,
  });
});

test("prefers the width and height attributes", () => {
  assert.deepEqual(
    svgSize('<svg width="120" height="40" viewBox="0 0 1803 350">'),
    { width: 120, height: 40 },
  );
});

test("accepts commas and decimals in the viewBox, rounded for <img>", () => {
  assert.deepEqual(svgSize('<svg viewBox="0,0,64.5,31.8">'), {
    width: 65,
    height: 32,
  });
});

test("falls back to the viewBox for relative sizes", () => {
  assert.deepEqual(
    svgSize('<svg width="100%" height="100%" viewBox="0 0 953 350">'),
    { width: 953, height: 350 },
  );
});

test("fails without a size", () => {
  assert.throws(
    () => svgSize("<svg>", "/images/brands/x.svg"),
    /\/images\/brands\/x\.svg has no width, height or viewBox/,
  );
});
