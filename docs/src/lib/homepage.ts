import { getCollection, getEntry, render } from "astro:content";

import { resolveChapterItems } from "./homepageItems";

// Loads a homepage chapter by ID and resolves its items against the feature
// collection. The only place that knows how chapter content becomes props.
export async function getHomepageChapter(id: string) {
  const entry = await getEntry("homepage-chapter", id);
  if (!entry) {
    throw new Error(
      `Unknown homepage chapter "${id}": add src/collections/homepage-chapter/${id}.md or remove it from the page.`,
    );
  }

  const features = new Map(
    (await getCollection("feature")).map((feature) => [
      feature.id,
      feature.data,
    ]),
  );
  const items = resolveChapterItems(
    id,
    entry.data.items.map(({ feature, ...item }) => ({
      ...item,
      feature: feature?.id,
    })),
    features,
  );
  const { Content } = await render(entry);

  return { ...entry.data, id, items, Content };
}
