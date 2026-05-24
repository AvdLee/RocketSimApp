import config from "@/config/config.json";

export function toAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url, config.site.base_url).toString();
  } catch {
    return undefined;
  }
}

export function normalizeCanonicalUrl(url?: string): string {
  const resolved = toAbsoluteUrl(url) ?? config.site.base_url;
  if (config.site.trailing_slash && !resolved.endsWith("/")) {
    return `${resolved}/`;
  }
  return resolved;
}
