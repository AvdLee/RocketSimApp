import { glob } from "astro/loaders";
import { z, defineCollection, reference } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

import {
  featurePageSchema,
  featuresPageCollection,
  pricingCollection,
  privacyCollection,
  teamInsightsCollection,
  termsCollection,
  thankYouCollection,
} from "./types/pages.collection";
import {
  comparePlansSectionCollection,
  ctaSectionCollection,
  faqSectionCollection,
  pricingSectionCollection,
  statisticsSectionCollection,
  trustedBrandsSectionCollection,
} from "./types/sections.collections";

const alignment = z.enum(["left", "right", "full-width"]);
const columnSpan = z.union([z.literal(6), z.literal(8), z.literal(12)]);

const feature = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/collections/feature" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      showOnHomepage: z.boolean().default(false),
      tagLine: z.string().optional(),
      docPath: z.string().optional(),
      blogSlug: z.string().optional(),
      blogFragment: z.string().optional(),
      youtubeLink: z.string().url().optional(),
      featurePage: z
        .enum([
          "accessibility",
          "agentic-development",
          "app-actions",
          "build-insights",
          "design-comparison",
          "networking",
          "physical-devices",
          "screenshots-recordings",
          "simulator-camera",
          "status-bar",
          "user-defaults-editor",
        ])
        .optional(),
      asset: z.discriminatedUnion("type", [
        z.object({
          type: z.literal("image"),
          path: image(),
          alt: z.string(),
          caption: z.string().optional(),
          alignment,
          columnSpan,
        }),
        z.object({
          type: z.literal("video"),
          path: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
          alignment,
          columnSpan,
        }),
      ]),
    }),
});

// One file per homepage chapter; the filename is the chapter ID and anchor.
// See docs/adr/0002-homepage-chapters.md.
const homepageChapter = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/collections/homepage-chapter",
  }),
  schema: ({ image }) => {
    const media = z.discriminatedUnion("type", [
      z.object({ type: z.literal("image"), path: image(), alt: z.string() }),
      z.object({ type: z.literal("video"), path: z.string(), alt: z.string() }),
    ]);

    return z.object({
      // Eyebrow, glance tile label and chapter menu label.
      name: z.string(),
      title: z.string(),
      // Picks the `--color-chapter-*` theme token.
      color: z.enum([
        "agents",
        "captures",
        "network",
        "testing",
        "design",
        "teams",
      ]),
      tile: z
        .object({
          title: z.string(),
          image: image().optional(),
          // A public path, such as `/features/posters/<video>.webp`.
          poster: z.string().startsWith("/").optional(),
        })
        .refine((tile) => !tile.image !== !tile.poster, {
          message: "Set either tile.image or tile.poster.",
        }),
      presentation: z.enum(["tabs", "gallery", "closer-look"]),
      // Display order. Overrides win; the rest falls back to the feature.
      items: z
        .array(
          z.object({
            feature: reference("feature").optional(),
            title: z.string().optional(),
            description: z.string().optional(),
            media: media.optional(),
          }),
        )
        .min(1),
      links: z
        .array(z.object({ label: z.string(), href: z.string() }))
        .default([]),
    });
  },
});

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      seoParent: z
        .object({
          name: z.string(),
          path: z.string(),
        })
        .optional(),
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
    }),
  }),
});

const blog = defineCollection({
  // One self-contained folder per post: src/content/blog/<slug>/index.mdx.
  // The slug is the folder name, so we strip the trailing `/index` the glob
  // loader would otherwise include in the generated id.
  loader: glob({
    pattern: "**/index.{md,mdx}",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      // SEO-facing title: HTML <title> and the listing/overview card.
      title: z.string(),
      // On-page <h1> and structured-data headline. May be longer than `title`
      // for SEO; falls back to `title` when omitted.
      pageTitle: z.string().optional(),
      description: z.string(),
      publishedTime: z.coerce.date(),
      // Falls back to `publishedTime` when omitted.
      modifiedTime: z.coerce.date().optional(),
      // Optional hero image, rendered at the top of the post and used as the
      // Open Graph image. When omitted, the site's default banner is used.
      image: image().optional(),
      imageAlt: z.string().optional(),
      // Optional caption rendered under the hero image.
      imageCaption: z.string().optional(),
    }),
});

const featurePage = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/collections/feature-page",
  }),
  schema: featurePageSchema,
});

export const collections = {
  feature,
  "feature-page": featurePage,
  "homepage-chapter": homepageChapter,
  features: featuresPageCollection,
  pricing: pricingCollection,
  privacy: privacyCollection,
  "team-insights": teamInsightsCollection,
  "thank-you": thankYouCollection,
  terms: termsCollection,
  ctaSectionCollection,
  comparePlansSectionCollection,
  faqSectionCollection,
  pricingSectionCollection,
  statisticsSectionCollection,
  trustedBrandsSectionCollection,
  docs,
  blog,
};
