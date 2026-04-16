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

Available shortcodes (auto-imported, no import statement needed):
- `<Youtube id="..." title="..." />` — embeds a YouTube video
- `<Accordion>` — collapsible content
- `<Tweet />` — embedded tweet

The documentation also generates `llms.txt` and `llms-full.txt` files via the `starlight-llms-txt` plugin for LLM consumption.

### Blog

The blog is powered by a headless WordPress instance. Blog posts are fetched at build time and statically rendered.
