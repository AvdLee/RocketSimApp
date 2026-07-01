import type { CollectionEntry } from "astro:content";

/**
 * Shared content-level Markdown transforms.
 *
 * These mirror the conversions applied when generating `llms.txt` /
 * `llms-full.txt` so that the "Copy as Markdown" button and the LLM export
 * produce identical output. Each function is a pure string transform, letting
 * them be composed both here (for a single page, see {@link docBodyToMarkdown})
 * and in `src/integrations/llms-txt-post-process.ts` (for the combined file).
 */

/**
 * Convert custom `<Youtube>` and `<Tweet>` shortcodes to plain Markdown links.
 * Handles multi-line self-closing tags.
 */
export function convertShortcodesToLinks(text: string): string {
  let result = text.replace(/<Youtube[\s\S]*?\/>/g, (match) => {
    const id = match.match(/id="([^"]+)"/)?.[1];
    const url = match.match(/url="([^"]+)"/)?.[1];
    const title = match.match(/title="([^"]+)"/)?.[1] ?? "YouTube video";
    // The <Youtube> shortcode accepts either an `id` or a full `url`.
    const href = id ? `https://www.youtube.com/watch?v=${id}` : url;
    return href ? `[${title}](${href})` : match;
  });

  result = result.replace(/<Tweet[\s\S]*?\/>/g, (match) => {
    const idMatch = match.match(/id="([^"]+)"/);
    const id = idMatch?.[1];
    // `/i/status/` is the canonical, username-independent permalink form.
    return id ? `https://x.com/i/status/${id}` : match;
  });

  return result;
}

/** Strip leftover JSX artifacts: `import` statements and inline `<style>` blocks. */
export function stripJsxArtifacts(text: string): string {
  let result = text.replace(/^import\s+.+$/gm, "");
  result = result.replace(/<style>\{`[\s\S]*?`\}<\/style>/g, "");
  return result;
}

/**
 * Convert Starlight `:::tip/:::note/:::caution/:::danger` directives to
 * blockquotes.
 */
export function convertDirectivesToBlockquotes(text: string): string {
  // Handles 3+ colons (`:::`, `::::`) and an optional custom title in brackets
  // (`:::tip[My title]`). The closer is backreferenced so its colon count
  // matches the opener.
  return text.replace(
    /^(:{3,})(tip|note|caution|danger)(?:\[([^\]\n]*)\])?[ \t]*\n([\s\S]*?)^\1[ \t]*$/gm,
    (
      _match,
      _colons: string,
      type: string,
      customTitle: string | undefined,
      content: string,
    ) => {
      const label = customTitle?.trim()
        ? customTitle.trim()
        : type.charAt(0).toUpperCase() + type.slice(1);
      const quoted = content
        .trimEnd()
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
      return `> **${label}:** ${quoted.slice(2)}`;
    },
  );
}

/** Strip Starlight `:::tip/:::note/:::caution/:::danger` directives entirely. */
export function stripDirectives(text: string): string {
  return text.replace(
    /^(:{3,})(tip|note|caution|danger)(?:\[[^\]\n]*\])?[ \t]*\n[\s\S]*?^\1[ \t]*$/gm,
    "",
  );
}

/** Fix escaped bold-in-link markdown: `[\*\*text](url).\*\*` → `[**text**](url).` */
export function fixBoldInLink(text: string): string {
  return text.replace(/\[\\\*\\\*(.+?)\]\((.+?)\)\.\\\*\\\*/g, "[**$1**]($2).");
}

/** Collapse excessive blank lines (3+ newlines → 2). */
export function collapseBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, "\n\n");
}

/**
 * Convert a single docs entry's raw body into clean Markdown, applying the same
 * content-level transforms used for the full `llms` export (full variant:
 * shortcodes → links, JSX artifacts stripped, directives → blockquotes).
 */
function transformPageBody(body: string): string {
  let result = convertShortcodesToLinks(body);
  result = stripJsxArtifacts(result);
  result = convertDirectivesToBlockquotes(result);
  result = fixBoldInLink(result);
  result = collapseBlankLines(result);
  return result.trim();
}

/**
 * Build a complete Markdown document for a docs entry, mirroring how
 * `starlight-llms-txt`'s generator composes each page segment: a top-level
 * `# title`, an optional `> description`, then the transformed body.
 */
export function docBodyToMarkdown(entry: CollectionEntry<"docs">): string {
  const { data, body } = entry;
  const title = data.hero?.title || data.title;
  const description = data.hero?.tagline || data.description;

  const segments = [`# ${title}`];
  if (description) segments.push(`> ${description}`);

  const transformedBody = transformPageBody(body ?? "");
  if (transformedBody) segments.push(transformedBody);

  return `${segments.join("\n\n")}\n`;
}
