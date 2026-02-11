import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DOCS_DIR = join(__dirname, "..", "src", "content", "docs", "docs");
const PUBLIC_DIR = join(__dirname, "..", "public");
const SITE_URL = "https://www.rocketsim.app";

const DESCRIPTION =
  "RocketSim enhances the iOS Simulator with features for capturing screenshots and recordings, comparing designs, testing push notifications, deep links, location simulation, network speed control, accessibility toggles, and more.";

// Sidebar section order matching astro.config.ts
const SECTIONS = [
  { label: "Getting Started", dir: "getting-started" },
  { label: "Capturing", dir: "features/capturing" },
  { label: "Design Comparison", dir: "features/design-comparison" },
  { label: "App Actions", dir: "features/app-actions" },
  { label: "RocketSim Connect", dir: "features/rocketsim-connect" },
  { label: "Accessibility", dir: "features/accessibility" },
  { label: "Appearance", dir: "appearance" },
  { label: "Support", dir: "support" },
];

// Files to exclude
const EXCLUDED_FILES = new Set(["404.md"]);

function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if ([".md", ".mdx"].includes(extname(entry))) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { attributes: {}, body: content };

  const body = content.slice(match[0].length).trim();
  const attributes = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (m) attributes[m[1]] = m[2];
  }
  return { attributes, body };
}

function cleanContent(body) {
  return (
    body
      // Remove import statements
      .replace(/^import\s+.*$/gm, "")
      // Remove self-closing JSX/MDX components: <Component ... />
      .replace(/<\w+(?:\s[\s\S]*?)?\/>/g, "")
      // Remove block JSX/MDX components: <Component ...>...</Component>
      .replace(/<(\w+)(?:\s[\s\S]*?)?>[\s\S]*?<\/\1>/g, "")
      // Remove standalone opening/closing HTML/JSX tags
      .replace(/^<\/?\w+[^>]*>\s*$/gm, "")
      // Remove markdown images
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Remove Starlight asides (:::tip, :::note, etc.)
      .replace(/^:::\w+$/gm, "")
      .replace(/^:::$/gm, "")
      // Collapse multiple blank lines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function fileToUrl(filePath) {
  const rel = relative(DOCS_DIR, filePath)
    .replace(/\.(md|mdx)$/, "")
    .replace(/\/index$/, "");
  return `${SITE_URL}/docs/${rel}`;
}

function generate() {
  const allFiles = collectFiles(DOCS_DIR);

  // Group files by section
  const sectionFiles = new Map();
  for (const section of SECTIONS) {
    sectionFiles.set(section.dir, []);
  }

  for (const filePath of allFiles) {
    const rel = relative(DOCS_DIR, filePath);
    const fileName = rel.split("/").pop();

    // Skip excluded files and the index page
    if (EXCLUDED_FILES.has(fileName) || rel === "index.mdx") continue;

    for (const section of SECTIONS) {
      if (rel.startsWith(section.dir + "/")) {
        sectionFiles.get(section.dir).push(filePath);
        break;
      }
    }
  }

  // --- Generate llms.txt ---
  const llmsTxtLines = [`# RocketSim`, ``, `> ${DESCRIPTION}`, ``];

  for (const section of SECTIONS) {
    const files = sectionFiles.get(section.dir);
    if (files.length === 0) continue;

    llmsTxtLines.push(`## ${section.label}`, ``);

    for (const filePath of files) {
      const content = readFileSync(filePath, "utf-8");
      const { attributes } = parseFrontmatter(content);
      const title = attributes.title || relative(DOCS_DIR, filePath);
      const desc = attributes.description || "";
      const url = fileToUrl(filePath);
      llmsTxtLines.push(`- [${title}](${url}): ${desc}`);
    }
    llmsTxtLines.push(``);
  }

  // --- Generate llms-full.txt ---
  const llmsFullLines = [`# RocketSim`, ``, `> ${DESCRIPTION}`, ``];

  for (const section of SECTIONS) {
    const files = sectionFiles.get(section.dir);
    if (files.length === 0) continue;

    for (const filePath of files) {
      const content = readFileSync(filePath, "utf-8");
      const { attributes, body } = parseFrontmatter(content);
      const title = attributes.title || relative(DOCS_DIR, filePath);
      const cleaned = cleanContent(body);

      if (cleaned.length === 0) continue;

      llmsFullLines.push(`---`, ``, `## ${title}`, ``);
      llmsFullLines.push(cleaned, ``);
    }
  }

  const llmsTxt = llmsTxtLines.join("\n");
  const llmsFullTxt = llmsFullLines.join("\n");

  writeFileSync(join(PUBLIC_DIR, "llms.txt"), llmsTxt);
  writeFileSync(join(PUBLIC_DIR, "llms-full.txt"), llmsFullTxt);

  const docCount = [...sectionFiles.values()].flat().length;
  console.log(
    `Generated llms.txt (${llmsTxt.length} bytes) and llms-full.txt (${llmsFullTxt.length} bytes) from ${docCount} docs`,
  );
}

generate();
