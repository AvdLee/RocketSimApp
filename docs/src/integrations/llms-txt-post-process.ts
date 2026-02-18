import type { AstroIntegration } from "astro";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Post-processes the generated llms-full.txt and llms-small.txt files to:
 * - Remove the home/index page (only contains navigation components)
 * - Remove the 404 page
 * - Convert <Youtube> components to YouTube links
 * - Convert <Tweet> components to X/Twitter links
 * - Clean up leftover JSX artifacts (imports, style blocks)
 * - Strip all image references (LLMs can't view images from .txt)
 * - Convert :::tip/:::note directives to blockquotes (full) or strip them (small)
 * - Fix escaped bold-in-link markdown as safety net
 * - Differentiate llms-small.txt (strip testimonials, tips, extra whitespace)
 */
export function llmsTxtPostProcess(): AstroIntegration {
  return {
    name: "llms-txt-post-process",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const outputDir = fileURLToPath(dir);

        const variants = [
          { file: "llms-full.txt", variant: "full" as const },
          { file: "llms-small.txt", variant: "small" as const },
        ];

        for (const { file, variant } of variants) {
          const filePath = path.join(outputDir, file);
          try {
            let content = await readFile(filePath, "utf-8");
            content = transformLlmsTxt(content, variant);
            await writeFile(filePath, content, "utf-8");
          } catch {
            // File might not exist, skip
          }
        }
      },
    },
  };
}

function transformLlmsTxt(
  content: string,
  variant: "full" | "small",
): string {
  // Preserve the <SYSTEM> header
  const systemMatch = content.match(/^(<SYSTEM>[\s\S]*?<\/SYSTEM>\n\n)/);
  const systemHeader = systemMatch?.[1] ?? "";
  const body = systemHeader ? content.slice(systemHeader.length) : content;

  // Split into page sections (each starts with "# Title")
  const pages = body.split(/(?=^# )/m);

  // Filter out unwanted pages
  const filteredPages = pages.filter((page) => {
    const titleMatch = page.match(/^# (.+)/);
    if (!titleMatch) return true;
    const title = titleMatch[1].trim();

    // Always filter out the home page and 404 page
    if (title === "RocketSim Docs" || title === "404") return false;

    // For small variant, also strip the Testimonials page
    if (variant === "small" && title === "Testimonials") return false;

    return true;
  });

  let result = systemHeader + filteredPages.join("");

  // Convert <Youtube> components to markdown links (handles multi-line tags)
  result = result.replace(/<Youtube[\s\S]*?\/>/g, (match) => {
    const idMatch = match.match(/id="([^"]+)"/);
    const titleMatch = match.match(/title="([^"]+)"/);
    const id = idMatch?.[1];
    const title = titleMatch?.[1] ?? "YouTube video";
    return id ? `[${title}](https://www.youtube.com/watch?v=${id})` : match;
  });

  // Convert <Tweet> components to X links
  result = result.replace(/<Tweet[\s\S]*?\/>/g, (match) => {
    const idMatch = match.match(/id="([^"]+)"/);
    const id = idMatch?.[1];
    return id ? `https://x.com/x/status/${id}` : match;
  });

  // Remove import statements
  result = result.replace(/^import\s+.+$/gm, "");

  // Remove style blocks
  result = result.replace(/<style>\{`[\s\S]*?`\}<\/style>/g, "");

  // Strip all image references (whole-line and inline)
  result = result.replace(/^[ \t]*!\[.*?\]\(.*?\)\s*$/gm, "");
  result = result.replace(/!\[.*?\]\(.*?\)/g, "");

  // Handle :::tip/:::note/:::caution/:::danger directives
  if (variant === "full") {
    // Convert to blockquotes
    result = result.replace(
      /^:::(tip|note|caution|danger)\n([\s\S]*?)^:::/gm,
      (_match, type: string, content: string) => {
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        const quoted = content
          .trimEnd()
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n");
        return `> **${label}:** ${quoted.slice(2)}`;
      },
    );
  } else {
    // Strip directives entirely for small variant
    result = result.replace(/^:::(tip|note|caution|danger)\n[\s\S]*?^:::/gm, "");
  }

  // Fix escaped bold-in-link markdown: [\*\*text](url).\*\* → [**text**](url).
  result = result.replace(
    /\[\\\*\\\*(.+?)\]\((.+?)\)\.\\\*\\\*/g,
    "[**$1**]($2).",
  );

  // Collapse excessive blank lines (3+ newlines → 2)
  result = result.replace(/\n{3,}/g, "\n\n");

  return result;
}
