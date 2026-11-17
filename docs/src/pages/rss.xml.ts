import rss from "@astrojs/rss";
import config from "@/config/config.json";
import { getPublishedPosts } from "@/lib/blog";

export async function GET(context: { site?: URL }) {
  const posts = await getPublishedPosts();
  const site = context.site?.toString() ?? config.site.base_url;

  return rss({
    title: "RocketSim Blog",
    description:
      "Tips, guides, and deep dives for iOS developers who want to move faster.",
    site,
    customData: "<language>en</language>",
    items: posts
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.modifiedTime ?? post.data.publishedTime,
        link: `/blog/${post.id}/`,
      }))
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
  });
}
