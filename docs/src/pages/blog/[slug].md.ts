import type { APIRoute } from "astro";

import { getPublishedPosts } from "@/lib/blog";
import { markdownResponse, pageDocument } from "@/lib/llms/markdown-pages";

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

/** The Markdown twin of a blog post, for AI assistants and agents. */
export const GET: APIRoute = ({ props }) => {
  const { post } = props as Awaited<
    ReturnType<typeof getStaticPaths>
  >[number]["props"];
  const published = post.data.publishedTime;
  const modified = post.data.modifiedTime ?? published;

  return markdownResponse(
    pageDocument({
      title: post.data.pageTitle ?? post.data.title,
      description: post.data.description,
      canonicalPath: `/blog/${post.id}/`,
      details: [
        "Author: Antoine van der Lee",
        `Published: ${published.toISOString().slice(0, 10)}`,
        `Last updated: ${modified.toISOString().slice(0, 10)}`,
      ],
      body: post.body ?? "",
    }),
  );
};
