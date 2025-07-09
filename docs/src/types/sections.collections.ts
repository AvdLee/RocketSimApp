import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

// Compare Plans Section collection schema
export const comparePlansSectionCollection = defineCollection({
  loader: glob({
    pattern: "compare-plans.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    title: z.string(),
    enable: z.boolean(),
    compare_plans: z.object({
      compare: z.string(),
      individual: z.string(),
      teams: z.string(),
      enterprise: z.string(),
      item: z.array(
        z.object({
          title: z.string(),
          list: z.array(
            z.object({
              item: z.string(),
              individual: z.union([z.boolean(), z.string()]),
              teams: z.union([z.boolean(), z.string()]),
              enterprise: z.union([z.boolean(), z.string()]),
            }),
          ),
        }),
      ),
    }),
  }),
});

// Call to Action collection schema
export const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    call_to_actions: z.array(
      z.object({
        enable: z.boolean(),
        label: z.string(),
        site: z.union([
          z.literal("public"),
          z.literal("teams"),
          z.literal("custom"),
        ]),
        link: z.string(),
        class: z.string().optional(),
      }),
    ),
  }),
});

// FAQ Section collection schema
export const faqSectionCollection = defineCollection({
  loader: glob({
    pattern: "faq.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    title: z.string(),
    list: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

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
          }),
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
          site: z.union([
            z.literal("public"),
            z.literal("teams"),
            z.literal("custom"),
          ]),
          link: z.string(),
          class: z.string().optional(),
        }),
      }),
    ),
  }),
});

// Statistics Section collection schema
export const statisticsSectionCollection = defineCollection({
  loader: glob({
    pattern: "statistics.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    list: z.array(
      z.object({
        enable: z.boolean(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
});
