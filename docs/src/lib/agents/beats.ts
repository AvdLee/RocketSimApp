// Which beat of a scripted session shows for a given scroll position. Kept
// free of the DOM so `node --test` can check it; flowStage.ts feeds it.

/** How long the first beat lasts, compared with every other beat. */
const FIRST_BEAT_SHARE = 0.3;

/**
 * The beat for how far a visitor has scrolled through the stage's track.
 * `progress` runs from 0 to 1. The first beat is only a prompt, so it is
 * short: the stage starts moving as soon as it is on screen. Every other beat
 * gets an equal share, so the last one lingers for its share of the track
 * before the stage lets go.
 */
export function beatForProgress(progress: number, beats: number): number {
  if (beats <= 1) return 0;
  const clamped = Math.min(Math.max(progress, 0), 1);
  const unit = 1 / (beats - 1 + FIRST_BEAT_SHARE);
  const scrolled = clamped / unit;
  if (scrolled < FIRST_BEAT_SHARE) return 0;
  return Math.min(beats - 1, 1 + Math.floor(scrolled - FIRST_BEAT_SHARE));
}

/** Whether something shown from `at` until `until` is on at `beat`. */
export function isOnAt(beat: number, at: number, until?: number): boolean {
  return at <= beat && beat < (until ?? Number.POSITIVE_INFINITY);
}

/** Bytes as the context meter prints them: 96 B, 1.1 KB. */
export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  return `${(bytes / 1000).toFixed(1)} KB`;
}
