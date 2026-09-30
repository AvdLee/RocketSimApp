# Homepage chapters as content, placed by the page template

The rebuilt homepage (plan: `docs/docs/plans/homepage-rebuild.md`) is a series of feature **chapters** (Agentic Coding, Screenshots & Videos, Network Monitoring, …). Each chapter is a file in the `homepage-chapter` collection, `src/collections/homepage-chapter/<id>.md`. The filename is the chapter ID and its anchor (`#agents`), and the Markdown body is the intro paragraph. A chapter lists **items** in display order. An item references a `feature` entry and may override its `title`, `description` or `media`, or it is an inline item with all three set. The page template places each chapter by ID (`<Chapter id="agents" />`), and one `chapters` array in the template orders the glance tiles.

**Why:** chapters and their features change more often than the page layout. Keeping them in content means adding a chapter, or adding and reordering its features, needs no component change. Referencing feature entries reuses their copy and media, so a screenshot is updated in one place. Letting the template place chapters, rather than an `order` field or a config file, keeps the page readable from top to bottom and lets fixed sections (reviews, split CTA) sit between chapters without extra machinery.

## Consequences

- Item resolution lives in `src/lib/homepageItems.ts`, which is pure and unit-tested (`tests/homepage-items.test.js`). `src/lib/homepage.ts` loads the entries and is the only place that knows how content becomes props. An unknown chapter or feature, or an item with nothing to fall back on, fails the build.
- The `chapters` array and the `<Chapter>` lines must agree. A build-output test compares the glance tiles with the chapter sections.
- Items without a feature entry point at the original image where it already lives (a docs or blog folder) instead of a copy. A docs screenshot update therefore also changes the homepage. That is intended: the homepage shows the current product.
- Chapter extras (terminal, stat, quote, credit, team CTA) are not content. They are components the page adds to a chapter, so free-form HTML never ends up in content.
- Presentations (`tabs`, `gallery`, `closer-look`) take the same resolved item list, so a chapter switches presentation by changing one field.
- A chapter's `color` picks a `--color-chapter-*` theme token from `src/styles/main.css`. A new hue needs a token and an enum value.

## Considered options

- **An `order` field or a config file for chapter order**: rejected. The order would be split between content and the template, and fixed sections would need their own order entries.
- **Copying feature copy and media into each chapter**: rejected. The homepage and `/features/*` would drift apart.
- **Extras as typed content blocks**: rejected. Few chapters need them, and components keep their markup and analytics in code.
