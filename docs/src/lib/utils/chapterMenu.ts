// Which layer the homepage header shows, and which chapter its chapter menu
// highlights. Kept free of the DOM so it can be unit-tested with `node --test`.

interface ChapterBox {
  id: string;
  top: number;
}

// All positions are viewport coordinates, as getBoundingClientRect() reports.
interface ChapterMenuInput {
  headerBottom: number;
  glanceBottom: number;
  viewportHeight: number;
  // Chapter sections in page order.
  chapters: readonly ChapterBox[];
}

// How far up the window a chapter must scroll to count as the one being read.
const READING_LINE = 0.45;

export function chapterMenuState({
  headerBottom,
  glanceBottom,
  viewportHeight,
  chapters,
}: ChapterMenuInput): {
  showChapterMenu: boolean;
  current: string | undefined;
} {
  // The chapter menu takes over once the glance grid has scrolled under the
  // header; until then the main menu shows and no chapter is current.
  if (glanceBottom > headerBottom) {
    return { showChapterMenu: false, current: undefined };
  }

  // The last chapter to reach the reading line stays current through the
  // sections after it, such as the reviews or the everyday grid.
  const line = viewportHeight * READING_LINE;
  const current = chapters.findLast(({ top }) => top <= line)?.id;
  return { showChapterMenu: true, current };
}
