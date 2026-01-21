// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import tailwindcss from "@tailwindcss/vite";
import starlight from '@astrojs/starlight';

import sitemap from "@astrojs/sitemap";

import config from "./src/config/config.json";

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

  /**
   * Add the sitemap plugin
   *
   * Configurations:
   *  - filter: We're filtering the terms, privacy and thank you pages, since we don't want them to be indexed.
   *  - LATER: Add `lastmod` to the feature and blog pages.
   */
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        page !== "https://rocketsim.app/terms" &&
        page !== "https://rocketsim.app/privacy" &&
        page !== "https://rocketsim.app/thank-you" &&
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
    starlight({
      title: "RocketSim Docs TITLE",
      sidebar: [
        { label: "Getting Started", autogenerate: { directory: 'docs/getting-started'} },
      ]
    })
  ],
});
