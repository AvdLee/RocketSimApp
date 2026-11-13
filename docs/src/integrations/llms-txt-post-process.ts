import type { AstroIntegration } from "astro";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  collapseBlankLines,
  convertDirectivesToBlockquotes,
  convertShortcodesToLinks,
  fixBoldInLink,
  stripDirectives,
  stripJsxArtifacts,
} from "../lib/llms/page-markdown";
import { personalProUsPriceCopy } from "../lib/pricing";

const SITE_URL = "https://www.rocketsim.app";

type BuiltPage = {
  slug: string;
  title: string;
  description: string;
  published: string;
};

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
};

function decodeEntities(text: string): string {
  return text.replace(
    /&(?:amp|lt|gt|quot|#39|#x27);/g,
    (m) => HTML_ENTITIES[m],
  );
}

/**
 * Reads the title, description and publish date of every page built under
 * `<outputDir>/<section>/<slug>/index.html`. Going through the built pages
 * keeps scheduled blog posts that are not live yet out of `llms.txt`.
 */
async function readBuiltPages(
  outputDir: string,
  section: string,
): Promise<BuiltPage[]> {
  const sectionDir = path.join(outputDir, section);
  let slugs: string[];
  try {
    slugs = (await readdir(sectionDir, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }

  const pages: BuiltPage[] = [];
  for (const slug of slugs) {
    try {
      const html = await readFile(
        path.join(sectionDir, slug, "index.html"),
        "utf-8",
      );
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
      const description = html.match(
        /<meta name="description" content="([^"]*)"/,
      )?.[1];
      const published =
        html.match(
          /<meta property="article:published_time" content="([^"]*)"/,
        )?.[1] ?? "";
      if (!title || !description) continue;
      pages.push({
        slug,
        title: decodeEntities(title).replace(/ - RocketSim$/, ""),
        description: decodeEntities(description),
        published,
      });
    } catch {
      // Not a page directory, skip.
    }
  }
  return pages;
}

function pageList(section: string, pages: BuiltPage[]): string {
  return pages
    .map(
      (page) =>
        `- [${page.title}](${SITE_URL}/${section}/${page.slug}/): ${page.description}`,
    )
    .join("\n");
}

