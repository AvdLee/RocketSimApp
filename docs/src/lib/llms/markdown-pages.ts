import config from "@/config/config.json";

import { transformPageBody } from "./page-markdown";

const BASE_URL = config.site.base_url;

/** A plain-text Markdown response for the `.md` twin of a page. */
export function markdownResponse(markdown: string): Response {
  return new Response(markdown, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

/** Collapse whitespace, so a caption wrapped over several lines reads as one. */
function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Replace each `<figure>` with one line that describes it. Images and videos
 * cannot be read as text, so the caption, or else the alt text, stays.
 */
function describeFigures(markdown: string): string {
  return markdown.replace(
    /<figure>([\s\S]*?)<\/figure>/g,
    (_match: string, inner: string) => {
      const caption = inner.match(/<figcaption>([\s\S]*?)<\/figcaption>/)?.[1];
      const alt = inner.match(/\salt="([^"]*)"/)?.[1];
      const description = collapse(caption ?? alt ?? "");
      return description ? `_Figure: ${description}_` : "";
    },
  );
}

/**
 * Make a page body readable outside the site: links to other pages become
 * absolute, and relative image paths, which only resolve on the original
 * page, become a plain line with the image's description.
 */
function makeStandalone(markdown: string): string {
  return describeFigures(markdown)
    .replace(
      /!\[([^\]]*)\]\((?!https?:\/\/|\/)[^)]*\)/g,
      (_match: string, alt: string) => (alt ? `_Image: ${alt}_` : ""),
    )
    .replace(/(!?\[[^\]]*\]\()(\/[^)\s]*)/g, `$1${BASE_URL}$2`);
}

type DocumentOptions = {
  title: string;
  description?: string;
  canonicalPath: string;
  /** Lines shown under the description, such as dates. */
  details?: string[];
  body: string;
};

/**
 * A Markdown document for a page: the title, its description as a quote, the
 * canonical URL, and the body with the same clean-up as the `llms.txt` export.
 */
export function pageDocument({
  title,
  description,
  canonicalPath,
  details = [],
  body,
}: DocumentOptions): string {
  const segments = [`# ${title}`];
  if (description) segments.push(`> ${description}`);
  segments.push(
    [`URL: ${BASE_URL}${canonicalPath}`, ...details]
      .map((line) => `- ${line}`)
      .join("\n"),
  );
  const content = makeStandalone(transformPageBody(body));
  if (content) segments.push(content);
  return `${segments.join("\n\n")}\n`;
}
