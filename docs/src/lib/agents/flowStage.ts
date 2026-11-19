import { prefersReducedMotion } from "../utils/motion.ts";

import { beatForProgress, formatBytes, isOnAt } from "./beats.ts";

// Plays the agent stage (src/components/agents/AgentFlowStage.astro). The
// server renders the finished session, so without this script, and with
// reduced motion, a visitor sees the whole flow page. When motion is allowed
// the stage rewinds to its first beat and steps forward, either as the
// visitor scrolls through its track (wide windows) or by itself once it is in
// view (phones and short windows).

const AUTOPLAY_STEP_MS = 1900;
// How long a looping stage rests on its last beat before starting over.
const LOOP_PAUSE_MS = 3200;
// Share of the stage that is on screen when scrolling starts to play it.
const SCRUB_START_VISIBLE = 0.5;
// Room between a pinned stage and the window's bottom edge, and where a stage
// without a hero above it pins, below the site header.
const STAGE_MARGIN = 16;
const STAGE_MIN_TOP = 96;
const SCRUB_QUERY = "(min-width: 1024px) and (min-height: 700px)";

interface Camera {
  scale: number;
  x: number;
  y: number;
}

function initStage(root: HTMLElement): () => void {
  const beats = Number(root.dataset.beats);
  const replayAt = root.dataset.replayAt
    ? Number(root.dataset.replayAt)
    : undefined;
  const cameras: Camera[] = JSON.parse(root.dataset.cams ?? "[]");
  const bytes: number[] = JSON.parse(root.dataset.bytes ?? "[]");
  const labels: string[] = JSON.parse(root.dataset.labels ?? "[]");

  const inner = root.querySelector<HTMLElement>("[data-stage-inner]");
  const board = root.querySelector<HTMLElement>("[data-board]");
  const meter = root.querySelector<HTMLElement>("[data-meter]");
  const caption = root.querySelector<HTMLElement>("[data-beat-label]");
  const count = root.querySelector<HTMLElement>("[data-beat-count]");
  const ticks = [...root.querySelectorAll<HTMLElement>("[data-tick]")];
  const replay = root.querySelector<HTMLButtonElement>("[data-replay-button]");
  const timeline = [...root.querySelectorAll<HTMLElement>("[data-at]")].map(
    (element) => ({
      element,
      at: Number(element.dataset.at),
      until: element.dataset.until ? Number(element.dataset.until) : undefined,
    }),
  );
  const cleanups: (() => void)[] = [];
  if (!inner || !board || beats < 2) return () => {};

  let current = -1;
  const show = (beat: number) => {
    if (beat === current) return;
    current = beat;
    root.dataset.beat = String(beat);
    timeline.forEach(({ element, at, until }) => {
      element.toggleAttribute("data-on", isOnAt(beat, at, until));
    });
    const camera = cameras[beat];
    if (camera) {
      board.style.setProperty("--cam-scale", String(camera.scale));
      board.style.setProperty("--cam-x", String(camera.x));
      board.style.setProperty("--cam-y", String(camera.y));
    }
    root.toggleAttribute(
      "data-replaying",
      replayAt !== undefined && beat >= replayAt,
    );
    if (meter) meter.textContent = formatBytes(bytes[beat] ?? 0);
    if (caption) caption.textContent = labels[beat] ?? "";
    if (count) count.textContent = `${beat + 1} / ${beats}`;
    ticks.forEach((tick, index) => {
      tick.toggleAttribute("data-active", index <= beat);
    });
  };

  const wide = matchMedia(SCRUB_QUERY);
  const scrubs = () => wide.matches && !root.hasAttribute("data-autoplay");
  let timer: number | undefined;
  let autoplayed = false;
  let frame = 0;

  const body = root.querySelector<HTMLElement>("[data-stage-body]") ?? inner;
  const hasLead = body !== inner && body.offsetTop > 0;

  // Scrubbing starts once half of the stage is on screen, even while the unit
  // is still scrolling towards its pin, and ends when the track lets go. A
  // stage already that visible at the top of the page starts at once.
  const progress = () => {
    const rect = root.getBoundingClientRect();
    const pin = parseFloat(getComputedStyle(inner).top) || 0;
    const travel = rect.height - inner.offsetHeight;
    if (travel <= 0) return 0;
    const half = window.innerHeight - body.offsetHeight * SCRUB_START_VISIBLE;
    const start = Math.min(half - body.offsetTop, rect.top + window.scrollY);
    const end = pin - travel;
    return (start - rect.top) / (start - end);
  };
  const onScroll = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      show(beatForProgress(progress(), beats));
    });
  };

  const loops = root.hasAttribute("data-loop");
  let loopTimer: number | undefined;
  const stopTimer = () => {
    window.clearInterval(timer);
    window.clearTimeout(loopTimer);
    timer = undefined;
    loopTimer = undefined;
  };
  const play = () => {
    stopTimer();
    root.removeAttribute("data-finished");
    show(0);
    timer = window.setInterval(() => {
      if (current >= beats - 1) {
        stopTimer();
        root.setAttribute("data-finished", "");
        if (loops) loopTimer = window.setTimeout(play, LOOP_PAUSE_MS);
        return;
      }
      show(current + 1);
    }, AUTOPLAY_STEP_MS);
  };

  // Most of the stage must be on screen before it starts, so nobody scrolls
  // past the first beats. A stage taller than the viewport can never be fully
  // visible, so it starts at the share that fits.
  const startRatio = Math.min(
    0.8,
    (window.innerHeight * 0.9) / Math.max(inner.offsetHeight, 1),
  );
  const visibility = new IntersectionObserver(
    ([entry]) => {
      if (scrubs()) return;
      if (loops) {
        // Runs while in view, and rests, rewound, once it leaves.
        if (entry.intersectionRatio >= startRatio) {
          if (timer === undefined && loopTimer === undefined) play();
        } else if (!entry.isIntersecting) {
          stopTimer();
          root.removeAttribute("data-finished");
          show(0);
        }
        return;
      }
      if (!entry.isIntersecting || autoplayed) return;
      autoplayed = true;
      play();
    },
    { threshold: loops ? [0, startRatio] : startRatio },
  );

  // The unit (hero text, when there is any, and the stage) pins as low as it
  // can while the whole stage stays on screen. When everything fits, it pins
  // in place and the hero stays fully visible. Otherwise the hero's top
  // scrolls away and its bottom stays above the stage.
  const placeStage = () => {
    const room = window.innerHeight - inner.offsetHeight - STAGE_MARGIN;
    const top = Math.min(hasLead ? 0 : STAGE_MIN_TOP, room);
    root.style.setProperty("--stage-top", `${Math.round(top)}px`);
    root.style.setProperty("--inner-h", `${inner.offsetHeight}px`);
  };

  const arm = () => {
    placeStage();
    stopTimer();
    window.removeEventListener("scroll", onScroll);
    visibility.disconnect();
    root.dataset.js = "";
    if (scrubs()) {
      window.addEventListener("scroll", onScroll, { passive: true });
      current = -1;
      show(beatForProgress(progress(), beats));
    } else {
      autoplayed = false;
      current = -1;
      show(0);
      visibility.observe(inner);
    }
  };

  replay?.addEventListener("click", play);
  wide.addEventListener("change", arm);
  window.addEventListener("resize", placeStage);
  arm();

  cleanups.push(() => {
    stopTimer();
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
    wide.removeEventListener("change", arm);
    window.removeEventListener("resize", placeStage);
    replay?.removeEventListener("click", play);
    visibility.disconnect();
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

/** Starts every agent stage on the page; returns a function that stops them. */
export function initFlowStages(): () => void {
  if (prefersReducedMotion()) return () => {};
  const stops = [
    ...document.querySelectorAll<HTMLElement>("[data-flow-stage]"),
  ].map(initStage);
  return () => stops.forEach((stop) => stop());
}
