import { marked } from "marked";

export type ReleaseDateMap = Record<string, string>;

type ChangelogSection = {
  title: string;
  html: string;
};

type MarkdownSection = {
  title: string;
  markdown: string;
};

type ChangelogRelease = {
  version: string;
  build?: string;
  date?: string;
  slug: string;
  sections: ChangelogSection[];
  summary: string;
};

type ParsedEntry = {
  version: string;
  build?: string;
  body: string;
};

const VERSION_HEADER_PATTERN = /^#\s+(\d+(?:\.\d+){1,2})(?:\s+\(([^)]+)\))?.*$/;

const SECTION_TITLES = new Map<string, string>([
  ["new", "New"],
  ["improved", "Improved"],
  ["improvement", "Improved"],
  ["improvements", "Improved"],
  ["fixed", "Fixed"],
  ["fix", "Fixed"],
  ["fixes", "Fixed"],
  ["internal", "Internal"],
]);

function slugForVersion(version: string) {
  return version.replaceAll(".", "-");
}

function normalizeSectionTitle(rawTitle: string) {
  return SECTION_TITLES.get(rawTitle.trim().toLowerCase());
}

function markdownToHtml(markdown: string) {
  return marked.parse(markdown.trim(), {
    async: false,
    gfm: true,
  }) as string;
}

function summarizeMarkdown(markdown: string) {
  return markdown
    .replaceAll(/`([^`]+)`/g, "$1")
    .replaceAll(/\*\*([^*]+)\*\*/g, "$1")
    .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replaceAll(/^[-*]\s+/gm, "")
    .replaceAll(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function parseEntries(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const entries: ParsedEntry[] = [];
  let currentHeader: RegExpMatchArray | undefined;
  let currentBody: string[] = [];

  for (const line of lines) {
    const header = line.match(VERSION_HEADER_PATTERN);
    if (header) {
      if (currentHeader) {
        entries.push({
          version: currentHeader[1],
          build: currentHeader[2],
          body: currentBody.join("\n").trim(),
        });
      }
      currentHeader = header;
      currentBody = [];
    } else if (currentHeader) {
      currentBody.push(line);
    }
  }

  if (currentHeader) {
    entries.push({
      version: currentHeader[1],
      build: currentHeader[2],
      body: currentBody.join("\n").trim(),
    });
  }

  return entries;
}

function normalizeSections(body: string): MarkdownSection[] {
  const sections = new Map<string, string[]>();
  let currentTitle = "Changes";
  let skippingMetadata = false;

  const appendLine = (title: string, line: string) => {
    const lines = sections.get(title) ?? [];
    lines.push(line);
    sections.set(title, lines);
  };

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    const boldHeading = trimmed.match(/^\*\*\s*([^*:]+)\s*:\s*\*\*$/);
    const bareHeading = trimmed.match(/^([A-Z][A-Z ]+):?$/);
    const inlineBullet = trimmed.match(/^[-*]\s+([A-Z][A-Z ]+):\s+(.+)$/);

    if (boldHeading) {
      skippingMetadata = false;
      currentTitle = normalizeSectionTitle(boldHeading[1]) ?? boldHeading[1];
      continue;
    }

    if (bareHeading) {
      const normalizedTitle = normalizeSectionTitle(bareHeading[1]);
      if (normalizedTitle) {
        skippingMetadata = false;
        currentTitle = normalizedTitle;
      } else {
        // Unrecognized all-caps headings (e.g. "NEW SUBTITLE", "NEW KEYWORDS")
        // are App Store metadata leaked into the changelog. Drop the heading
        // and everything under it until the next real section heading.
        skippingMetadata = true;
      }
      continue;
    }

    if (skippingMetadata) {
      continue;
    }

    if (inlineBullet) {
      const normalizedTitle = normalizeSectionTitle(inlineBullet[1]);
      if (normalizedTitle) {
        currentTitle = normalizedTitle;
        appendLine(currentTitle, `- ${inlineBullet[2]}`);
        continue;
      }
    }

    appendLine(currentTitle, line);
  }

  return [...sections.entries()]
    .map(([title, lines]) => ({
      title,
      markdown: lines.join("\n").trim(),
    }))
    .filter((section) => section.markdown.length > 0);
}

function mergeDuplicateVersions(entries: ParsedEntry[]) {
  const releases = new Map<string, ParsedEntry>();

  for (const entry of entries) {
    const existing = releases.get(entry.version);
    if (!existing) {
      releases.set(entry.version, entry);
      continue;
    }

    releases.set(entry.version, {
      version: entry.version,
      build: existing.build ?? entry.build,
      body: `${existing.body}\n\n${entry.body}`.trim(),
    });
  }

  return [...releases.values()];
}

export function parseChangelog(
  markdown: string,
  releaseDates: ReleaseDateMap,
): ChangelogRelease[] {
  return mergeDuplicateVersions(parseEntries(markdown)).map((entry) => {
    const markdownSections = normalizeSections(entry.body);

    return {
      version: entry.version,
      build: entry.build,
      date: releaseDates[entry.version],
      slug: slugForVersion(entry.version),
      sections: markdownSections.map((section) => ({
        title: section.title,
        html: markdownToHtml(section.markdown),
      })),
      summary: summarizeMarkdown(
        markdownSections.map((section) => section.markdown).join("\n\n"),
      ),
    };
  });
}

export function formatReleaseDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
