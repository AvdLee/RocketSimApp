import type { AstroIntegration } from "astro";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { sidebarGroups } from "../config/sidebar-groups";
import siteConfig from "../config/config.json";

const baseUrl = siteConfig.site.base_url;

interface PageInfo {
  title: string;
  slug: string;
  order: number;
  groupLabel: string;
}

const FULL_SYSTEM_HEADER = `<SYSTEM>
This is the official documentation for RocketSim, a macOS developer tool that enhances Apple's iOS Simulator.

Product: RocketSim — available on the Mac App Store
Developer: Antoine van der Lee (https://www.avanderlee.com)
Website: ${baseUrl}
Supported platforms: iOS, macOS, watchOS, and visionOS development via the Simulator

Key capabilities:
- Professional screenshot and video capture with device bezels and App Store Connect optimization
- Network traffic monitoring and debugging via RocketSim Connect
- Push notification testing without a physical device
- Deep link and universal link testing
- Location simulation with custom coordinates and predefined routes
- Design comparison with pixel-perfect overlays, grids, and rulers
- Accessibility testing: Dynamic Type, environment overrides, and VoiceOver Navigator
- Xcode build insights and team build analytics
- User Defaults real-time editor
- Network speed throttling and Simulator airplane mode
- Privacy permission management (grant, revoke, reset)

Target audience: iOS, macOS, watchOS, and visionOS developers using Xcode and the Simulator.
</SYSTEM>`;

const SMALL_SYSTEM_HEADER = `<SYSTEM>
This is a compact version of the official documentation for RocketSim, a macOS developer tool that enhances Apple's iOS Simulator with features for capturing, networking, design comparison, accessibility testing, and more.

Product: RocketSim — available on the Mac App Store
Developer: Antoine van der Lee (https://www.avanderlee.com)
Website: ${baseUrl}
Supported platforms: iOS, macOS, watchOS, and visionOS development via the Simulator
Target audience: iOS, macOS, watchOS, and visionOS developers using Xcode and the Simulator.
</SYSTEM>`;

/**
 * Post-processes the generated llms-full.txt and llms-small.txt files to:
 * - Replace the SYSTEM header with an enriched product context block
 * - Inject an auto-generated table of contents derived from the sidebar config
 * - Add cross-reference "Related" links between pages in the same sidebar group
 * - Remove the home/index page (only contains navigation components)
 * - Remove the 404 page
 * - Convert <Youtube> components to YouTube links
 * - Convert <Tweet> components to X/Twitter links
 * - Clean up leftover JSX artifacts (imports, style blocks)
 * - Strip all image references in small variant (full retains images)
 * - Convert :::tip/:::note directives to blockquotes (full) or strip them (small)
 * - Fix escaped bold-in-link markdown as safety net
 * - Differentiate llms-small.txt (strip testimonials, tips, extra whitespace)
 *
 * Also enhances llms.txt with a reference to llms-ctx.txt.
 */
export function llmsTxtPostProcess(): AstroIntegration {
  return {
    name: "llms-txt-post-process",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const outputDir = fileURLToPath(dir);
        const contentRoot = path.join(process.cwd(), "src/content/docs");
        const pages = await scanContentPages(contentRoot);

        const variants = [
          { file: "llms-full.txt", variant: "full" as const },
          { file: "llms-small.txt", variant: "small" as const },
        ];

        for (const { file, variant } of variants) {
          const filePath = path.join(outputDir, file);
          try {
            let content = await readFile(filePath, "utf-8");
            const toc = buildTableOfContents(pages, variant);
            const relatedLinks = buildRelatedLinks(pages, variant);
            content = transformLlmsTxt(content, variant, toc, relatedLinks);
            await writeFile(filePath, content, "utf-8");
          } catch {
            // File might not exist, skip
          }
        }

        await enhanceLlmsTxtIndex(outputDir);
      },
    },
  };
}

