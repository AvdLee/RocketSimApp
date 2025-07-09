import { defineCollection, z } from "astro:content";

// Pricing Page collection schema
export const pricingCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean(),
    hero: z.object({
      title: z.string().optional(),
    }),
  }),
});
