// The intrinsic size of an SVG, for the width and height of an `<img>` that
// shows it. Astro doesn't process SVGs in `public/`, such as the brand logos,
// so the page reads their size from the markup. Pure, so it is unit-tested.
// `<img>` width and height take whole pixels.
const rounded = (width: number, height: number) => ({
  width: Math.round(width),
  height: Math.round(height),
});

export function svgSize(svg: string, name = "The SVG") {
  const tag = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";
  const attribute = (key: string) =>
    tag.match(new RegExp(`\\s${key}="([^"]*)"`))?.[1];

  const length = (value: string | undefined) =>
    value && /^[\d.]+(px)?$/.test(value) ? parseFloat(value) : undefined;
  const width = length(attribute("width"));
  const height = length(attribute("height"));
  if (width && height) return rounded(width, height);

  const viewBox = attribute("viewBox")
    ?.split(/[\s,]+/)
    .map(Number);
  if (viewBox?.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
    return rounded(viewBox[2], viewBox[3]);
  }
  throw new Error(`${name} has no width, height or viewBox.`);
}
