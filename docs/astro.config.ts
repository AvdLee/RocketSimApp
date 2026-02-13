// @ts-check
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";

import sitemap from "@astrojs/sitemap";

import config from "./src/config/config.json";

/**
 * Build the integrations array
 *
 * Configurations:
 *  - filter: We're filtering the terms, privacy and thank you pages, since we don't want them to be indexed.
 *  - LATER: Add `lastmod` to the feature and blog pages.
 */
const integrations: AstroIntegration[] = [
  react(),
  sitemap({
    filter: (page) =>
      page !== "https://www.rocketsim.app/terms" &&
      page !== "https://www.rocketsim.app/privacy" &&
      page !== "https://www.rocketsim.app/thank-you" &&
      page !== "https://www.rocketsim.app/signup/trial/thank-you" &&
      page !== "https://www.rocketsim.app/404" &&
      page !== "https://www.rocketsim.app/docs/404",
  }),
  AutoImport({
    imports: [
      "@/shortcodes/Accordion",
      "@/shortcodes/Youtube",
      "@/shortcodes/Tweet.astro",
    ],
  }),
  starlight({
    title: "RocketSim Docs",
    disable404Route: true,
    logo: {
      light: "./src/assets/rocketsim-logo-dark.svg",
      dark: "./src/assets/rocketsim-logo.svg",
      alt: "RocketSim",
      replacesTitle: true,
    },
    favicon: "/favicon.svg",
    customCss: ["./src/styles/starlight-custom.css"],
    social: [
      {
        icon: "x.com",
        label: "X/Twitter",
        href: "https://x.com/rocketsim_app",
      },
      {
        icon: "youtube",
        label: "YouTube",
        href: "https://www.youtube.com/@rocketsimapp",
      },
      {
        icon: "linkedin",
        label: "LinkedIn",
        href: "https://linkedin.com/company/rocketsim",
      },
      {
        icon: "github",
        label: "GitHub",
        href: "https://github.com/AvdLee/RocketSimApp",
      },
    ],
    editLink: {
      baseUrl: "https://github.com/AvdLee/RocketSimApp/edit/master/docs/",
    },
    components: {
      Head: "./src/components/starlight/Head.astro",
      PageTitle: "./src/components/starlight/PageTitle.astro",
      Footer: "./src/components/starlight/Footer.astro",
      SiteTitle: "./src/components/starlight/SiteTitle.astro",
    },
    sidebar: [
      {
        label: "Getting Started",
        collapsed: true,
        autogenerate: { directory: "docs/getting-started" },
      },
      {
        label: "Features",
        collapsed: false,
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
  mdx(),
];

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
