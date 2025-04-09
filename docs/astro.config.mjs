// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://rocketsim.app",
  /**
   * Add the sitemap plugin
   *
   * Configurations:
   *  - filter: We're filtering the terms, privacy and thank you pages, since we don't want them to be indexed.
   *  - LATER: Add `lastmod`, `changefreq`, and `priority` to the feature and blog pages.
   */
  integrations: [
    sitemap({
      filter: (page) =>
        page !== "https://rocketsim.app/terms/" &&
        page !== "https://rocketsim.app/privacy/" &&
        page !== "https://rocketsim.app/thank-you/",
    }),
  ],
});
