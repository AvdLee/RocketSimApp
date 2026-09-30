// Which layer the homepage header shows, and which chapter its chapter menu
// highlights. Kept free of the DOM so it can be unit-tested with `node --test`.

interface ChapterBox {
  id: string;
  top: number;
  bottom: number;
}

interface ChapterMenuInput {
  // Bottom edge of the header and the window height.
  header: number;
  height: number;
  // Bottom edge of the glance grid.
  glanceBottom: number;
  // Chapter sections in page order. All positions are viewport coordinates.
  chapters: readonly ChapterBox[];
}

// How far down the window a chapter must reach to count as the one being read.
const READING_LINE = 0.45;

export function chapterMenuState({
  header,
  height,
  glanceBottom,
  chapters,
}: ChapterMenuInput): { chapters: boolean; current: string | undefined } {
  // The chapter menu takes over once the glance grid has scrolled under the
  // header; until then the main menu shows and no chapter is current.
  if (glanceBottom > header) return { chapters: false, current: undefined };

  const line = height * READING_LINE;
  const current = chapters.find(
    ({ top, bottom }) => top <= line && bottom > line,
  )?.id;
  return { chapters: true, current };
}
