import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";
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
      tagLine: z.string().optional(),
      docPath: z.string().optional(),
      blogId: z.number().optional(),
      youtubeLink: z.string().url().optional(),
      featurePage: z
        .enum([
          "accessibility",
          "app-actions",
          "build-insights",
          "design-comparison",
          "networking",
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

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
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
};
