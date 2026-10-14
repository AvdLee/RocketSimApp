import { getCollection, getEntry, render } from "astro:content";

import { resolveChapterItems } from "./homepageItems";

// Under the download buttons in the hero and the closing call to action.
export const downloadMicrocopy =
  "No signup. Works with Xcode 16+ and Xcode 27's Device Hub.";

async function loadChapter(id: string) {
  const entry = await getEntry("homepage-chapter", id);
  if (!entry) {
    throw new Error(
      `Unknown homepage chapter "${id}": add src/collections/homepage-chapter/${id}.md or remove it from the page.`,
    );
  }
  return entry;
}

// The chapter as the header's chapter menu and the glance grid show it:
// nothing from its body or its items.
export async function getHomepageChapterSummary(id: string) {
  const { name, menuLabel, color, tile } = (await loadChapter(id)).data;
  return { id, name, menuLabel, color, tile };
}

// Loads a homepage chapter by ID and resolves its items against the feature
// collection. The only place that knows how chapter content becomes props.
export async function getHomepageChapter(id: string) {
  const entry = await loadChapter(id);

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
