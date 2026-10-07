// Pure item resolution for homepage chapters. Kept free of `astro:content` so
// it can be unit-tested with `node --test`; `homepage.ts` feeds it entries.

type MediaInput =
  | { type: "image"; path: ImageMetadata; alt: string }
  | { type: "video"; path: string; alt: string };

interface FeatureSource {
  name: string;
  tagLine?: string;
  asset: MediaInput;
}

// The detail an image zooms in on while it shows: `x` and `y` place it, from
// 0 to 1 across and down the image, and `zoom` is how far it grows.
interface MediaFocus {
  x: number;
  y: number;
  zoom: number;
}

interface ChapterItemInput {
  feature?: string;
  title?: string;
  description?: string;
  media?: MediaInput;
  focus?: MediaFocus;
}

export type HomepageMedia =
  | { type: "image"; src: ImageMetadata; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

export interface HomepageItem {
  title: string;
  description: string;
  media: HomepageMedia;
  // Only on images.
  focus?: MediaFocus;
}

// Posters sit next to the videos, in `posters/<name>.webp` (see
// `public/features/reencode-all.sh`), the same convention `Feature.astro` uses.
function posterFor(videoPath: string): string {
  return videoPath.replace(/\/([^/]+)\.[^/.]+$/, "/posters/$1.webp");
}

function toMedia(input: MediaInput): HomepageMedia {
  switch (input.type) {
    case "image": {
      return { type: "image", src: input.path, alt: input.alt };
    }
    case "video": {
      return {
        type: "video",
        src: input.path,
        poster: posterFor(input.path),
        alt: input.alt,
      };
    }
  }
}

// An override wins; anything not overridden falls back to the referenced
// feature (`name`, `tagLine`, `asset`). Throws, and so fails the build, when a
// feature is missing, a field has nothing to fall back on, or a video has a
// focus.
export function resolveChapterItems(
  chapterId: string,
  items: ChapterItemInput[],
  features: ReadonlyMap<string, FeatureSource>,
): HomepageItem[] {
  return items.map((item, index) => {
    const where = `Homepage chapter "${chapterId}", item ${index + 1}`;
    const feature = item.feature ? features.get(item.feature) : undefined;
    if (item.feature && !feature) {
      throw new Error(`${where}: unknown feature "${item.feature}".`);
    }

    const title = item.title ?? feature?.name;
    const description = item.description ?? feature?.tagLine;
    const media = item.media ?? feature?.asset;
    const missing = [
      title ? undefined : "title",
      description ? undefined : "description",
      media ? undefined : "media",
    ].filter(Boolean);
    if (!title || !description || !media) {
      throw new Error(
        `${where}: set ${missing.join(", ")} (no feature value to fall back on).`,
      );
    }

    if (item.focus && media.type !== "image") {
      throw new Error(`${where}: only an image can have a focus.`);
    }

    return {
      title,
      description,
      media: toMedia(media),
      ...(item.focus && { focus: item.focus }),
    };
  });
}
