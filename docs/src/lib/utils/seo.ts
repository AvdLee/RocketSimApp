import config from "@/config/config.json";

const SAFE_SCHEMES = new Set(["http:", "https:"]);

/**
 * Resolve a possibly-relative URL into an absolute one using `config.site.base_url`
 * as the base. Returns `undefined` for empty, invalid, or unsafe-scheme inputs.
 *
 * Unsafe schemes (e.g. `javascript:`, `data:`, `mailto:`, `tel:`) are rejected so
 * we never accidentally surface them through SEO meta tags or JSON-LD.
 *
 * Kept internal because all current callers want either the HTTPS-upgraded
 * variant (`toAbsoluteSecureUrl`) or the canonical-normalized variant
 * (`normalizeCanonicalUrl`).
 */
function toAbsoluteUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  try {
    const resolved = new URL(url, config.site.base_url);
    if (!SAFE_SCHEMES.has(resolved.protocol)) return undefined;
    return resolved.toString();
  } catch {
    return undefined;
  }
}

/**
 * Same as `toAbsoluteUrl` but upgrades `http://` to `https://` so OG/Twitter
 * crawlers (which prefer secure assets) never receive an insecure URL.
 */
export function toAbsoluteSecureUrl(url?: string | null): string | undefined {
  const resolved = toAbsoluteUrl(url);
  if (!resolved) return undefined;
  return resolved.startsWith("http://")
    ? `https://${resolved.slice("http://".length)}`
    : resolved;
}

/**
 * Normalize a canonical URL: resolve relatives against the site origin and
 * append a trailing slash to the path (preserving any query string and
 * fragment) when the site is configured for it. Falls back to the site
 * origin when no URL is provided.
 */
export function normalizeCanonicalUrl(url?: string | null): string {
  const resolved = toAbsoluteUrl(url) ?? config.site.base_url;
  if (!config.site.trailing_slash) return resolved;
  try {
    const parsed = new URL(resolved);
    if (!parsed.pathname.endsWith("/")) {
      parsed.pathname = `${parsed.pathname}/`;
    }
    return parsed.toString();
  } catch {
    return resolved.endsWith("/") ? resolved : `${resolved}/`;
  }
}

/**
 * Build an absolute URL from a sequence of path segments, applying trailing
 * slash policy. Empty segments are ignored.
 *
 * @example
 *   pathToAbsoluteUrl(["docs", "getting-started"])
 *   // => "https://www.rocketsim.app/docs/getting-started/"
 *
 * @public Consumed by the Starlight `Head.astro` override; knip's astro plugin
 *   marks Starlight component overrides as `ignore exports`, which currently
 *   prevents its import statements from counting toward upstream usage.
 */
export function pathToAbsoluteUrl(segments: string[]): string {
  const path = segments.filter(Boolean).join("/");
  return normalizeCanonicalUrl(path ? `/${path}` : "/");
}

/**
 * Convert a kebab-case URL slug into a human-readable, title-cased label
 * suitable for breadcrumb display (e.g. "getting-started" → "Getting Started").
 *
 * @public Consumed by the Starlight `Head.astro` override; see
 *   `pathToAbsoluteUrl` for why this needs to be explicitly marked public.
 */
export function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Safe wrapper around `decodeURIComponent` that returns the raw input when
 * decoding fails (e.g. on malformed `%`-sequences).
 *
 * @public Consumed by the Starlight `Head.astro` override; see
 *   `pathToAbsoluteUrl` for why this needs to be explicitly marked public.
 */
export function safeDecodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
