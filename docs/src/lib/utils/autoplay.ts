import {
  advance,
  pick,
  progressFills,
  startAutoplay,
  toggle,
  type AutoplayState,
} from "./autoplayState";
import { loadVideo } from "./lazyVideo";
import { prefersReducedMotion } from "./motion";

// How long an image shows before autoplay moves on. A video shows until it
// ends.
const IMAGE_MS = 5000;
// The most the clock moves per frame, so a window that was in the background
// doesn't skip items when it comes back.
const MAX_FRAME_MS = 100;

interface AutoplayItem {
  // The fill of the item's progress bar.
  fill: HTMLElement | null;
  video: HTMLVideoElement | null;
}

interface AutoplayOptions {
  // Autoplay only runs while this is in view.
  stage: HTMLElement;
  // In display order.
  items: AutoplayItem[];
  // The pause, play and replay button (AutoplayControl.astro).
  control: HTMLButtonElement;
  // Shows an item autoplay moved to. The presentation shows the visitor's
  // own picks itself, and reports them through `pick`.
  show: (index: number) => void;
}

// Plays a homepage tabs or gallery presentation: each item's bar fills as it
// plays, then the next item shows. It stops after two laps, only runs while
// the stage is in view, and starts paused for reduced motion, where the
// current video gets controls to play it by hand.
export function createAutoplay({
  stage,
  items,
  control,
  show,
}: AutoplayOptions): { pick: (index: number) => void } {
  const reducedMotion = prefersReducedMotion();
  let state: AutoplayState = startAutoplay(items.length, { reducedMotion });
  const videos = items.map(({ video }) => video);
  let inView = false;
  // How long the current image has shown.
  let elapsed = 0;
  let frame = 0;
  let last = 0;
  // Items whose video could not play or load. They keep their poster and run
  // on the clock, like images.
  const timed = new Set<number>();
  const name = control.dataset.autoplayName ?? "";

  const videoAt = (index: number) => (timed.has(index) ? null : videos[index]);
  const running = () => state.status === "playing" && inView;

  const progress = () => {
    const video = videoAt(state.index);
    if (!video) return Math.min(1, elapsed / IMAGE_MS);
    return video.duration ? video.currentTime / video.duration : 0;
  };

  const render = () => {
    progressFills(state, progress()).forEach((fill, index) => {
      const bar = items[index].fill;
      if (bar) bar.style.scale = `${fill} 1`;
    });
  };

  const syncControl = () => {
    const verb = { playing: "Pause", paused: "Play", done: "Replay" }[
      state.status
    ];
    control.dataset.autoplayStatus = state.status;
    control.setAttribute("aria-label", `${verb} ${name}`);
  };

  const syncVideos = () => {
    videos.forEach((video, index) => {
      if (!video) return;
      const current = index === state.index && inView;
      if (!current || !running() || timed.has(index)) {
        video.pause();
        if (current && reducedMotion) {
          loadVideo(video);
          video.controls = true;
        }
        return;
      }
      loadVideo(video);
      video.play().catch((error: unknown) => {
        // A pause interrupted the start; nothing went wrong.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        runOnClock(index);
      });
    });
  };

  const tick = (now: number) => {
    frame = 0;
    // A client-side navigation removed the presentation.
    if (!running() || !stage.isConnected) return;
    // A video's own playback sets its progress; only images run the clock.
    if (!videoAt(state.index)) {
      elapsed += Math.min(now - last, MAX_FRAME_MS);
      if (elapsed >= IMAGE_MS) {
        moveOn();
        return;
      }
    }
    last = now;
    render();
    frame = requestAnimationFrame(tick);
  };

  function start() {
    if (!running() || frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function runOnClock(index: number) {
    timed.add(index);
    start();
  }

  const refresh = () => {
    syncControl();
    syncVideos();
    render();
    start();
  };

  // The item shows from its start.
  const restartItem = () => {
    elapsed = 0;
    const video = videos[state.index];
    if (video) video.currentTime = 0;
  };

  function moveOn() {
    state = advance(state);
    if (state.status !== "done") {
      restartItem();
      show(state.index);
    }
    refresh();
  }

  videos.forEach((video, index) => {
    if (!video) return;
    // The video's end moves autoplay on, so it must not loop.
    video.loop = false;
    video.addEventListener("ended", () => {
      if (index === state.index && state.status === "playing") moveOn();
    });
    // A source that fails to load never ends.
    video
      .querySelector("source")
      ?.addEventListener("error", () => runOnClock(index));
  });

  control.addEventListener("click", () => {
    const replay = state.status === "done";
    state = toggle(state);
    if (replay) {
      restartItem();
      show(state.index);
    }
    refresh();
  });

  new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      refresh();
    },
    { threshold: 0.5 },
  ).observe(stage);

  syncControl();
  render();

  return {
    pick(index) {
      state = pick(state, index);
      restartItem();
      refresh();
    },
  };
}
