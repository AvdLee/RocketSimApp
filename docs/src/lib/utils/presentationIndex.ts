// Index and scroll logic shared by the homepage chapter presentations (tabs,
// gallery, closer look). Kept free of the DOM so it can be unit-tested with
// `node --test`.

export type Orientation = "horizontal" | "vertical";

const steps: Record<Orientation, Record<string, number>> = {
  horizontal: { ArrowLeft: -1, ArrowRight: 1 },
  vertical: { ArrowUp: -1, ArrowDown: 1 },
};

// The item a key moves focus to, or `undefined` when the key does nothing.
export function indexForKey(
  key: string,
  current: number,
  count: number,
  orientation: Orientation,
): number | undefined {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  const step = steps[orientation][key];
  return step === undefined ? undefined : (current + step + count) % count;
}

// The slide whose start is closest to `position`, the track's scroll offset.
// A track scrolled to `end` (its largest offset) settles on the last slide,
// which on wide screens cannot scroll all the way to its start.
export function nearestIndex(
  starts: readonly number[],
  position: number,
  end = Infinity,
) {
  if (position >= end - 1) return starts.length - 1;
  let nearest = 0;
  starts.forEach((start, index) => {
    if (Math.abs(start - position) < Math.abs(starts[nearest] - position)) {
      nearest = index;
    }
  });
  return nearest;
}

interface ScrollRow {
  scrollLeft: number;
  // The row's visible edges and its scroll padding.
  start: number;
  end: number;
  padding: number;
}

// The scroll offset that brings an item fully into a sideways-scrolling row,
// or `undefined` when it already is. Unlike scrollIntoView(), it never
// scrolls the page, which autoplay must not do. Edges are viewport
// coordinates, as getBoundingClientRect() reports them.
export function scrollToReveal(
  row: ScrollRow,
  item: { start: number; end: number },
): number | undefined {
  if (item.start < row.start + row.padding) {
    return row.scrollLeft + item.start - (row.start + row.padding);
  }
  if (item.end > row.end - row.padding) {
    return row.scrollLeft + item.end - (row.end - row.padding);
  }
  return undefined;
}
