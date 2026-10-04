// Sizes a homepage chapter title to the height of the intro beside it
// (src/components/home/Chapter.astro). Kept free of the DOM so it can be
// unit-tested with `node --test`.

interface Bounds {
  min: number;
  max: number;
  // How close the search gets before it stops, in px.
  precision?: number;
}

// The font size, within the bounds, whose height lands closest to `target`.
// `heightAt` lays the text out at a size and returns its height. Height grows
// with the size, jumping by a line wherever the text rewraps, so the closest
// fit sits either just below or just above the size where it first overshoots.
export function fitFontSize(
  heightAt: (size: number) => number,
  target: number,
  { min, max, precision = 0.5 }: Bounds,
): number {
  if (heightAt(max) <= target) return max;
  if (heightAt(min) >= target) return min;

  let fits = min;
  let overshoots = max;
  while (overshoots - fits > precision) {
    const size = (fits + overshoots) / 2;
    if (heightAt(size) <= target) fits = size;
    else overshoots = size;
  }
  const under = target - heightAt(fits);
  const over = heightAt(overshoots) - target;
  return under <= over ? fits : overshoots;
}
