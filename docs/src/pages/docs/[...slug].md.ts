import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { docBodyToMarkdown } from "@/lib/llms/page-markdown";
import { markdownResponse } from "@/lib/llms/markdown-pages";

export async function getStaticPaths() {
  const entries = await getCollection("docs", ({ id, data }) => {
    return id.startsWith("docs/") && !data.draft;
  });
  return entries.map((entry) => ({
    params: { slug: entry.id.slice("docs/".length) },
    props: { entry },
  }));
}

/** The Markdown twin of a documentation page, the same text as "Copy as Markdown". */
export const GET: APIRoute = ({ props }) => {
  const { entry } = props as Awaited<
    ReturnType<typeof getStaticPaths>
  >[number]["props"];
  return markdownResponse(docBodyToMarkdown(entry));
};
