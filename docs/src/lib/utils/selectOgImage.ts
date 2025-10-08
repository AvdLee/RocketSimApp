export function selectOgImage(
  sizes: Record<string, { width: number; height: number; source_url: string }>,
): string | undefined {
  // First, check for an exact or closest match to 1200x630 (landscape, ~1.91:1 aspect)
  const TARGET_WIDTH = 1200;
  const TARGET_HEIGHT = 630;
  const MIN_WIDTH = 600;
  const MIN_HEIGHT = 315;
  const MIN_DIM = 200;

  let best;
  let fallback;

  for (const key in sizes) {
    const { width, height, source_url } = sizes[key];
    const aspectRatio = width / height;

    // Check for perfect or almost perfect 1.91:1 aspect and minimum size
    if (
      width >= TARGET_WIDTH &&
      height >= TARGET_HEIGHT &&
      Math.abs(aspectRatio - 1.91) < 0.15
    ) {
      return source_url; // Best possible match
    }

    // Save the largest landscape above min 600x315 as fallback
    if (width >= MIN_WIDTH && height >= MIN_HEIGHT && aspectRatio > 1.5) {
      if (!best || width > best.width) {
        best = { width, height, source_url };
      }
    }

    // Grab possible image above 200x200 as secondary fallback
    if (width >= MIN_DIM && height >= MIN_DIM) {
      if (!fallback || width > fallback.width) {
        fallback = { width, height, source_url };
      }
    }
  }

  if (best) return best.source_url;
  if (fallback) return fallback.source_url;
  // As last resort, try "full" size image (if present)
  return sizes.full ? sizes.full.source_url : undefined;
}
