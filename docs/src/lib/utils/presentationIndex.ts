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

// How many slides along a track is at `position`, its scroll offset: 2 when
// it rests on the third slide, 2.5 halfway to the fourth. `rests` are the
// offsets the track rests at for each slide, in order; on wide screens the
// last slides rest at the track's end, short of their start. Round it for the
// nearest slide.
export function slidePosition(rests: readonly number[], position: number) {
  if (position <= rests[0]) return 0;
  for (let index = 0; index < rests.length - 1; index++) {
    const from = rests[index];
    const to = rests[index + 1];
    if (position < to) return index + (position - from) / (to - from);
  }
  return rests.length - 1;
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
