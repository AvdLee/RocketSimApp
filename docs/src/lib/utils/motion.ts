// Whether the visitor asked for less motion. The homepage's autoplay,
// reveals and closer-look videos all start from this.
export function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
