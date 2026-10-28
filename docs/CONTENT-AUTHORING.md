# Content Authoring Guide

Use this guide when creating or editing feature cards, feature pages, homepage chapters, product documentation, or blog posts. For site-specific terms such as Post, Title, Page title, and Featured post, also read [CONTEXT.md](./CONTEXT.md).

The schemas in `src/content.config.ts` and `src/types/pages.collection.ts` are authoritative. Update this guide when those schemas change.

## Features

Every Markdown file in `src/collections/feature/` is a feature card. The optional `featurePage` field groups a feature under `/features/[slug]`. To show a feature on the homepage, reference it from a homepage chapter (see [Homepage chapters](#homepage-chapters)).

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

## Homepage chapters

The homepage (`src/pages/index.astro`) tells the product story in chapters. Each chapter is a Markdown file in `src/collections/homepage-chapter/`. The filename is the chapter ID and its anchor (`agents.md` → `#agents`), and the Markdown body is the chapter's intro paragraph. Keep IDs stable: they are the anchors, and per-chapter analytics may key on them later.

Chapter frontmatter has this shape:

```typescript
type Media =
  | {
      type: "image";
      /** Path to an image inside src/, relative to the chapter file. */
      path: string;
      alt: string;
    }
  | {
      type: "video";
      /** Path to a video inside public/. */
      path: string;
      alt: string;
    };

type ChapterItem = {
  /** ID of a file in src/collections/feature/. */
  feature?: string;
  /** Overrides; anything left out falls back to the feature. */
  title?: string; // Falls back to the feature's name.
  description?: string; // Falls back to its tagLine.
  media?: Media; // Falls back to its asset.
  /** Images only: the detail the stage zooms in on while the item shows. x and y run from 0 to 1. */
  focus?: { x: number; y: number; zoom?: number }; // zoom: 1–3, defaults to 1.5.
  /** Fill the stage edge to edge, for a capture that already has its own backdrop. */
  bleed?: boolean;
};

type HomepageChapter = {
  /** Eyebrow, glance tile label and chapter menu label. */
  name: string;
  /** Chapter menu label when name is too long for it. */
  menuLabel?: string;
  title: string;
  /** Picks the --color-chapter-* token in src/styles/main.css. */
  color: "agents" | "captures" | "network" | "testing" | "design" | "teams";
  /** The chapter's tile in the glance grid. Set exactly one of image and poster. */
  tile: {
    title: string;
    image?: string; // An image inside src/.
    poster?: string; // A public path, such as /features/posters/<video>.webp.
  };
  presentation: "tabs" | "gallery" | "closer-look";
  /** At least one, in display order. */
  items: ChapterItem[];
  links?: { label: string; href: string }[];
};
```

Follow a neighboring chapter file for a full example.

- **Items** reference features so the homepage and `/features/*` stay in step. Override only what the homepage says differently. An item without a `feature` is an inline item and must set `title`, `description` and `media` itself.
- **Media** points at the original file where it already lives, in a docs, blog or `src/assets/homepage/` folder, instead of a copy. A video's poster is `posters/<name>.webp` next to it, the same convention feature cards use. Every homepage video stays `preload="none"`, so the poster is its first frame.
- **Presentations** take the same items, so a chapter switches between `tabs`, `gallery` and `closer-look` by changing one field. `focus` and `bleed` apply to `tabs` and `closer-look`; the gallery ignores them.
- **Colors:** a new hue needs a `--color-chapter-*` token and a new `color` value in the schema. A new chapter can also reuse an existing hue.

### Page order and extras

The page template sets the order of everything. It places each chapter with a `<Chapter id="…" />` line, and its `chapters` array orders the glance tiles and the header's chapter menu. There is no order field.

- **Add a chapter:** add its file, a `<Chapter>` line where it belongs, and its ID in the `chapters` array.
- **Reorder chapters:** move the `<Chapter>` lines and the array entries together.
- **Remove a chapter:** delete its line and its array entry.
- **Change a chapter's features:** edit its `items`.

Extras such as the terminal, stat, quote, credit and Teams call-to-action are components in `src/components/home/extras/`, not content. The template passes them to a chapter as children: `slot="aside"` places one next to the stage, which only the `tabs` presentation has room for, and the default slot places it after the links. Extras keep their markup and Plausible events in code, so content never carries free-form HTML. The homepage's events are listed in [ANALYTICS.md](./ANALYTICS.md#homepage-rebuild-events).

In `src/components/home/`, import with relative paths or `@/` → `src/`. Avoid `@/components/*`: `tsconfig.json` maps it to `src/layouts/components/` and knip to `src/components/`.

The build fails on an unknown chapter or feature, an item with nothing to fall back on, a focus on a video, a tile with both or neither of `image` and `poster`, or an `aside` extra on a chapter that isn't `tabs`. A build test also fails when the `chapters` array and the `<Chapter>` lines disagree.

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
