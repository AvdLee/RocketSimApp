import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { markdownResponse } from "@/lib/llms/markdown-pages";
import config from "@/config/config.json";

export async function getStaticPaths() {
  const pages = await getCollection("feature-page");
  return pages
    .filter((page) => !page.data.draft)
    .map((page) => ({
      params: { featurePageSlug: page.id },
      props: { page },
    }));
}

/** The Markdown twin of a feature overview page. */
export const GET: APIRoute = async ({ props }) => {
  const { page } = props as Awaited<
    ReturnType<typeof getStaticPaths>
  >[number]["props"];
  const baseUrl = config.site.base_url;
  const features = await getCollection(
    "feature",
    (feature) => feature.data.featurePage === page.id,
  );

  const segments = [
    `# ${page.data.title}`,
    `> ${page.data.description}`,
    `- URL: ${baseUrl}/features/${page.id}/`,
  ];

  if (features.length > 0) {
    const items = features.map((feature) => {
      const { name, tagLine, docPath } = feature.data;
      const lines = [`### ${name}`];
      const description = feature.body?.trim() || tagLine;
      if (description) lines.push(description);
      if (docPath) {
        const href = docPath.startsWith("/") ? `${baseUrl}${docPath}` : docPath;
        lines.push(`Documentation: ${href}`);
      }
      return lines.join("\n\n");
    });
    segments.push(`## Features\n\n${items.join("\n\n")}`);
  }

  const faq = page.data.faq ?? [];
  if (faq.length > 0) {
    const items = faq.map((item) => `### ${item.question}\n\n${item.answer}`);
    segments.push(`## Frequently asked questions\n\n${items.join("\n\n")}`);
  }

  return markdownResponse(`${segments.join("\n\n")}\n`);
};
