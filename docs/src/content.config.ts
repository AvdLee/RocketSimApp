import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

import { pricingCollection } from "./types/pages.collection";
import {comparePlansSectionCollection, faqSectionCollection, pricingSectionCollection, statisticsSectionCollection } from "./types/sections.collections";



const alignment = z.enum(["left", "right", "full-width"]);
const columnSpan = z.union([z.literal(6), z.literal(8), z.literal(12)]);

const feature = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/collections/feature" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagLine: z.string().optional(),
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

export const collections = { feature, pricing: pricingCollection, comparePlansSectionCollection, faqSectionCollection, pricingSectionCollection, statisticsSectionCollection };
