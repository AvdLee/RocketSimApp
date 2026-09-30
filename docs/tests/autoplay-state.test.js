import { test } from "node:test";
import assert from "node:assert/strict";

import {
  advance,
  pick,
  progressFills,
  startAutoplay,
  toggle,
} from "../src/lib/utils/autoplayState.ts";

test("autoplay starts on the first item, playing", () => {
  assert.deepEqual(startAutoplay(4, { reducedMotion: false }), {
    index: 0,
    count: 4,
    status: "playing",
    laps: 0,
  });
});

test("with reduced motion, autoplay starts paused", () => {
  assert.equal(startAutoplay(4, { reducedMotion: true }).status, "paused");
});

// Advances a state `times` times, as the page does when each item finishes.
const advanceBy = (state, times) =>
  Array.from({ length: times }).reduce((next) => advance(next), state);

test("a finished item moves on to the next one", () => {
  const state = advance(startAutoplay(3, { reducedMotion: false }));
  assert.equal(state.index, 1);
  assert.equal(state.status, "playing");
});

test("after the last item, autoplay starts a second lap from the first", () => {
  const state = advanceBy(startAutoplay(3, { reducedMotion: false }), 3);
  assert.deepEqual(state, { index: 0, count: 3, status: "playing", laps: 1 });
});

test("autoplay stops on the last item after two laps", () => {
  const state = advanceBy(startAutoplay(3, { reducedMotion: false }), 6);
  assert.deepEqual(state, { index: 2, count: 3, status: "done", laps: 2 });
  assert.equal(advance(state), state, "nothing moves once done");
});

test("a paused autoplay does not move on", () => {
  const paused = startAutoplay(3, { reducedMotion: true });
  assert.equal(advance(paused), paused);
});

test("picking an item plays on from it and starts the laps over", () => {
  const onSecondLap = advanceBy(startAutoplay(3, { reducedMotion: false }), 4);
  assert.deepEqual(pick(onSecondLap, 2), {
    index: 2,
    count: 3,
    status: "playing",
    laps: 0,
  });
});

test("picking an item after autoplay finished plays on from it", () => {
  const done = advanceBy(startAutoplay(3, { reducedMotion: false }), 6);
  assert.deepEqual(pick(done, 1), {
    index: 1,
    count: 3,
    status: "playing",
    laps: 0,
  });
});

test("picking an item keeps a pause, so reduced motion never plays on its own", () => {
  const state = pick(startAutoplay(3, { reducedMotion: true }), 1);
  assert.equal(state.index, 1);
  assert.equal(state.status, "paused");
});

test("the control pauses and resumes on the same item", () => {
  const playing = advance(startAutoplay(3, { reducedMotion: false }));
  const paused = toggle(playing);
  assert.deepEqual(paused, { ...playing, status: "paused" });
  assert.deepEqual(toggle(paused), playing);
});

test("the control replays from the first item once autoplay finished", () => {
  const done = advanceBy(startAutoplay(3, { reducedMotion: false }), 6);
  assert.deepEqual(toggle(done), {
    index: 0,
    count: 3,
    status: "playing",
    laps: 0,
  });
});

test("progress bars fill up to the current item", () => {
  const third = advanceBy(startAutoplay(4, { reducedMotion: false }), 2);
  assert.deepEqual(progressFills(third, 0.4), [1, 1, 0.4, 0]);
});

test("a new lap empties the bars again", () => {
  const secondLap = advanceBy(startAutoplay(3, { reducedMotion: false }), 3);
  assert.deepEqual(progressFills(secondLap, 0), [0, 0, 0]);
});

test("a paused item keeps its progress", () => {
  const paused = toggle(advance(startAutoplay(3, { reducedMotion: false })));
  assert.deepEqual(progressFills(paused, 0.7), [1, 0.7, 0]);
});

test("every bar is full once autoplay finished", () => {
  const done = advanceBy(startAutoplay(3, { reducedMotion: false }), 6);
  assert.deepEqual(progressFills(done, 0), [1, 1, 1]);
});
