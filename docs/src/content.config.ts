import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const alignment = z.enum(["left", "right"]);
const columnSpan = z.union([z.literal(6), z.literal(8)]);

const feature = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/collections/feature" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      asset: z.discriminatedUnion("type", [
        z.object({
          type: z.literal("image"),
          path: image(),
          alt: z.string(),
          alignment,
          columnSpan,
        }),
        z.object({
          type: z.literal("video"),
          path: z.string(),
          alt: z.string(),
          alignment,
          columnSpan,
        }),
      ]),
      sortOrder: z.number(),
    }),
});

export const collections = { feature };
