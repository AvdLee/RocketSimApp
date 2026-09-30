import {
  advance,
  pick,
  progressFills,
  startAutoplay,
  toggle,
  type AutoplayState,
} from "./autoplayState";
import { loadVideo } from "./lazyVideo";

// How long an image shows before autoplay moves on. A video shows until it
// ends.
const IMAGE_MS = 5000;
// The most the clock moves per frame, so a window that was in the background
// doesn't skip items when it comes back.
const MAX_FRAME_MS = 100;

interface AutoplayOptions {
  // Autoplay only runs while this is in view.
  stage: HTMLElement;
  // Per item, in order: the fill of its progress bar, and its video if it
  // has one.
  fills: (HTMLElement | null)[];
  videos: (HTMLVideoElement | null)[];
  // The pause, play and replay button (AutoplayControl.astro).
  control: HTMLButtonElement;
  // Shows an item autoplay moved to. The presentation shows the visitor's
  // own picks itself, and reports them through `pick`.
  show: (index: number) => void;
}

// Plays a homepage tabs or gallery presentation: each item's bar fills as it
// plays, then the next item shows. It stops after two laps, only runs while
// the stage is in view, and starts paused for reduced motion.
export function createAutoplay({
  stage,
  fills,
  videos,
  control,
  show,
}: AutoplayOptions): { pick: (index: number) => void } {
  let state: AutoplayState = startAutoplay(fills.length, {
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
  let inView = false;
  // How long the current image has shown.
  let elapsed = 0;
  let frame = 0;
  let last = 0;
  // Items whose video could not play. They keep their poster and run on the
  // clock, like images.
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
      const bar = fills[index];
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
      if (index !== state.index || !running() || timed.has(index)) {
        video.pause();
        return;
      }
      loadVideo(video);
      video.play().catch((error: unknown) => {
        // A pause interrupted the start; nothing went wrong.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        timed.add(index);
        start();
      });
    });
  };

  const tick = (now: number) => {
    frame = 0;
    // A client-side navigation removed the presentation.
    if (!running() || !stage.isConnected) return;
    elapsed += Math.min(now - last, MAX_FRAME_MS);
    last = now;
    if (!videoAt(state.index) && elapsed >= IMAGE_MS) {
      moveOn();
      return;
    }
    render();
    frame = requestAnimationFrame(tick);
  };

  function start() {
    if (!running() || frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
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
