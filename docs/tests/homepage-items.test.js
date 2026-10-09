import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveChapterItems } from "../src/lib/homepageItems.ts";

const grids = { src: "/_astro/grids.png", width: 2092, height: 2092 };

const features = new Map([
  [
    "06-grids",
    {
      name: "Grids",
      tagLine: "Align elements across the screen",
      asset: { type: "image", path: grids, alt: "A grid overlay" },
    },
  ],
  [
    "08-slow-animations",
    {
      name: "Slow Animations",
      asset: {
        type: "video",
        path: "/features/slow-animations.mp4",
        alt: "Slowed-down transition",
      },
    },
  ],
]);

test("a feature item without overrides shows the feature's name, tagline and asset", () => {
  const [item] = resolveChapterItems(
    "design",
    [{ feature: "06-grids" }],
    features,
  );

  assert.deepEqual(item, {
    title: "Grids",
    description: "Align elements across the screen",
    media: { type: "image", src: grids, alt: "A grid overlay" },
  });
});

test("overrides win over the referenced feature, field by field", () => {
  const rulers = { src: "/_astro/rulers.png", width: 1400, height: 1400 };
  const [titleOnly, everything] = resolveChapterItems(
    "design",
    [
      { feature: "06-grids", title: "Grid overlay" },
      {
        feature: "06-grids",
        title: "Rulers",
        description: "Measure in on-device pixels.",
        media: { type: "image", path: rulers, alt: "Rulers" },
      },
    ],
    features,
  );

  assert.deepEqual(titleOnly, {
    title: "Grid overlay",
    description: "Align elements across the screen",
    media: { type: "image", src: grids, alt: "A grid overlay" },
  });
  assert.deepEqual(everything, {
    title: "Rulers",
    description: "Measure in on-device pixels.",
    media: { type: "image", src: rulers, alt: "Rulers" },
  });
});

test("videos get the matching poster from the posters folder", () => {
  const [item] = resolveChapterItems(
    "design",
    [{ feature: "08-slow-animations", description: "Catch every frame." }],
    features,
  );

  assert.deepEqual(item.media, {
    type: "video",
    src: "/features/slow-animations.mp4",
    poster: "/features/posters/slow-animations.webp",
    alt: "Slowed-down transition",
  });
});

test("an inline item without a feature uses its own title, description and media", () => {
  const seats = { src: "/_astro/seats.png", width: 2400, height: 1778 };
  const [item] = resolveChapterItems(
    "teams",
    [
      {
        title: "Seats & licenses",
        description: "Manage your whole team in one place.",
        media: { type: "image", path: seats, alt: "Team Manager" },
      },
    ],
    features,
  );

  assert.deepEqual(item, {
    title: "Seats & licenses",
    description: "Manage your whole team in one place.",
    media: { type: "image", src: seats, alt: "Team Manager" },
  });
});

test("an unknown feature fails the build with the chapter and feature named", () => {
  assert.throws(
    () => resolveChapterItems("design", [{ feature: "99-missing" }], features),
    /design.*99-missing/,
  );
});

test("an item with nothing to fall back on fails instead of rendering blanks", () => {
  // No tagLine on the feature and no description override.
  assert.throws(
    () =>
      resolveChapterItems(
        "design",
        [{ feature: "08-slow-animations" }],
        features,
      ),
    /design.*item 1.*description/,
  );
  // Inline item without media.
  assert.throws(
    () =>
      resolveChapterItems(
        "teams",
        [{ title: "Seats", description: "Manage seats." }],
        features,
      ),
    /teams.*item 1.*media/,
  );
});

test("an image keeps its focus, from the item or over the feature's image", () => {
  const focus = { x: 0.7, y: 0.2, zoom: 1.6 };
  const [item] = resolveChapterItems(
    "design",
    [{ feature: "06-grids", focus }],
    features,
  );

  assert.deepEqual(item.focus, focus);
});

test("a video with a focus fails, since only images zoom in", () => {
  assert.throws(
    () =>
      resolveChapterItems(
        "design",
        [
          {
            feature: "08-slow-animations",
            description: "Catch every frame.",
            focus: { x: 0.5, y: 0.5, zoom: 1.5 },
          },
        ],
        features,
      ),
    /design.*item 1.*focus/,
  );
});
