import { test } from "node:test";
import assert from "node:assert/strict";

import { isPublished } from "../src/lib/blogPublishing.ts";

const now = new Date("2026-11-03T05:00:00Z");

test("a post dated in the past is published", () => {
  assert.equal(isPublished(new Date("2026-10-29"), now), true);
});

test("a post dated exactly now is published", () => {
  assert.equal(isPublished(new Date("2026-11-03T05:00:00Z"), now), true);
});

test("a post dated in the future is not published", () => {
  assert.equal(isPublished(new Date("2026-11-05"), now), false);
});

test("future posts are shown when previewing", () => {
  assert.equal(isPublished(new Date("2026-11-05"), now, true), true);
});
