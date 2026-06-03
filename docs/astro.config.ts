// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import AutoImport from "astro-auto-import";
import tailwindcss from "@tailwindcss/vite";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";

import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Plugin, Transformer } from "unified";
import type { Element, Root } from "hast";
import { llmsTxtPostProcess } from "./src/integrations/llms-txt-post-process";

import config from "./src/config/config.json";

// Heading anchors are generated at build time for blog posts only. Starlight
// already manages slugs/anchors for the docs collection, so we scope these
// plugins to files under `src/content/blog` to avoid double-processing docs.
const scopeToBlog =
  <S extends unknown[]>(
    plugin: Plugin<S, Root>,
    ...settings: S
  ): Plugin<[], Root> =>
  function () {
    const transformer = plugin.call(this, ...settings) as Transformer<
      Root,
      Root
    >;
    // Keep this wrapper arity-2 so unified treats it as a synchronous
    // transformer. The wrapped plugins (slug/autolink) mutate the tree
    // synchronously and ignore the `next` callback.
    return (tree, file) => {
      if (!file?.path?.includes("/content/blog/")) return;
      transformer(tree, file, () => undefined);
    };
  };

// Link icon prepended to each heading anchor (sized via `.heading-anchor svg`).
const headingAnchorIcon: Element = {
  type: "element",
  tagName: "svg",
  properties: {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ariaHidden: "true",
  },
  children: [
    {
      type: "element",
      tagName: "path",
      properties: {
        d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
      },
      children: [],
    },
    {
      type: "element",
      tagName: "path",
      properties: {
        d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
      },
      children: [],
    },
  ],
};

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  redirects: {
    "/team-insights": "/for-teams",
    "/docs/features/rocketsim-connect/introduction-and-setup":
      "/docs/getting-started/setting-up-rocketsim-connect",
    "/docs/features/rocketsim-connect/network-traffic-monitoring":
      "/docs/features/networking/network-traffic-monitoring",
    "/docs/appearance/side-window": "/docs/settings/side-window",
    "/docs/appearance/shortcuts": "/docs/settings/shortcuts",
    "/docs/features/app-actions/general-app-actions":
      "/docs/getting-started/configuring-app-actions",
    "/docs/features/app-actions/user-defaults-editor":
      "/docs/features/user-defaults-editor",
    "/docs/features/app-actions/build-insights":
      "/docs/features/build-insights/build-insights",
    "/docs/features/app-actions/network-speed-control-and-simulator-airplane-mode":
      "/docs/features/networking/network-speed-control",
    "/docs/docs/features/rocketsim-connect/introduction-and-setup":
      "/docs/getting-started/setting-up-rocketsim-connect",
    "/docs/docs/features/rocketsim-connect/network-traffic-monitoring":
      "/docs/features/networking/network-traffic-monitoring",
    "/docs/docs/appearance/side-window": "/docs/settings/side-window",
    "/docs/docs/appearance/shortcuts": "/docs/settings/shortcuts",
    "/docs/docs/features/app-actions/general-app-actions":
      "/docs/getting-started/configuring-app-actions",
    "/docs/docs/features/app-actions/build-insights":
      "/docs/features/build-insights/build-insights",
    "/docs/docs/features/app-actions/network-speed-control-and-simulator-airplane-mode":
      "/docs/features/networking/network-speed-control",
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
  },
  markdown: {
    rehypePlugins: [
      scopeToBlog(rehypeSlug),
      scopeToBlog(rehypeAutolinkHeadings, {
        behavior: "prepend",
        properties: {
          className: ["heading-anchor"],
          ariaLabel: "Link to this section",
        },
        content: headingAnchorIcon,
      }),
    ],
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
        page !== "https://www.rocketsim.app/claim-offer" &&
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
            "RocketSim enhances iOS Simulator and physical-device development with screenshots and recordings, design comparison, agentic development through the RocketSim CLI and Agent Skill, push notification testing, deep links, location simulation, network tools, accessibility workflows, and more.",
          rawContent: true,
        }),
      ],
      title: "RocketSim Docs",
      // Replace Starlight's default `og:site_name` (which mirrors `title`) with
      // the umbrella brand name. Starlight dedupes entries in `head` by
      // property/name, so this cleanly overrides instead of duplicating.
      head: [
        {
          tag: "meta",
          attrs: { property: "og:site_name", content: "RocketSim" },
        },
      ],
      disable404Route: true,
      lastUpdated: true,
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
        PageSidebar: "./src/components/starlight/PageSidebar.astro",
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
          items: [
            { slug: "docs/features/capturing/screenshots" },
            { slug: "docs/features/capturing/recordings" },
            { slug: "docs/features/capturing/post-editor" },
            { slug: "docs/features/capturing/floating-thumbnail" },
            { slug: "docs/features/capturing/app-store-connect-optimization" },
            { slug: "docs/features/capturing/touch-indicators" },
            { slug: "docs/features/capturing/120-fps-recordings" },
          ],
        },
        {
          label: "Simulator Camera",
          link: "/docs/features/capturing/simulator-camera-support",
        },
        {
          label: "Status Bar",
          link: "/docs/features/capturing/statusbar-appearance",
        },
        {
          label: "Physical Devices",
          link: "/docs/features/capturing/physical-device-support",
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
          label: "Agentic Development",
          collapsed: true,
          autogenerate: { directory: "docs/features/agentic-development" },
        },
        {
          label: "User Defaults Editor",
          link: "/docs/features/user-defaults-editor",
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
