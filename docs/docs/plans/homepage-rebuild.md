# Homepage rebuild plan

Status: agreed, PR 0
Prototype: <https://claude.ai/artifact/KEcvfejMmJ6SdS9AzVDuDt> (v31)

## Goal

Rebuild the rocketsim.app homepage based on the prototype, in small PRs that can
each be reviewed and merged. Build the structure first, then fine-tune it, then
add animations. Chapters and their features are content, so we can add chapters,
and add or reorder their features, without touching components. The page template
decides where each chapter goes.

## Decisions

| Topic | Decision |
| --- | --- |
| Rollout | Build on master at an unlinked, noindex path: `/home-next/`. Swap it in at `/` in the last PR. |
| Content | A new `homepage-chapter` collection. Each chapter lists **feature references** in display order. Each item can **override** its title, description or media, and **inline items** are allowed for things that have no feature entry. |
| Page order | The page template sets the order of everything. It places each chapter by ID (`<Chapter id="agents" />`). There is no order field and no config file. |
| Styling | Tailwind v4, with prototype colors and chapter hues as theme tokens. No new `src/old`-style scoped CSS. |
| Header | A homepage-only header, with the chapter-menu swap, selected through an option on `Base.astro`. Other pages keep today's header. |
| Font | Keep the site's system font stack from `src/config/theme.json` (`-apple-system, system-ui, …`). Phase 2 tunes the type scale, weights and tracking, not the typeface. |
| Media | Use the image and video files from the prototype. Reuse existing repo assets where the file is identical. |
| Numbers | "80,000+ developers" replaces "25,000+ developers". |

## Constraints from feedback and the current site

