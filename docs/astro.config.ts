// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";

import sitemap from "@astrojs/sitemap";
import { llmsTxtPostProcess } from "./src/integrations/llms-txt-post-process";

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
  integrations: [
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
      plugins: [
        starlightLlmsTxt({
          projectName: "RocketSim",
          description:
            "RocketSim enhances the iOS Simulator with features for capturing screenshots and recordings, comparing designs, testing push notifications, deep links, location simulation, network speed control, accessibility toggles, and more.",
          rawContent: true,
        }),
      ],
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
          label: "Screenshots & Recordings",
          collapsed: true,
          autogenerate: { directory: "docs/features/capturing" },
        },
        {
          label: "Simulator Camera",
          link: "/docs/docs/features/capturing/simulator-camera-support",
        },
        {
          label: "Status Bar",
          link: "/docs/docs/features/capturing/statusbar-appearance",
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
          label: "Networking",
          collapsed: true,
          autogenerate: { directory: "docs/features/networking" },
        },
        {
          label: "Build Insights",
          collapsed: true,
          autogenerate: { directory: "docs/features/build-insights" },
        },
        {
          label: "Accessibility",
          collapsed: true,
          autogenerate: { directory: "docs/features/accessibility" },
        },
        {
          label: "User Defaults Editor",
          link: "/docs/docs/features/user-defaults-editor",
        },
        {
          label: "Settings",
          collapsed: true,
          autogenerate: { directory: "docs/settings" },
        },
        {
          label: "Support",
          collapsed: true,
          autogenerate: { directory: "docs/support" },
        },
      ],
    }),
    mdx(),
    llmsTxtPostProcess(),
  ],
});
