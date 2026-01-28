// @ts-check
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";

import sitemap from "@astrojs/sitemap";

import config from "./src/config/config.json";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Build the integrations array
 *
 * Configurations:
 *  - filter: We're filtering the terms, privacy and thank you pages, since we don't want them to be indexed.
 *  - LATER: Add `lastmod` to the feature and blog pages.
 *  - Starlight docs are only included in development
 */
const integrations: AstroIntegration[] = [
  react(),
  sitemap({
    filter: (page) =>
      page !== "https://www.rocketsim.app/terms" &&
      page !== "https://www.rocketsim.app/privacy" &&
      page !== "https://www.rocketsim.app/thank-you" &&
      page !== "https://www.rocketsim.app/signup/trial/thank-you",
  }),
  AutoImport({
    imports: [
      "@/shortcodes/Button",
      "@/shortcodes/Accordion",
      "@/shortcodes/Notice",
      "@/shortcodes/Video",
      "@/shortcodes/Youtube",
      "@/shortcodes/Tabs",
      "@/shortcodes/Tab",
    ],
  }),
];

if (!isProduction) {
  integrations.push(
    starlight({
      title: "RocketSim Docs",
      sidebar: [
        {
          label: "Getting Started",
          autogenerate: { directory: "docs/getting-started" },
        },
        {
          label: "Features",
          collapsed: true,
          items: [
            {
              label: "Capturing",
              collapsed: true,
              autogenerate: { directory: "docs/features/capturing" },
            },
            {
              label: "Design Comparison",
              collapsed: true,
              autogenerate: { directory: "docs/features/design-comparison" },
            },
            {
              label: "App Actions",
              collapsed: true,
              autogenerate: { directory: "docs/features/app-actions" },
            },
            {
              label: "RocketSim Connect",
              collapsed: true,
              autogenerate: { directory: "docs/features/rocketsim-connect" },
            },
            {
              label: "Accessibility",
              collapsed: true,
              autogenerate: { directory: "docs/features/accessibility" },
            },
          ],
        },
        {
          label: "Appearance",
          collapsed: true,
          autogenerate: { directory: "docs/appearance" },
        },
        {
          label: "Support",
          collapsed: true,
          autogenerate: { directory: "docs/support" },
        },
      ],
    }),
  );
}

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  // TODO: fix later
  vite: { plugins: [tailwindcss() as any] },
  integrations,
});