- **Plausible event names don't change** (see [ANALYTICS.md](../../ANALYTICS.md)).
  The Download and For Teams buttons keep their existing names so we can compare
  before and after. See [Analytics mapping](#analytics-mapping).
- **Senja widgets from the live page.** The prototype's review cards and the
  "Join thousands of productive developers" wall are placeholders. Reuse the
  embeds in `src/old/components/Reviews.astro` and `SocialMediaMentions.astro`,
  loaded through `LazySenja.astro`. Move them out of `src/old/` as part of this
  work.
- **No per-chapter tracking yet.** It was left out on purpose. Chapter IDs
  (`agents`, `captures`, …) stay stable so we can add it later without changing
  anchors.
- **"Still feels AI-made"** (Antoine, Hidde). This is handled in phase 2
  (typography: scale, weights and tracking within the existing system font) and
  phase 3 (smoother animations), not in the structure PRs.
- **Build test** `homepage videos stay deferred` requires `preload="none"` on every
  `<video>` in `dist/index.html`. The new page follows the same rule from the start
  (reuse `src/lib/utils/lazyVideo.ts`), and the test covers `/home-next/` too until
  launch.
- **Quality gate:** `lint`, `format:check`, `typecheck`, `build` and `knip` must pass
  on every PR ([AGENTS.md](../../AGENTS.md)).

## Rollout: `/home-next/`

- Page: `src/pages/home-next.astro`, served at `/home-next/`.
- `seo.robots = { index: false, follow: false }`, plus an entry in the `sitemap({ filter })`
  exclusion list in `astro.config.ts`. It isn't linked from anywhere.
- It shares the live Plausible script, so events from the preview land in the same
  goals. They carry the page path, so filter on `page = /` when comparing. Only the
  team visits this page, so the noise is small.
- Launch PR: the new page moves to `src/pages/index.astro`, `/home-next/` redirects
  to `/`, and the old homepage components that nothing else uses are removed.
- Record the launch date in `ANALYTICS.md` as the before/after boundary.

## Content model

### Page order

The chapter collection is the only new content. The page template,
`src/pages/home-next.astro`, reads top to bottom like the page and places each
chapter by ID:

```astro
---
// Order of the glance tiles and the header's chapter menu.
const chapters = ["agents", "captures", "network", "testing", "design", "teams"];
---
<Base header="home" …>
  <HomeHeader chapters={chapters} />
  <Hero />
  <Glance chapters={chapters} />
  <Brands />
  <Chapter id="agents" />
  <Chapter id="captures" />
  <Reviews />
  <Chapter id="network" />
  <SplitCta />
  <Chapter id="testing" />
  <Chapter id="design" />
  <Chapter id="teams" />
  <Everyday />
  <Mentions />
  <FinalCta />
  <Newsletter />
</Base>
```

- The chapter ID is the filename and the anchor (`#agents`).
- The `chapters` array gives the glance tiles and the header menu their order. The
  resolver checks that every ID exists, and a build check fails if the array and
  the `<Chapter>` lines disagree.
- To remove a chapter, delete its line. No `draft` flag is needed.
- Copy for the fixed sections (hero, split CTA, final CTA, everyday grid, stats)
  lives in their components. The brands row keeps reading
  `src/content/sections/trusted-brands.md`.

### Chapter collection

`src/collections/homepage-chapter/<id>.md`. The filename is the anchor (`#agents`),
and the Markdown body is the chapter's intro paragraph.

```yaml
---
name: "Agentic Coding"              # eyebrow, nav label, tile label
title: "Your agent can finally see the Simulator."
color: agents                       # maps to a theme token (--color-chapter-agents)
tile:
  title: "Your AI agent sees and drives the Simulator."
  image: ../../assets/home/tiles/agents.webp
presentation: tabs                  # tabs | gallery | closer-look
items:
  - feature: 00-agentic-video       # reference('feature')
    title: "Full control"           # optional overrides
    description: "Tap, swipe, type, and press hardware buttons."
  - feature: 00-agentic-development
    title: "Browser preview"
    description: "Follow along live and mark up what to change."
  - title: "Always in sync"         # inline item, no feature entry
    description: "One-click setup for Cursor, Claude, Codex, and Xcode."
    media: { type: image, path: ../../assets/home/cli-agent-settings.webp, alt: "…" }
extras:                             # optional, typed blocks, rendered in order
  - type: terminal
    lines: ["rocketsim doctor", "rocketsim elements --agent-mode nav"]
  - type: stat
    value: "~95%"
    label: "less context than other Simulator-control tools."
links:
  - label: "Explore Agentic Coding"
    href: /features/agentic-development/
---
The built-in **CLI and Agent Skill** let Cursor, Claude, Codex, and Xcode …
```

- **Item resolution:** an override field wins, and anything not overridden falls
  back to the referenced feature (`name`, `tagLine`, `asset`). The order of
  `items` is the display order. Feature files and `/features/*` pages are not
  changed.
- **Extras** are a small, closed set of typed blocks: `terminal`, `stat`, `quote`,
  `credit` and `cta`. They cover the prototype's agents, network and teams
  chapters. New block types are added in code on purpose, so free-form HTML never
  ends up in content.
- **Presentations** are components that take the same resolved item list, so a
  chapter can switch between `tabs`, `gallery` and `closer-look` by changing one
  field.
- Document the model in [CONTENT-AUTHORING.md](../../CONTENT-AUTHORING.md) in the
  launch PR, and add an ADR (`docs/adr/0002-homepage-chapters.md`) in PR 1.

### Components

Put these in `src/components/home/`. Use relative or `@/` → `src/` imports, and
avoid the `@/components` alias: tsconfig and knip resolve it to different folders.

- `HomeHeader.astro`: logo, main links, and the Download CTA, plus the chapter layer
- `Hero.astro`, `Glance.astro`, `Brands.astro` (wraps `TrustedBrands` data)
- `Chapter.astro`: the chapter heading, intro, presentation, extras and links
- `presentations/Tabs.astro`, `Gallery.astro`, `CloserLook.astro`
- `extras/Terminal.astro`, `Stat.astro`, `Quote.astro`, `Credit.astro`, `TeamCta.astro`
- `SplitCta.astro`, `Everyday.astro`, `FinalCta.astro`
- Reused as they are: `Reviews` and `SocialMediaMentions` (Senja), `NewsLetterForm`
  (Kit), `MobileDownloadLinkForm`, `Notification`
- `src/lib/homepage.ts`: loads a chapter by ID, and resolves its items
  against the feature collection. This is the only place that knows how content
  becomes props.

The referer/`ct=` script in the current `index.astro` moves into a shared module
used by both pages, so hero install attribution keeps working on `/home-next/`.

## Analytics mapping

Event names are unchanged. `+` in class names stands for a space.

| Element (new page) | Event | Props | Today |
| --- | --- | --- | --- |
| Header "Download" | `App Store Install` | surface=landing, placement=landing-topbar, format=button | same |
| Hero "Free download" | `App Store Install` | landing-hero, button | same (the prototype dropped the class, so restore it) |
| Hero "For Teams" | `CTA: Homepage Hero - For Teams` | none | same |
| App Store rating badge | `App Store Install` | landing-app-store-reviews, badge | same |
| App Store featured badge | `App Store Install` | landing-app-store-featured, badge | same |
| Split CTA "Free download" | `App Store Install` | landing-cta-banner, button | same (was the CTA banner) |
| Split CTA "Start a 14-day Teams Trial" | `CTA: Homepage Split - Trial` | none | **new event** (no event today) |
| Teams chapter "Start a 14-day Teams Trial" | `CTA: Homepage Insights - Trial` | none | **new event** (new button) |
| Teams "Learn more about RocketSim for Teams" | `CTA: Homepage Insights - Learn More` | none | same |
| Teams second link (prototype: "Explore Build Insights") | `CTA: Homepage Mid 2 - Trial` | none | same: links to `/for-teams/`, not `/features/build-insights/` |
| Final CTA "Free download" | `App Store Install` | landing-footer, button | new placement value, same event |
| Hero "Explore features →" | `CTA: Homepage Hero - Features` | none | **retired**: the glance grid replaces the link |

The two new events go into `ANALYTICS.md` and must be added as Plausible goals
before the launch, so that their counts are real from day one.

The Teams chapter now has two links to `/for-teams/` ("Learn more" and the Mid 2
link). Phase 2 should give them distinct labels or merge the copy. Both events
stay.
| Mobile download card | existing `Mobile Download …` events | as today | same component |
| Newsletter | `Newsletter Form Conversion` | as today | same Kit form |
| First-touch referer | `Stored Referer` | as today | shared script |

## Phases and PRs

Each PR merges to master and is reviewable on `/home-next/` once deployed.

### Phase 0: plan

- **PR 0:** this document.

### Phase 1: structure

Aim for correct markup, content and layout, with basic working interaction
(clicking a tab switches it). No autoplay, no transitions.

- **PR 1: foundation and content model**
  - `/home-next/` route: noindex, excluded from the sitemap, with a build test.
  - A `header` option on `Base.astro`, plus a first `HomeHeader` (main layer only).
  - The `homepage-chapter` collection schema, the `src/lib/homepage.ts` resolver,
    and the ADR.
  - Tailwind tokens for the page palette and the chapter hues.
  - Hero, glance and brands.
  - All six chapters with real copy, each rendered as a plain static item list.
  - Media import: take the files from the prototype artifact. Reuse existing repo
    assets where the file is the same, and put new ones in `src/assets/home/`
    (images) and `public/home/` (videos, with posters in `public/home/posters/`).
- **PR 2: chapter presentations**
  - `Tabs`, `Gallery` and `CloserLook`, with click and keyboard interaction and
    ARIA tab/carousel semantics.
  - Extras: terminal, stat, quote, credit and team CTA.
  - Wire each chapter to its prototype presentation.
- **PR 3: the rest of the page**
  - Reviews and mentions (the live Senja widgets), split CTA, everyday grid, final
    CTA, newsletter and the mobile download card.
  - The chapter layer in `HomeHeader`. Functional only: it switches past the glance
    grid and highlights the current chapter.
  - Every Plausible event from the mapping table, including the two new events,
    documented in `ANALYTICS.md`.
  - Share `/home-next/` with Antoine and Hidde for a first review.

### Phase 2: fine-tuning

- **PR 4: typography.** Keep the site's system font stack. Tune the type scale,
  weights, tracking and line heights so the page reads less generic (Antoine's
  feedback), and share them as tokens with the rest of the site where they fit.
- **PR 5: visual polish**
  - Spacing and rhythm, checked at 375, 768, 1024 and 1320.
  - Accessibility: focus order, contrast, screen-reader pass.
  - Media weight: posters of 110 KB or less, responsive `widths`, no CLS from the
    Senja min-heights.
  - Lighthouse check against the current homepage.
  - Copy check against the voice rules in `CONTENT-AUTHORING.md`.
  - Feedback from the PR 3 review.

### Phase 3: animations

- **PR 6: motion**
  - Autoplay for tabs and the gallery: progress bars, pause/replay controls,
    stopping after two cycles, only while in view.
  - The header layer swap transition, and smoother easing across the page.
  - Scroll-in reveals. Decide whether they replace AOS on this page.
  - `prefers-reduced-motion` for every animation. `preload="none"` stays;
    posters cover the first frame.

### Phase 4: launch

- **PR 7: swap**
  - Move the page to `/`, redirect `/home-next/` to `/`, and point the build test at
    `dist/index.html`.
  - Remove old homepage-only components (`Features`, `TeamInsights`, `StatusBar`,
    `AppStore`, …) once `knip` confirms nothing else uses them. `Header`,
    `Navigation`, `SectionHeader`, `NewsLetterForm` and `MobileDownloadLinkForm` are
    still used by other pages.
  - Decide what happens to `showOnHomepage` on features. It becomes unused.
  - Add the launch date to `ANALYTICS.md`, and add the chapter model to
    `CONTENT-AUTHORING.md`.
  - Check that `CTA: Homepage Split - Trial` and `CTA: Homepage Insights - Trial`
    exist as Plausible goals.

### Later (optional)

- Per-chapter tracking, such as `Homepage Chapter Viewed` or tab/gallery
  interactions with a `chapter` prop, added as new Plausible goals.

## Definition of done: "flexible content"

- Adding a chapter takes one new `homepage-chapter` file, one `<Chapter>` line and
  one entry in the `chapters` array. The glance tile, header menu entry and anchor
  follow from that.
- Reordering chapters means moving `<Chapter>` lines and array entries.
- Adding, removing or reordering features in a chapter means editing its `items`
  list.
- Changing a chapter's presentation means changing one field.
- None of these need a change inside a component.

## Resolved questions

1. **Split CTA trial button:** add a new event, `CTA: Homepage Split - Trial`. The
   Teams chapter's trial button gets `CTA: Homepage Insights - Trial` for the same
   reason.
2. **`CTA: Homepage Mid 2 - Trial`:** stays on the second Teams link, which goes
   to `/for-teams/`.
3. **Hero "Explore features →":** retired, together with
   `CTA: Homepage Hero - Features`.
4. **Numbers:** 80,000+ developers.
5. **Font:** the existing system font stack.
6. **New media:** use the files from the prototype.
7. **Preview path:** `/home-next/`.
