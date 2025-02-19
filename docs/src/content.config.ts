import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const feature = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/collections/feature" }),
  schema: ({ image }) => z.object({
      title: z.string(),
      image: image(),
      imageAlt: z.string(),
      imageAlignment: z.enum(['left', 'right']),
      imageColumnSpan: z.union([z.literal(6), z.literal(8)]),
      sortOrder: z.number()
    }),
});

export const collections = { feature };
