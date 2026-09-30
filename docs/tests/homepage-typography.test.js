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

// Type picked per element instead of from the type scale in
// src/styles/main.css: arbitrary sizes, tracking and line heights
// (`text-[17px]`, `text-[clamp(…)]`, `tracking-[-0.03em]`, `leading-[1.4]`),
// Tailwind's rem-based sizes and line heights (`text-sm`, `leading-6`), which
// follow the site's 13.6px mobile root, and bold, which the scale dropped for
// semibold.
const AD_HOC_TYPE = new RegExp(
  String.raw`(?<![\w-])(?:[^\s"'\x60]+:)?(?:` +
    [
      String.raw`text-\[(?:[\d.]|clamp\(|calc\(|min\(|max\(|length:)[^\]]*\]`,
      String.raw`text-\(length:[^)]*\)`,
      String.raw`text-(?:xs|sm|base|lg|[2-9]?xl)(?![\w-])`,
      String.raw`tracking-\[[^\]]*\]`,
      String.raw`leading-(?:\[[^\]]*\]|\d+)`,
      String.raw`font-(?:bold|extrabold|black)(?![\w-])`,
    ].join("|") +
    ")",
  "g",
);

function adHocType(source) {
  return [...source.matchAll(AD_HOC_TYPE)].map(([match]) => match);
}

test("the type guard flags ad-hoc type and lets the scale through", () => {
  const flagged = [
    "text-[17px]",
    "md:text-[.9rem]",
    "text-[clamp(36px,6vw,64px)]",
    "text-[calc(1rem+2px)]",
    "text-[length:var(--size)]",
    "text-(length:--size)",
    "text-sm",
    "[&_p]:text-lg",
    "text-2xl",
    "tracking-[-0.03em]",
    "leading-[1.4]",
    "leading-6",
    "font-bold",
    "group-hover:font-extrabold",
  ];
  const allowed = [
    "text-title-1",
    "md:text-copy",
    "[&_p]:text-intro",
    "text-base-sm",
    "text-muted",
    "text-text-dark",
    "text-[#fff]",
    "text-(--chapter)",
    "tracking-normal",
    "leading-none",
    "leading-relaxed",
    "font-semibold",
    "font-mono",
  ];
  assert.deepEqual(adHocType(flagged.join(" ")), flagged);
  assert.deepEqual(adHocType(allowed.join(" ")), []);
});

test("homepage type comes from the shared type scale", () => {
  const offenders = HOMEPAGE_SOURCES.flatMap((file) =>
    adHocType(readFileSync(file, "utf8")).map(
      (match) => `${relative(SRC, file)}: ${match}`,
    ),
  );
  assert.deepEqual(
    offenders,
    [],
    "use a type-scale token (text-display, text-title-1, …) instead",
  );
});

test("headings set in any step of the type scale keep the step's style", () => {
  // base.css lists the scale's classes to lift the heading defaults off
  // them; a step missing there renders with the default heading style.
  const theme =
    readFileSync(join(SRC, "styles/main.css"), "utf8").match(
      /@theme \{([^}]*)\}/,
    )?.[1] ?? "";
  const steps = [
    ...theme.matchAll(/^\s*--text-([a-z0-9]+(?:-[a-z0-9]+)*):/gm),
  ].map(([, step]) => step);
  const baseCss = readFileSync(join(SRC, "styles/base.css"), "utf8");
  const selector = baseCss.match(/:is\(h1[^)]*\):is\(([^)]*)\)/)?.[1] ?? "";
  const listed = [...selector.matchAll(/\.text-([a-z0-9-]+)/g)].map(
    ([, step]) => step,
  );
  assert.ok(steps.length > 0, "no type-scale steps found in main.css");
  assert.deepEqual(listed.sort(), steps.sort());
});
