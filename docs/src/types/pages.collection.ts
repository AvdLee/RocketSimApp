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

// Team insights collection schema
export const teamInsightsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean(),
  }),
});

// Privacy collection schema
export const privacyCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean(),
  }),
});

// Terms collection schema
export const termsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean(),
  }),
});

// Thank you collection schema
export const thankYouCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    draft: z.boolean(),
  }),
});