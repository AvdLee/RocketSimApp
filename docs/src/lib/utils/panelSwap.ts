// How a presentation's panels change, in the tabs and the closer look: the
// old media moves away and blurs as its panel fades, and the new media comes
// into focus from the other side.
export const SWAP = {
  // How far the media moves, in px.
  distance: 48,
  blur: 12,
  outMs: 450,
  inMs: 750,
};

interface SwapPanel {
  // Fades, with the media's backdrop.
  panel: HTMLElement | null | undefined;
  // Moves and blurs.
  media: HTMLElement | null | undefined;
}

interface SwapOptions {
  // Which way the media moves.
  axis: "x" | "y";
  // 1 going forward, -1 going back. Going forward, the media moves left or
  // up.
  direction: number;
  // Where a swipe left the old media, which then moves on from there.
  offset?: number;
}

export function cssEasing(name: string, fallback: string): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

// Only these animations run on the panels and their media, so a change
// cancels whatever the last one left running.
function cancelAnimations(element: Element | null | undefined) {
  element?.getAnimations().forEach((animation) => animation.cancel());
}

// Plays the change; the caller has already made the old panel inert, and
// so hidden. Callers skip it with reduced motion.
export function swapPanels(
  from: SwapPanel,
  to: SwapPanel,
  { axis, direction, offset = 0 }: SwapOptions,
): void {
  [from.panel, to.panel, from.media, to.media].forEach(cancelAnimations);

  const smooth = cssEasing("--ease-smooth", "ease-in-out");
  const enter = cssEasing("--ease-enter", "ease-out");
  const shift = SWAP.distance * direction;
  const at = (px: number) => (axis === "y" ? `0 ${px}px` : `${px}px 0`);
  const blur = `blur(${SWAP.blur}px)`;

  // The old panel stays visible while it fades.
  from.panel?.animate(
    [
      { opacity: 1, visibility: "visible" },
      { opacity: 0, visibility: "visible" },
    ],
    { duration: SWAP.outMs, easing: smooth },
  );
  from.media?.animate(
    [
      { translate: at(offset), filter: "blur(0)" },
      { translate: at(offset - shift), filter: blur },
    ],
    { duration: SWAP.outMs, easing: smooth },
  );
  to.panel?.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: SWAP.inMs,
    easing: enter,
  });
  to.media?.animate(
    [
      { translate: at(shift), filter: blur },
      { translate: "0 0", filter: "blur(0)" },
    ],
    { duration: SWAP.inMs, easing: enter },
  );
}
