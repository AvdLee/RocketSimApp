import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const feature = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/collections/feature" }),
  schema: z.object({
    title: z.string(),
    asset: z.object({
      url: z.string(),
      alt: z.string(),
    }),
  }),
});

export const collections = { feature };
