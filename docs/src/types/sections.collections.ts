import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Pricing Section collection schema
export const pricingSectionCollection = defineCollection({
  loader: glob({
    pattern: "pricing.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    title: z.string(),
    plans: z.array(
      z.object({
        enable: z.boolean(),
        title: z.string(),
        description: z.string(),
        color: z.string(),
        price_prefix: z.string(),
        features: z.array(
          z.object({
            enable: z.boolean(),
            included: z.boolean(),
            feature: z.string(),
          })
        ),
        price: z.object({
          yearly: z.object({
            amount: z.union([z.number(), z.string()]),
            period: z.string(),
          }),
        }),
        cta: z.object({
          enable: z.boolean(),
          label: z.string(),
          site: z.union([z.literal("public"), z.literal("teams"), z.literal('custom')]),
          link: z.string(),
          class: z.string().optional()
        }),
      })
    ),
  }),
});
