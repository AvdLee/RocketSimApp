import { test } from "node:test";
import assert from "node:assert/strict";

import {
  beatForProgress,
  formatBytes,
  isOnAt,
} from "../src/lib/agents/beats.ts";
import { beatCount, scenarios } from "../src/lib/agents/scenarios.ts";

for (const [id, scenario] of Object.entries(scenarios)) {
  test(`${id}: every arrow points at real screens and a real element`, () => {
    const screens = new Map(
      scenario.screens.map((screen) => [screen.id, screen]),
    );
    for (const edge of scenario.edges) {
      const from = screens.get(edge.from);
      assert.ok(from, `${edge.id}: unknown from screen ${edge.from}`);
      assert.ok(
        screens.has(edge.to),
        `${edge.id}: unknown to screen ${edge.to}`,
      );
      assert.ok(
        from.elements.some((element) => element.id === edge.element),
        `${edge.id}: ${edge.from} has no element ${edge.element}`,
      );
    }
  });

  test(`${id}: every screen appears, and every beat has a label`, () => {
    const placed = new Set(
      scenario.placements.map((placement) => placement.screen),
    );
    for (const screen of scenario.screens) {
      assert.ok(placed.has(screen.id), `${screen.id} is never placed`);
    }
    assert.equal(scenario.beatLabels.length, beatCount(scenario));
  });

  test(`${id}: nothing is scheduled beyond the last beat`, () => {
    const last = beatCount(scenario) - 1;
    for (const { at } of scenario.placements) assert.ok(at <= last);
    for (const { at, until } of scenario.edges) {
      assert.ok(at <= last);
      if (until !== undefined) assert.ok(until > at && until <= last + 1);
    }
  });
}

test("beatForProgress keeps the first beat short and shares the rest", () => {
  // Four beats: the first takes 0.3 of 3.3 units, the others one unit each.
  assert.equal(beatForProgress(0, 4), 0);
  assert.equal(beatForProgress(0.08, 4), 0);
  assert.equal(beatForProgress(0.1, 4), 1);
  assert.equal(beatForProgress(0.4, 4), 2);
  assert.equal(beatForProgress(0.7, 4), 3);
  assert.equal(beatForProgress(1, 4), 3);
  assert.equal(beatForProgress(-1, 4), 0);
  assert.equal(beatForProgress(0.5, 1), 0);
});

test("isOnAt turns things on and off", () => {
  assert.equal(isOnAt(1, 2), false);
  assert.equal(isOnAt(2, 2), true);
  assert.equal(isOnAt(3, 2, 3), false);
  assert.equal(isOnAt(2, 2, 3), true);
});

test("formatBytes prints the meter's units", () => {
  assert.equal(formatBytes(96), "96 B");
  assert.equal(formatBytes(1100), "1.1 KB");
});
