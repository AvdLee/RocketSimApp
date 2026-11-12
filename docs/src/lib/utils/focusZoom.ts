// Where a tabs presentation's image moves as it zooms in on its focus
// (`MediaFocus` in src/lib/homepageItems.ts). Kept free of the DOM so it can
// be unit-tested with `node --test`.

interface Size {
  width: number;
  height: number;
}

interface Focus {
  x: number;
  y: number;
  zoom: number;
}

// The shift along one axis that brings the focus to the middle once the image
// scales by `scale` around its middle. It stops short where the image's edge
// would come into view.
function shift(length: number, focus: number, scale: number): number {
  const middle = length / 2;
  const ideal = scale * (middle - focus * length);
  const limit = middle * (scale - 1);
  return Math.min(limit, Math.max(-limit, ideal));
}

// The translate, in px, and scale that zoom an image of `size` in on
// `focus`. Apply them as `translate(x, y) scale(scale)` on the image, scaling
// around its middle: it zooms within the space it takes up.
export function focusTransform(
  size: Size,
  focus: Focus,
): { x: number; y: number; scale: number } {
  const scale = focus.zoom;
  return {
    x: shift(size.width, focus.x, scale),
    y: shift(size.height, focus.y, scale),
    scale,
  };
}