async function scanContentPages(contentRoot: string): Promise<PageInfo[]> {
  const pages: PageInfo[] = [];

  for (const group of sidebarGroups) {
    if (group.directory) {
      const dirPath = path.join(contentRoot, group.directory);
      let files: string[];
      try {
        files = await readdir(dirPath);
      } catch {
        continue;
      }

      for (const file of files.filter(
        (f) => f.endsWith(".md") || f.endsWith(".mdx"),
      )) {
        const content = await readFile(path.join(dirPath, file), "utf-8");
        const fm = extractFrontmatter(content);
        const slug = group.directory + "/" + file.replace(/\.(mdx?)$/, "");
        pages.push({
          title: fm.title,
          slug,
          order: fm.sidebarOrder ?? 999,
          groupLabel: group.label,
        });
      }
    } else if (group.slugs) {
      for (let i = 0; i < group.slugs.length; i++) {
        const slug = group.slugs[i];
        const content = await readContentFile(contentRoot, slug);
        if (!content) continue;
        const fm = extractFrontmatter(content);
        pages.push({
          title: fm.title,
          slug,
          order: i,
          groupLabel: group.label,
        });
      }
    }
  }

  return pages;
}

async function readContentFile(
  contentRoot: string,
  slug: string,
): Promise<string | null> {
  for (const ext of [".md", ".mdx"]) {
    try {
      return await readFile(path.join(contentRoot, slug + ext), "utf-8");
    } catch {
      continue;
    }
  }
  return null;
}

function extractFrontmatter(content: string): {
  title: string;
  sidebarOrder?: number;
} {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { title: "" };
  const fm = fmMatch[1];
  const titleMatch = fm.match(/title:\s*"([^"]+)"/);
  const orderMatch = fm.match(/order:\s*(\d+)/);
  return {
    title: titleMatch?.[1] ?? "",
    sidebarOrder: orderMatch ? parseInt(orderMatch[1]) : undefined,
  };
}

function buildTableOfContents(
  pages: PageInfo[],
  variant: "full" | "small",
): string {
  const groupOrder = sidebarGroups.map((g) => g.label);
  const grouped = new Map<string, PageInfo[]>();

  for (const label of groupOrder) {
    grouped.set(label, []);
  }

  for (const page of pages) {
    if (variant === "small" && page.title === "Testimonials") continue;
    grouped.get(page.groupLabel)?.push(page);
  }

  let toc = "## Table of Contents\n";

  for (const label of groupOrder) {
    const groupPages = grouped.get(label);
    if (!groupPages || groupPages.length === 0) continue;

    groupPages.sort((a, b) => a.order - b.order);

    toc += `\n### ${label}\n`;
    for (const page of groupPages) {
      toc += `- ${page.title}\n`;
    }
  }

  return toc.trimEnd();
}

function buildRelatedLinks(
  pages: PageInfo[],
  variant: "full" | "small",
): Record<string, string[]> {
  const filtered =
    variant === "small"
      ? pages.filter((p) => p.title !== "Testimonials")
      : pages;
  const grouped = new Map<string, PageInfo[]>();
  for (const page of filtered) {
    if (!grouped.has(page.groupLabel)) {
      grouped.set(page.groupLabel, []);
    }
    grouped.get(page.groupLabel)!.push(page);
  }

  const related: Record<string, string[]> = {};

  for (const groupPages of grouped.values()) {
    if (groupPages.length < 2) continue;

    for (const page of groupPages) {
      related[page.title] = groupPages
        .filter((p) => p.slug !== page.slug)
        .map((p) => `[${p.title}](/${p.slug})`);
    }
  }

  return related;
}

