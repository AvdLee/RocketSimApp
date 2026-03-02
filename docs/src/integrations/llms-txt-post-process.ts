import type { AstroIntegration } from "astro";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const FULL_SYSTEM_HEADER = `<SYSTEM>
This is the official documentation for RocketSim, a macOS developer tool that enhances Apple's iOS Simulator.

Product: RocketSim — available on the Mac App Store
Developer: Antoine van der Lee (https://www.avanderlee.com)
Website: https://www.rocketsim.app
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
Website: https://www.rocketsim.app
Supported platforms: iOS, macOS, watchOS, and visionOS development via the Simulator
Target audience: iOS, macOS, watchOS, and visionOS developers using Xcode and the Simulator.
</SYSTEM>`;

const TABLE_OF_CONTENTS = `## Table of Contents

### Getting Started
- Onboarding
- Product Tour & Quick Demos
- Configuring App Actions
- Setting Up RocketSim Connect
- How Large Teams Use RocketSim
- Additional Resources
- Testimonials

### Screenshots & Recordings
- Taking Screenshots
- Creating Recordings
- Floating Thumbnail
- App Store Connect Optimization
- Touch Indicators
- 120 FPS Recordings

### Simulator Camera
- Simulator Camera Support

### Status Bar
- Status Bar Appearance

### Design Comparison
- Comparing Designs
- Grids & Rulers
- Magnifier
- Slow Animations

### App Actions
- App Directory Access
- Deep Links & Universal Links
- Location Simulation
- Privacy & Permissions
- Push Notifications
- Quick Actions

### Networking
- Network Speed Control & Simulator Airplane Mode
- Network Traffic Monitoring
- Networking Insights

### Build Insights
- Build Insights
- Team Build Insights

### Accessibility
- Environment Overrides
- Toggles & Dynamic Text
- VoiceOver Navigator

### Other Features
- User Defaults Editor

### Settings
- Shortcuts
- Side Window

### Support
- FAQ
- Reporting An Issue
- Requesting A Feature`;

const RELATED_LINKS: Record<string, string[]> = {
  "Taking Screenshots": [
    "[Creating Recordings](/docs/features/capturing/recordings)",
    "[App Store Connect Optimization](/docs/features/capturing/app-store-connect-optimization)",
    "[Floating Thumbnail](/docs/features/capturing/floating-thumbnail)",
  ],
  "Creating Recordings": [
    "[Taking Screenshots](/docs/features/capturing/screenshots)",
    "[Touch Indicators](/docs/features/capturing/touch-indicators)",
    "[120 FPS Recordings](/docs/features/capturing/120-fps-recordings)",
  ],
  "Network Traffic Monitoring": [
    "[Setting Up RocketSim Connect](/docs/getting-started/setting-up-rocketsim-connect)",
    "[Networking Insights](/docs/features/networking/networking-insights)",
    "[Network Speed Control](/docs/features/networking/network-speed-control)",
  ],
  "Networking Insights": [
    "[Network Traffic Monitoring](/docs/features/networking/network-traffic-monitoring)",
    "[Setting Up RocketSim Connect](/docs/getting-started/setting-up-rocketsim-connect)",
  ],
  "Network Speed Control & Simulator Airplane Mode": [
    "[Network Traffic Monitoring](/docs/features/networking/network-traffic-monitoring)",
    "[Networking Insights](/docs/features/networking/networking-insights)",
  ],
  "Push Notifications": [
    "[Configuring App Actions](/docs/getting-started/configuring-app-actions)",
    "[Deep Links & Universal Links](/docs/features/app-actions/deeplinks-universal-links)",
  ],
  "Deeplinks (Universal Links)": [
    "[Configuring App Actions](/docs/getting-started/configuring-app-actions)",
    "[Push Notifications](/docs/features/app-actions/push-notifications)",
  ],
  "Build Insights": [
    "[Team Build Insights](/docs/features/build-insights/team-build-insights)",
  ],
  "Team Build Insights": [
    "[Build Insights](/docs/features/build-insights/build-insights)",
    "[How Large Teams Use RocketSim](/docs/getting-started/how-large-teams-use-rocketsim)",
  ],
  "Comparing Designs": [
    "[Grids & Rulers](/docs/features/design-comparison/grids-and-rulers)",
    "[Magnifier](/docs/features/design-comparison/magnifier)",
  ],
  "Environment Overrides": [
    "[Toggles & Dynamic Text](/docs/features/accessibility/toggles-and-dynamic-text)",
    "[VoiceOver Navigator](/docs/features/accessibility/voiceover-navigator)",
  ],
  "VoiceOver Navigator": [
    "[Environment Overrides](/docs/features/accessibility/environment-overrides)",
    "[Toggles & Dynamic Text](/docs/features/accessibility/toggles-and-dynamic-text)",
  ],
  "Simulator Camera Support": [
    "[Setting Up RocketSim Connect](/docs/getting-started/setting-up-rocketsim-connect)",
  ],
  "Setting Up RocketSim Connect": [
    "[Network Traffic Monitoring](/docs/features/networking/network-traffic-monitoring)",
    "[Simulator Camera Support](/docs/features/capturing/simulator-camera-support)",
  ],
};

/**
 * Post-processes the generated llms-full.txt and llms-small.txt files to:
 * - Replace the SYSTEM header with an enriched product context block
 * - Inject a table of contents for navigation
 * - Add cross-reference "Related" links between related pages
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

        await enhanceLlmsTxtIndex(outputDir);
      },
    },
  };
}

async function enhanceLlmsTxtIndex(outputDir: string): Promise<void> {
  const llmsTxtPath = path.join(outputDir, "llms.txt");
  try {
    const buildDate = new Date().toISOString().split("T")[0];
    const enhancedLlmsTxt = `# RocketSim

> RocketSim is a macOS developer tool that enhances Apple's iOS Simulator with professional-grade features for capturing, debugging, testing, and design validation. Available on the Mac App Store for iOS, macOS, watchOS, and visionOS developers.

Last updated: ${buildDate}
Website: https://www.rocketsim.app
Documentation: https://www.rocketsim.app/docs
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

- [Product context](https://www.rocketsim.app/llms-ctx.txt): concise product overview, feature summary, and technical details for RocketSim

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
}

function addRelatedLinks(page: string): string {
  const titleMatch = page.match(/^# (.+)/);
  if (!titleMatch) return page;
  const title = titleMatch[1].trim();

  const related = RELATED_LINKS[title];
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

function transformLlmsTxt(content: string, variant: "full" | "small"): string {
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
  const pagesWithRelated = filteredPages.map(addRelatedLinks);

  // Assemble with enriched SYSTEM header and TOC
  const newSystemHeader =
    variant === "full" ? FULL_SYSTEM_HEADER : SMALL_SYSTEM_HEADER;
  let result =
    newSystemHeader +
    "\n\n" +
    TABLE_OF_CONTENTS +
    "\n\n" +
    pagesWithRelated.join("");

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