/**
 * Post-processes the generated llms-full.txt and llms-small.txt files to:
 * - Remove the home/index page (only contains navigation components)
 * - Remove the 404 page
 * - Convert <Youtube> components to YouTube links
 * - Convert <Tweet> components to X/Twitter links
 * - Clean up leftover JSX artifacts (imports, style blocks)
 * - Strip all image references in small variant (full retains images)
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

        // Enhance llms.txt with richer metadata
        const llmsTxtPath = path.join(outputDir, "llms.txt");
        try {
          const buildDate = new Date().toISOString().split("T")[0];
          const guides = (await readBuiltPages(outputDir, "blog")).sort(
            (a, b) => b.published.localeCompare(a.published),
          );
          const overviews = (await readBuiltPages(outputDir, "features")).sort(
            (a, b) => a.slug.localeCompare(b.slug),
          );
          const enhancedLlmsTxt = `# RocketSim

> RocketSim is a macOS developer tool for testing Simulator and physical-device apps. It adds professional captures, URLSession network monitoring, app actions, physical iPhone and iPad location and deep-link testing, accessibility workflows, and a version-matched CLI plus Agent Skill for tools like Cursor, Claude, Codex, and Xcode.

Last updated: ${buildDate}
Website: https://www.rocketsim.app
Documentation: https://www.rocketsim.app/docs
GitHub: https://github.com/AvdLee/RocketSimApp
Support: support@rocketsim.app

## Key Features

- Professional screenshot and video capture with device bezels
- Physical iPhone and iPad previews, captures, app lifecycle actions, deep links, and location simulation
- Location-driven physical-device time-zone testing with Xcode 27
- URLSession network monitoring without proxy setup or custom certificates
- AI-ready network request prompt exports for Claude, ChatGPT, and other assistants
- RocketSim CLI and Agent Skill for AI coding agents
- Push notification and deep link testing
- Design comparison with pixel-perfect overlays
- Accessibility testing (Dynamic Type, VoiceOver Navigator)
- Xcode build insights and team analytics
- Network speed throttling and Simulator airplane mode

## Canonical Feature Docs

- [Network Traffic Monitoring](https://www.rocketsim.app/docs/features/networking/network-traffic-monitoring): inspect URLSession requests, responses, headers, logs, metrics, cURL commands, and AI-ready exports without proxy certificates
- [Networking Insights](https://www.rocketsim.app/docs/features/networking/networking-insights): analyze duplicate calls, caching opportunities, slow endpoints, failure spikes, and most requested URLs across sessions
- [AI Network Request Prompts](https://www.rocketsim.app/docs/features/networking/network-request-prompts): export redacted request summaries and built-in debugging prompts for AI assistants
- [Agentic Development with RocketSim](https://www.rocketsim.app/docs/features/agentic-development/): let AI coding agents inspect, navigate, and verify running iOS Simulator apps
- [RocketSim CLI](https://www.rocketsim.app/docs/features/agentic-development/rocketsim-cli): use the built-in CLI for visible elements, semantic interactions, waits, screenshots, and recordings
- [RocketSim Agent Skill](https://www.rocketsim.app/docs/features/agentic-development/agent-skill): install version-matched instructions for AI coding tools
- [rs/1 Protocol](https://www.rocketsim.app/docs/features/agentic-development/rs1-protocol): RocketSim's agent protocol with one compact JSON envelope, typed errors, and screen-state hashes
- [Physical Device Testing](https://www.rocketsim.app/docs/features/physical-devices/): mirror and test a connected iPhone or iPad with captures, Recent Builds, lifecycle actions, deep links, and locations
- [Physical-Device Location and Time-Zone Simulation](https://www.rocketsim.app/docs/features/physical-devices/location-and-time-zone-simulation/): test Core Location and automatic iOS time-zone changes on real hardware with Xcode 27
- [Deep-Link Testing on a Physical Device](https://www.rocketsim.app/docs/features/physical-devices/deep-link-testing/): run saved URL schemes and Universal Links on a connected iPhone or iPad

## Pricing

- [Pricing](https://www.rocketsim.app/pricing/): RocketSim is free to download. Personal Pro is bought in-app at the local App Store price, which differs per country; in the US it costs ${personalProUsPriceCopy.monthly} or ${personalProUsPriceCopy.yearly}. Teams costs €10 per seat per month, billed annually, with a 14-day trial. Enterprise pricing is custom. Plain Markdown version: https://www.rocketsim.app/pricing.md

## Feature Overviews

${pageList("features", overviews)}

## Guides, Comparisons, and Benchmarks

${pageList("blog", guides)}

## Markdown Versions

Every documentation page, blog post, feature overview, and the pricing page has a plain Markdown version. Replace the trailing slash of the page URL with \`.md\`, for example https://www.rocketsim.app/docs/features/agentic-development.md or https://www.rocketsim.app/blog/ios-simulator-mcp.md.

## Documentation Sets

- [Abridged documentation](https://www.rocketsim.app/llms-small.txt): compact version with non-essential content removed
- [Complete documentation](https://www.rocketsim.app/llms-full.txt): full documentation for RocketSim

## Quick Start

- [Getting Started](https://www.rocketsim.app/docs/getting-started/onboarding)
- [Product Tour](https://www.rocketsim.app/docs/getting-started/product-tour-and-quick-demos)
- [FAQ](https://www.rocketsim.app/docs/support/faq)

## Notes

- All documentation is automatically generated from the same source as the official docs
- The "Last updated" date reflects when the documentation was last built and deployed
`;
          await writeFile(llmsTxtPath, enhancedLlmsTxt, "utf-8");
        } catch {
          // File might not exist
        }
      },
    },
  };
}

function transformLlmsTxt(content: string, variant: "full" | "small"): string {
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

  // Convert <Youtube>/<Tweet> shortcodes to links and strip JSX artifacts.
  // Shared with the per-page "Copy as Markdown" export so both stay identical.
  result = convertShortcodesToLinks(result);
  result = stripJsxArtifacts(result);

  // Strip all image references for small variant only
  if (variant === "small") {
    result = result.replace(/^[ \t]*!\[.*?\]\(.*?\)\s*$/gm, "");
    result = result.replace(/!\[.*?\]\(.*?\)/g, "");
  }

  // Handle :::tip/:::note/:::caution/:::danger directives
  if (variant === "full") {
    result = convertDirectivesToBlockquotes(result);
  } else {
    result = stripDirectives(result);
  }

  result = fixBoldInLink(result);
  result = collapseBlankLines(result);

  return result;
}