function addRelatedLinks(
  page: string,
  relatedLinks: Record<string, string[]>,
): string {
  const titleMatch = page.match(/^# (.+)/);
  if (!titleMatch) return page;
  const title = titleMatch[1].trim();

  const related = relatedLinks[title];
  if (related && related.length > 0) {
    return (
      page.trimEnd() +
      "\n\n### Related\n" +
      related.map((r) => `- ${r}`).join("\n") +
      "\n"
    );
  }
  return page;
}

async function enhanceLlmsTxtIndex(outputDir: string): Promise<void> {
  const llmsTxtPath = path.join(outputDir, "llms.txt");
  try {
    const buildDate = new Date().toISOString().split("T")[0];
    const enhancedLlmsTxt = `# RocketSim

> RocketSim is a macOS developer tool that enhances Apple's iOS Simulator with professional-grade features for capturing, debugging, testing, and design validation. Available on the Mac App Store for iOS, macOS, watchOS, and visionOS developers.

Last updated: ${buildDate}
Website: ${baseUrl}
Documentation: ${baseUrl}/docs
GitHub: https://github.com/AvdLee/RocketSimApp
Support: support@rocketsim.app

## Key Features

- Professional screenshot and video capture with device bezels
- Network traffic monitoring and debugging
- Push notification and deep link testing
- Design comparison with pixel-perfect overlays
- Accessibility testing (Dynamic Type, VoiceOver Navigator)
- Xcode build insights and team analytics
- Network speed throttling and Simulator airplane mode

## Context

- [Product context](${baseUrl}/llms-ctx.txt): concise product overview, feature summary, and technical details for RocketSim

## Documentation Sets

- [Abridged documentation](${baseUrl}/llms-small.txt): compact version with non-essential content removed
- [Complete documentation](${baseUrl}/llms-full.txt): full documentation for RocketSim

## Quick Start

- [Getting Started](${baseUrl}/docs/getting-started/onboarding)
- [Product Tour](${baseUrl}/docs/getting-started/product-tour-and-quick-demos)
- [FAQ](${baseUrl}/docs/support/faq)

## Notes

- All documentation is automatically generated from the same source as the official docs
- The "Last updated" date reflects when the documentation was last built and deployed
`;
    await writeFile(llmsTxtPath, enhancedLlmsTxt, "utf-8");
  } catch {
    // File might not exist
  }
}

function transformLlmsTxt(
  content: string,
  variant: "full" | "small",
  toc: string,
  relatedLinks: Record<string, string[]>,
): string {
  // Extract and discard the original <SYSTEM> header
  const systemMatch = content.match(/^(<SYSTEM>[\s\S]*?<\/SYSTEM>\n\n)/);
  const body = systemMatch ? content.slice(systemMatch[1].length) : content;

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

  // Add cross-reference links to relevant pages
  const pagesWithRelated = filteredPages.map((page) =>
    addRelatedLinks(page, relatedLinks),
  );

  // Assemble with enriched SYSTEM header and TOC
  const newSystemHeader =
    variant === "full" ? FULL_SYSTEM_HEADER : SMALL_SYSTEM_HEADER;

  let result =
    newSystemHeader + "\n\n" + toc + "\n\n" + pagesWithRelated.join("");

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

  // Strip all image references for small variant only
  if (variant === "small") {
    result = result.replace(/^[ \t]*!\[.*?\]\(.*?\)\s*$/gm, "");
    result = result.replace(/!\[.*?\]\(.*?\)/g, "");
  }

  // Handle :::tip/:::note/:::caution/:::danger directives
  if (variant === "full") {
    // Convert to blockquotes
    result = result.replace(
      /^:::(tip|note|caution|danger)\n([\s\S]*?)^:::/gm,
      (_match, type: string, contentBlock: string) => {
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        const quoted = contentBlock
          .trimEnd()
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n");
        return `> **${label}:** ${quoted.slice(2)}`;
      },
    );
  } else {
    // Strip directives entirely for small variant
    result = result.replace(
      /^:::(tip|note|caution|danger)\n[\s\S]*?^:::/gm,
      "",
    );
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
