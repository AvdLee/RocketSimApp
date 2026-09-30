import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));

function astroFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return astroFiles(path);
    return entry.name.endsWith(".astro") ? [path] : [];
  });
}

const HOMEPAGE_SOURCES = [
  ...astroFiles(join(SRC, "components/home")),
  join(SRC, "pages/home-next.astro"),
];

// Sizes, tracking and line heights picked per element instead of from the
// type scale in src/styles/main.css: arbitrary values (`text-[17px]`,
// `tracking-[-0.03em]`, `leading-[1.4]`, `text-[clamp(…)]`) and Tailwind's
// rem-based sizes (`text-sm`), which follow the site's 13.6px mobile root.
const AD_HOC_TYPE =
  /(?<![\w-])(?:[\w-]+:)*(?:text-\[(?:\d|clamp)[^\]]*\]|text-(?:xs|sm|base|lg|[2-9]?xl)\b|tracking-\[[^\]]*\]|leading-\[[^\]]*\])/g;

test("homepage type comes from the shared type scale", () => {
  const offenders = HOMEPAGE_SOURCES.flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(AD_HOC_TYPE)].map(
      ([match]) => `${relative(SRC, file)}: ${match}`,
    ),
  );
  assert.deepEqual(
    offenders,
    [],
    "use a type-scale token (text-display, text-title-1, …) instead",
  );
});
