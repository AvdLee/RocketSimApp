// Where a tabs presentation's image moves as it zooms in on its focus
// (`MediaFocus` in src/lib/homepageItems.ts). Kept free of the DOM so it can
// be unit-tested with `node --test`.

interface Size {
  width: number;
  height: number;
}

interface Rect extends Size {
  left: number;
  top: number;
}

interface Focus {
  x: number;
  y: number;
  zoom: number;
}

// Where media of `aspect` (width / height) shows when it is contained in
// `box` and centered, as `object-fit: contain` places it.
export function containedRect(box: Rect, aspect: number): Rect {
  const width = Math.min(box.width, box.height * aspect);
  const height = width / aspect;
  return {
    left: box.left + (box.width - width) / 2,
    top: box.top + (box.height - height) / 2,
    width,
    height,
  };
}

// The shift along one axis that brings the focus to the frame's middle once
// the media scales by `scale` around the frame's middle. It stops short where
// the media's edge would come into the frame: a media larger than the frame
// keeps covering it, and a smaller one stays inside it.
function shift(
  frame: number,
  start: number,
  length: number,
  focus: number,
  scale: number,
): number {
  const middle = frame / 2;
  const ideal = scale * (middle - (start + focus * length));
  const startAtEdge = scale * (middle - start) - middle;
  const endAtEdge = frame - middle + scale * (middle - (start + length));
  const low = Math.min(startAtEdge, endAtEdge);
  const high = Math.max(startAtEdge, endAtEdge);
  return Math.min(high, Math.max(low, ideal));
}

// The translate, in px, and scale that zoom `media` (its place in `frame`)
// in on `focus`. Apply them as `translate(x, y) scale(scale)` on an element
// the size of the frame, scaling around its middle.
export function focusTransform(
  frame: Size,
  media: Rect,
  focus: Focus,
): { x: number; y: number; scale: number } {
  const scale = focus.zoom;
  return {
    x: shift(frame.width, media.left, media.width, focus.x, scale),
    y: shift(frame.height, media.top, media.height, focus.y, scale),
    scale,
  };
}
