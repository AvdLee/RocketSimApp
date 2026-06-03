# RocketSim Docs Site

The marketing + documentation site for RocketSim, built with Astro/Starlight. This glossary captures the language specific to this site's content model.

## Language

### Blog

**Post**:
An authored article in the blog, stored as a single MDX entry in the `blog` content collection. One post = one co-located folder under `src/content/blog/<slug>/`.
_Avoid_: Article (reserve "article" for the structured-data / schema.org type), entry.

**Title**:
The short, SEO-facing name of a post. Used for the HTML `<title>` tag and the listing/overview card.
_Avoid_: Headline (that maps to schema.org and may differ — see Page title).

**Page title**:
The on-page `<h1>` of a post, and the structured-data `headline`. May be deliberately longer than the Title for SEO reasons (e.g. Title "How to Test VoiceOver on the Xcode Simulator" vs Page title "…Without a Physical Device"). Falls back to Title when not set.
_Avoid_: Subtitle, H1.

**Featured post**:
The single most-recent post, rendered as the large hero card at the top of the blog overview. The remaining posts render in the grid below.
_Avoid_: Highlighted, pinned (there is no manual pinning — "featured" is purely the latest by date).
