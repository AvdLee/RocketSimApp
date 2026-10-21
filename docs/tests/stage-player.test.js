import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { createStagePlayer } from "../src/lib/utils/stagePlayer.ts";

let observerCallback;

function stubVideo() {
  const source = { dataset: { src: "/features/example.mp4" }, src: "" };
  return {
    pause() {},
    play() {
      return Promise.resolve();
    },
    load() {},
    controls: false,
    dataset: {},
    querySelector(selector) {
      return selector === "source[data-src]" ? source : null;
    },
  };
}

function setMatchMedia(reducedMotion) {
  global.matchMedia = (query) => ({
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    addEventListener() {},
    removeEventListener() {},
  });
}

function setInView(inView) {
  observerCallback([
    {
      isIntersecting: inView,
      intersectionRatio: inView ? 1 : 0,
    },
  ]);
}

beforeEach(() => {
  observerCallback = undefined;
  global.IntersectionObserver = class {
    constructor(callback) {
      observerCallback = callback;
    }
    observe() {}
    disconnect() {}
  };
  setMatchMedia(false);
});

afterEach(() => {
  delete global.IntersectionObserver;
  delete global.matchMedia;
});

test("playing hides controls on the showing item", () => {
  const video = stubVideo();
  const player = createStagePlayer({
    stage: {},
    videos: [video],
    threshold: 0.5,
  });
  setInView(true);
  player.show(0, true);
  assert.equal(video.controls, false);
});

test("paused shows controls on the showing item", () => {
  const video = stubVideo();
  const player = createStagePlayer({
    stage: {},
    videos: [video],
    threshold: 0.5,
  });
  setInView(true);
  player.show(0, false);
  assert.equal(video.controls, true);
  assert.equal(video.dataset.loaded, "true");
});

test("switching item while paused moves controls to the new item", () => {
  const first = stubVideo();
  const second = stubVideo();
  const player = createStagePlayer({
    stage: {},
    videos: [first, second],
    threshold: 0.5,
  });
  setInView(true);
  player.show(0, false);
  assert.equal(first.controls, true);
  player.show(1, false);
  assert.equal(first.controls, false);
  assert.equal(second.controls, true);
});

test("image items without a video are ignored", () => {
  const player = createStagePlayer({
    stage: {},
    videos: [null],
    threshold: 0.5,
  });
  setInView(true);
  assert.doesNotThrow(() => player.show(0, false));
});

test("with reduced motion, a paused showing item still gets controls", () => {
  setMatchMedia(true);
  const video = stubVideo();
  const player = createStagePlayer({
    stage: {},
    videos: [video],
    threshold: 0.5,
  });
  setInView(true);
  player.show(0, false);
  assert.equal(video.controls, true);
});

test("with reduced motion, playing still hides controls", () => {
  setMatchMedia(true);
  const video = stubVideo();
  const player = createStagePlayer({
    stage: {},
    videos: [video],
    threshold: 0.5,
  });
  setInView(true);
  player.show(0, true);
  assert.equal(video.controls, false);
});
