# Docs Agent Guidelines

## After Making Changes — Required Quality Gate

CI will **reject** the PR if any of the checks below fail. Always run every check from the `docs/` directory **before** committing and pushing:

```bash
cd docs
npm run lint          # ESLint
npm run format:check  # Prettier (fix with: npx prettier --write .)
npm run typecheck     # astro check (TypeScript)
npm run build         # Production build
npm run knip          # Unused files and dependencies
```

If `format:check` fails, run `npx prettier --write .` and commit the result.

All five commands must exit with code 0 before you push.

## Content Authoring Guide

### Features

Every `.md` file inside `src/collections/feature` will be handled as a feature. Features with `showOnHomepage: true` are displayed on the landing page. Features can also be linked to a feature page via the `featurePage` field, grouping them into category pages at `/features/[slug]`.

The Markdown files are separated into two sections:

- Frontmatter YAML containing all data other than the content following a set data structure.
- Content; allows writing markdown that gets converted into HTML when the project is built.

The frontmatter schema is as follows:

```typescript
const alignment = z.enum(["left", "right", "full-width"]);
const columnSpan = z.union([z.literal(6), z.literal(8), z.literal(12)]);

type Alignment = "left" | "right" | "full-width";
type ColumnSpan = 6 | 8 | 12;

type Image = {
  type: "image";
  /** Path to asset INSIDE src folder */
  path: string;
  alt: string;
  /** Optional caption to be shown underneath the asset (supports inline markdown) */
  caption?: string;
  /** Placement of the asset related to the content */
  alignment: Alignment;
  /** Width of the asset. Choose between 6 (50%), 8 (66.67%), or 12 (100%) */
  columnSpan: ColumnSpan;
};

type Video = {
  type: "video";
  /** Path to asset in public folder */
  path: string;
  alt: string;
  caption?: string;
  alignment: Alignment;
  columnSpan: ColumnSpan;
};

type Feature = {
  name: string;
  /** Whether this feature is shown on the homepage */
  showOnHomepage: boolean; // defaults to false
  tagLine?: string;
  /** Path to related documentation */
  docPath?: string;
  /** WordPress blog post ID for linking to the related blog post */
  blogId?: number;
  /** Fragment identifier appended to the blog post URL */
  blogFragment?: string;
  /** YouTube video URL */
  youtubeLink?: string; // must be a valid URL
  /** Links this feature to a feature page category */
  featurePage?:
    | "accessibility"
    | "app-actions"
    | "build-insights"
    | "design-comparison"
    | "networking"
    | "screenshots-recordings"
    | "simulator-camera"
    | "status-bar"
    | "user-defaults-editor";
  /** Asset can be an image or a video */
  asset: Image | Video;
};
```

**NOTE:** Video assets need to be placed in the `public/` folder, while image assets need to be placed inside the `src/` folder. Assets in the `public/` folder won't be processed during the building of the project. Astro does not support video processing. We should take care of that ourselves (filesize, quality and resolution). For images this is done automatically. Feel free to use big image assets.

An example feature:

```md
---
showOnHomepage: true
name: "Quick Actions"
featurePage: "app-actions"
asset:
  type: "video"
  path: "/features/quick-actions.mp4"
  alt: "RocketSim panel that shows configurable actions for locations, push notifications and deeplinks."
  alignment: "right"
  columnSpan: 6
---

**Configurable actions** for Deeplinks (Universal Links), Push Notifications, locations, permissions, and quick state resets.

- **Bundle Identifier based:** actions automatically show up for recent builds
- Quickly test **Locations, Push Notifications, and Deeplinks**
- Use **Reset Keychain** to clear stubborn authentication state faster
```

### Feature Pages

Feature pages are category pages that group related features together. They live in `src/collections/feature-page/` and are rendered at `/features/[slug]`. Each feature page has a hero section and an optional bento grid layout.

The available feature page slugs are: `accessibility`, `app-actions`, `build-insights`, `design-comparison`, `networking`, `screenshots-recordings`, `simulator-camera`, `status-bar`, `user-defaults-editor`.

### Documentation

