// Which layer the homepage header shows, and which chapter its chapter menu
// highlights. Kept free of the DOM so it can be unit-tested with `node --test`;
// HomeHeader.astro feeds it from IntersectionObservers.

// How far down the window a chapter's top must come to count as the one
// being read, as a share of the window's height.
export const READING_LINE = 0.45;

interface ChapterMenuInput {
  // The glance grid has scrolled up under the header.
  pastGlance: boolean;
  // Chapter sections in page order, each with whether its top has come up
  // to the reading line.
  chapters: readonly { id: string; reached: boolean }[];
}

export function chapterMenuState({ pastGlance, chapters }: ChapterMenuInput): {
  showChapterMenu: boolean;
  current: string | undefined;
} {
  // The chapter menu takes over once the glance grid has scrolled under the
  // header; until then the main menu shows and no chapter is current.
  if (!pastGlance) {
    return { showChapterMenu: false, current: undefined };
  }

  // The last chapter to reach the reading line stays current through the
  // sections after it, such as the reviews or the mentions.
  const current = chapters.findLast(({ reached }) => reached)?.id;
  return { showChapterMenu: true, current };
}
