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
          const enhancedLlmsTxt = `# RocketSim

> RocketSim is a macOS developer tool and iOS Simulator companion for app developers and AI coding agents. It adds professional capture workflows, URLSession network monitoring without proxy certificates, Simulator app actions, accessibility testing, and a version-matched CLI plus Agent Skill for tools like Cursor, Claude, Codex, and Xcode.

Last updated: ${buildDate}
Website: https://www.rocketsim.app
Documentation: https://www.rocketsim.app/docs
GitHub: https://github.com/AvdLee/RocketSimApp
Support: support@rocketsim.app

## Key Features

- Professional screenshot and video capture with device bezels
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