Product documentation is powered by [Starlight](https://starlight.astro.build/) (an Astro integration) and lives in `src/content/docs/docs/`. Pages use `.md` or `.mdx` format with standard Starlight frontmatter (`title`, `description`).

The sidebar structure is defined in `astro.config.ts` under `starlight.sidebar`. Some sections use `autogenerate` (auto-discovers pages in a directory), others list pages explicitly by `slug` or `link`.

Current sidebar sections: Getting Started, Screenshots & Recordings, Simulator Camera, Status Bar, Design Comparison, App Actions, Networking, Build Insights, Accessibility, Agentic Development, User Defaults Editor, Settings, Support.

Images for a doc page should be placed in a subfolder next to the `.md`/`.mdx` file and referenced with relative paths (e.g., `![Alt](./subfolder/image.png)`).

When opening local docs pages in the browser:

- First update against the latest default branch, for example `git fetch origin master` followed by `git merge origin/master` or another explicit branch update strategy.
- Check any existing local dev server before using it. Confirm its process is serving from the current workspace checkout, not from another Cursor worktree or stale clone (for example, inspect `lsof -nP -iTCP:4322 -sTCP:LISTEN` and the process command).
- If the server is from another checkout, stop it and restart `npm run dev -- --host 127.0.0.1` from the current `docs/` directory before opening the page.
- Verify the served HTML contains a unique string from the change before reporting that the local page is updated.
- Always use the configured trailing slash (for example, `http://localhost:4322/docs/features/networking/network-speed-control/`) to avoid stale optimized image URLs or route mismatches.

Available shortcodes (auto-imported, no import statement needed):

- `<Youtube id="..." title="..." />` — embeds a YouTube video
- `<Accordion>` — collapsible content
- `<Tweet />` — embedded tweet

The documentation also generates `llms.txt` and `llms-full.txt` files via the `starlight-llms-txt` plugin for LLM consumption.

### Blog

The blog is powered by a headless WordPress instance. Blog posts are fetched at build time and statically rendered.

Static, hand-coded blog articles live in `src/pages/blog/<slug>.astro` and use the `Base` layout with full `seo` and `structuredData` props. Use them for SEO-targeted articles where we want full control over markup, internal linking, and image handling.

## Writing Blog Articles

When writing or editing blog articles (both static `.astro` posts in `src/pages/blog/` and WordPress drafts):

### Typographic conventions

- **Use `→` (U+2192) for menu paths and step sequences**, never `>` or `&gt;`. For example: `Settings → Accessibility → VoiceOver`, not `Settings > Accessibility > VoiceOver`. This avoids ambiguity with HTML/MDX comparison operators and reads better.
- Use em dashes (`—`, U+2014) for parenthetical asides, not double hyphens.
- Use real Unicode arrows for keyboard shortcuts in body text: `↑`, `↓`, `←`, `→`, `⏎`, `Esc`, `⌘`. Wrap them in `<strong>` when listing shortcuts.

### Voice and tone

Articles are written in Antoine van der Lee's voice. Match the existing pattern in `src/pages/blog/15-voiceover-navigator-pro-xcode-simulator-recordings.astro` and `src/pages/blog/how-to-test-voiceover-on-the-xcode-simulator.astro`:

- Direct, opinionated, practitioner voice — not academic.
- Second person (`you`) for the reader; first person (`I`) for personal asides.
- Short paragraphs (3–4 sentences max), variable sentence rhythm.
- No filler openers like "In this section, we will…" or "Let's dive into…".
- Standard closing pattern: short conclusion paragraph, then a CTA paragraph linking to the Mac App Store (with a `ct=` UTM parameter unique to the article), and end with `Thanks!`.

### SEO requirements

Every static blog article must:

- Have a unique `slug`, `title`, `description`, `publishedTime`, and `modifiedTime`.
- Keep the `<title>` tag (including ` - RocketSim` suffix) **≤ 60 characters**. If the headline you want to display is longer, declare a separate `pageTitle` constant for the visible `<h1>` and keep `title` short.
- Keep the meta `description` **≤ 160 characters**, include the primary keyword once, and read as a self-contained value proposition.
- Place the primary keyword in the URL slug, `<title>`, `<h1>`, the first paragraph, and at least one `<h2>`.
- Pass `structuredData={{ type: "article", article: { … } }}` so the `Article` + `WebPage` + `BreadcrumbList` JSON-LD graph is emitted automatically.
- Include at least two internal links (typically one to `/docs/features/<area>/<page>` and one to `/features/<area>`) and one authoritative external link (usually Apple developer documentation).
- Provide descriptive, keyword-aware `alt` text on every image. Reuse images from `src/assets/blog/<release>/`, `src/assets/features/`, or `src/content/docs/...` instead of duplicating files.
- Append a Mac App Store install link with a `ct=<article-slug>` UTM parameter in the CTA so installs from the article are attributable.
