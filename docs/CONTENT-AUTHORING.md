# Content Authoring Guide

Use this guide when creating or editing feature cards, feature pages, product documentation, or blog posts. For site-specific terms such as Post, Title, Page title, and Featured post, also read [CONTEXT.md](./CONTEXT.md).

The schemas in `src/content.config.ts` and `src/types/pages.collection.ts` are authoritative. Update this guide when those schemas change.

## Features

Every Markdown file in `src/collections/feature/` is a feature card. Features with `showOnHomepage: true` appear on the landing page. The optional `featurePage` field groups a feature under `/features/[slug]`.

Feature files contain YAML frontmatter followed by Markdown content. Their frontmatter has this shape:

```typescript
type Alignment = "left" | "right" | "full-width";
type ColumnSpan = 6 | 8 | 12;

type Image = {
  type: "image";
  /** Path to an image inside src/. */
  path: string;
  alt: string;
  /** Supports inline Markdown. */
  caption?: string;
  alignment: Alignment;
  columnSpan: ColumnSpan;
};

type Video = {
  type: "video";
  /** Path to a video inside public/. */
  path: string;
  alt: string;
  caption?: string;
  alignment: Alignment;
  columnSpan: ColumnSpan;
};

type Feature = {
  name: string;
  showOnHomepage: boolean; // Defaults to false.
  tagLine?: string;
  docPath?: string;
  /** Slug of a post in src/content/blog/. */
  blogSlug?: string;
  /** Fragment appended to the blog URL. */
  blogFragment?: string;
  youtubeLink?: string;
  featurePage?:
    | "accessibility"
    | "agentic-development"
    | "app-actions"
    | "build-insights"
    | "design-comparison"
    | "networking"
    | "physical-devices"
    | "screenshots-recordings"
    | "simulator-camera"
    | "status-bar"
    | "user-defaults-editor";
  asset: Image | Video;
};
```

Example:

```md
---
showOnHomepage: true
name: "Quick Actions"
featurePage: "app-actions"
asset:
  type: "video"
  path: "/features/quick-actions.mp4"
  alt: "RocketSim panel showing configurable app actions."
  alignment: "right"
  columnSpan: 6
---

**Configurable actions** for deep links, push notifications, locations, permissions, and quick state resets.
```

Put videos in `public/` and optimize their file size, quality, and resolution before committing because Astro does not process videos. Put images in `src/`; Astro processes those automatically.

## Feature pages

Feature category pages live in `src/collections/feature-page/` and render at `/features/[slug]`. Each has a hero section and an optional bento grid. The current slugs are the `featurePage` values listed above.

The authoritative feature-page schema is `featurePageSchema` in `src/types/pages.collection.ts`. Follow a neighboring feature-page file when authoring frontmatter and verify it against that schema.

## Product documentation

Starlight documentation lives in `src/content/docs/docs/` as `.md` or `.mdx` files. Use standard Starlight frontmatter, including `title` and `description`; repository-specific extensions are defined by the `docs` collection in `src/content.config.ts`.

The sidebar is configured under `starlight.sidebar` in `astro.config.ts`. Some sections autogenerate from directories, while others list `slug` or `link` values explicitly. Check that configuration when adding, moving, or renaming a page.

Place documentation images in a subfolder beside the page and use relative paths, for example `![Alt text](./image-folder/image.png)`.

These components are auto-imported:

- `<Youtube id="..." title="..." />`
- `<Accordion>`
- `<Tweet />`

The `starlight-llms-txt` plugin also generates `llms.txt` and `llms-full.txt`.

### Local serving safety

When opening a local documentation page:

1. Start from the latest default branch using an explicit update strategy.
2. Before reusing port 4322, inspect its listener, for example with `lsof -nP -iTCP:4322 -sTCP:LISTEN`, and confirm the process serves the current checkout rather than another worktree or stale clone.
3. If it serves another checkout, stop it and run `npm run dev -- --host 127.0.0.1` from the current `docs/` directory.
4. Open the route with its configured trailing slash, for example `http://localhost:4322/docs/features/networking/network-speed-control/`.
5. Verify the served HTML contains a unique string from the current change before reporting that the page is updated.

## Blog posts

Blog posts are local MDX content. Each post is a self-contained folder at `src/content/blog/<slug>/index.mdx`; the folder name is the URL slug. Treat published post folders as immutable snapshots: keep their images inside the post folder instead of referencing documentation or shared images that may later change.

Blog frontmatter follows this schema:

```typescript
type BlogPost = {
  /** SEO title used by the HTML title and overview card. */
  title: string;
  /** Visible h1 and structured-data headline; defaults to title. */
  pageTitle?: string;
  description: string;
  publishedTime: Date | string;
  /** Defaults to publishedTime. */
  modifiedTime?: Date | string;
  /** Local image processed by Astro and used for the hero and Open Graph. */
  image?: ImageMetadata;
  imageAlt?: string;
  imageCaption?: string;
};
```

Use `src/content.config.ts` as the authoritative schema and follow current posts for MDX structure. For architectural context, see [ADR 0001](./docs/adr/0001-blog-content-local-mdx.md).

### Typography

- Use `→` (U+2192) for menu paths and step sequences, never `>` or `&gt;`: `Settings → Accessibility → VoiceOver`.
- Use em dashes (`—`, U+2014) for parenthetical asides, not double hyphens.
- Use real Unicode keyboard symbols in body text: `↑`, `↓`, `←`, `→`, `⏎`, `Esc`, and `⌘`. Wrap them in `<strong>` when listing shortcuts.

### Voice and tone

Write in Antoine van der Lee's direct, opinionated practitioner voice. Use second person (`you`) for the reader and first person (`I`) for personal asides. Keep paragraphs short, vary sentence rhythm, and avoid filler openers such as "In this section, we will…" or "Let's dive into…".

Match current posts such as:

- `src/content/blog/15-voiceover-navigator-pro-xcode-simulator-recordings/index.mdx`
- `src/content/blog/how-to-test-voiceover-on-the-xcode-simulator/index.mdx`

Close with a short conclusion followed by a RocketSim install CTA and end with `Thanks!`.

### SEO, attribution, and links

Every blog post must:

- Use a unique folder slug, `title`, `description`, and `publishedTime`; set `modifiedTime` when editing a published post.
- Keep the HTML title, including the ` - RocketSim` suffix, at 60 characters or fewer. Use `pageTitle` for a longer visible heading.
- Keep `description` at 160 characters or fewer, include the primary keyword once, and make it a self-contained value proposition.
- Put the primary keyword in the folder slug, `title`, visible h1, first paragraph, and at least one h2.
- Include at least two relevant internal links, typically one documentation page under `/docs/features/` and one feature page under `/features/`.
- Include at least one authoritative external link, usually Apple developer documentation.
- Give every image descriptive, keyword-aware alt text.
- End with a Mac App Store install CTA whose URL contains a unique `ct=<article-slug>` campaign parameter so installs remain attributable. Preserve the existing `pt` and `mt` query parameters.

The shared blog layout emits the Article, WebPage, and BreadcrumbList structured-data graph from the collection data. Verify the rendered graph instead of adding page-specific structured data.
