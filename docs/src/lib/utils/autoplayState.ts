// When the homepage tabs and gallery move on by themselves. Kept free of the
// DOM so it can be unit-tested with `node --test`; src/lib/utils/autoplay.ts
// drives it from the page.

type AutoplayStatus = "playing" | "paused" | "done";

export interface AutoplayState {
  index: number;
  count: number;
  status: AutoplayStatus;
  // Full passes through the items so far.
  laps: number;
}

export function startAutoplay(
  count: number,
  { reducedMotion }: { reducedMotion: boolean },
): AutoplayState {
  return {
    index: 0,
    count,
    status: reducedMotion ? "paused" : "playing",
    laps: 0,
  };
}

// Passes through the items before autoplay stops for good.
const LAPS = 2;

// The current item finished: move on, and stop after the last lap.
export function advance(state: AutoplayState): AutoplayState {
  if (state.status !== "playing") return state;
  if (state.index < state.count - 1) {
    return { ...state, index: state.index + 1 };
  }
  const laps = state.laps + 1;
  return laps >= LAPS
    ? { ...state, status: "done", laps }
    : { ...state, index: 0, laps };
}

// The visitor picked an item. Autoplay carries on from there with fresh
// laps, unless they paused it (reduced motion starts paused).
export function pick(state: AutoplayState, index: number): AutoplayState {
  return {
    ...state,
    index,
    status: state.status === "paused" ? "paused" : "playing",
    laps: 0,
  };
}

// The pause, play and replay control.
export function toggle(state: AutoplayState): AutoplayState {
  switch (state.status) {
    case "playing": {
      return { ...state, status: "paused" };
    }
    case "paused": {
      return { ...state, status: "playing" };
    }
    default: {
      return { ...state, index: 0, status: "playing", laps: 0 };
    }
  }
}

// How full each item's progress bar is, from 0 to 1, given how far the
// current item has played. One line fills up across the items.
export function progressFills(
  state: AutoplayState,
  progress: number,
): number[] {
  return Array.from({ length: state.count }, (_, index) => {
    if (state.status === "done" || index < state.index) return 1;
    return index === state.index ? progress : 0;
  });
}
