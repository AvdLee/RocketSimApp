// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import AutoImport from "astro-auto-import";
import sharp from "sharp";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },

  /**
   * Add the sitemap plugin
   *
   * Configurations:
   *  - filter: We're filtering the terms, privacy and thank you pages, since we don't want them to be indexed.
   *  - LATER: Add `lastmod`, `changefreq`, and `priority` to the feature and blog pages.
   */
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        page !== "https://rocketsim.app/terms/" &&
        page !== "https://rocketsim.app/privacy/" &&
        page !== "https://rocketsim.app/thank-you/",
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
  ],
});
