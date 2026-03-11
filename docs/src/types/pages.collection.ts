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

// Features Page collection schema
export const featuresPageCollection = defineCollection({
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

// Feature Page schema (consolidated feature category pages)
const bentoColumnSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  image: z.string(),
});

export const featurePageSchema = z.object({
  title: z.string(),
  meta_title: z.string().optional(),
  description: z.string(),
  draft: z.boolean().default(false),
  hero: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
  }),
  bento: z
    .object({
      enable: z.boolean(),
      title: z.string().optional(),
      list: z.object({
        firstServiceRow: z.object({
          landscapeColumn: bentoColumnSchema,
          squareColumn: bentoColumnSchema,
        }),
        secondServiceRow: z.object({
          landscapeColumn: bentoColumnSchema,
          squareColumn: bentoColumnSchema,
        }),
      }),
    })
    .optional(),
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
