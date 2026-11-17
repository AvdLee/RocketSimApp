import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

const read = (relativePath) => readFileSync(join(DIST, relativePath), "utf8");

function jsonLdNodes(html) {
  return [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].flatMap(([, json]) => JSON.parse(json)["@graph"] ?? []);
}

test("the pricing page states the US price in text and structured data", () => {
  const html = read("pricing/index.html");
  assert.match(html, /\$9\.99 per month/);
  assert.match(html, /\$69\.99 per year/);

  const software = jsonLdNodes(html).find(
    (node) => node["@type"] === "SoftwareApplication",
  );
  const personal = software.offers.find((offer) => offer.name === "Personal");
  assert.deepEqual(
    personal.priceSpecification.map((spec) => spec.price),
    ["9.99", "69.99"],
  );
  assert.ok(software.offers.some((offer) => offer.name === "Free"));
});

test("pricing.md carries the plans and the US price", () => {
  const markdown = read("pricing.md");
  assert.match(markdown, /\$9\.99 per month or \$69\.99 per year/);
  assert.match(markdown, /€10 per seat per month/);
  assert.match(markdown, /### Enterprise/);
});

test("the homepage and the agentic features page publish FAQPage data", () => {
  for (const page of [
    "index.html",
    "features/agentic-development/index.html",
  ]) {
    const faq = jsonLdNodes(read(page)).find(
      (node) => node["@type"] === "FAQPage",
    );
    assert.ok(faq, `${page} has no FAQPage`);
    assert.ok(faq.mainEntity.length >= 5, `${page} has too few questions`);
  }
});

test("llms.txt links the pricing page, the guides and the Markdown versions", () => {
  const llms = read("llms.txt");
  assert.match(llms, /https:\/\/www\.rocketsim\.app\/pricing\//);
  assert.match(
    llms,
    /https:\/\/www\.rocketsim\.app\/blog\/ios-simulator-mcp\//,
  );
  assert.match(
    llms,
    /https:\/\/www\.rocketsim\.app\/features\/agentic-development\//,
  );
  assert.match(llms, /\.md/);
});

test("every blog post has a Markdown twin without JSX or figure markup", () => {
  const posts = readdirSync(join(DIST, "blog"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    // Skip redirect stubs, whose canonical URL points at another post.
    .filter((slug) =>
      read(`blog/${slug}/index.html`).includes(
        `rel="canonical" href="https://www.rocketsim.app/blog/${slug}/"`,
      ),
    );
  assert.ok(posts.length > 0);
  for (const slug of posts) {
    assert.ok(existsSync(join(DIST, `blog/${slug}.md`)), `${slug}.md missing`);
    const markdown = read(`blog/${slug}.md`);
    assert.doesNotMatch(markdown, /<figure|<Image|^import /m, slug);
  }
});

test("every Markdown alternate link points at a file that exists", () => {
  const pages = [
    "pricing/index.html",
    "blog/ios-simulator-mcp/index.html",
    "features/agentic-development/index.html",
    "docs/features/agentic-development/index.html",
  ];
  for (const page of pages) {
    const href = read(page).match(
      /<link rel="alternate" type="text\/markdown"[^>]*href="([^"]+)"/,
    )?.[1];
    assert.ok(href, `${page} has no Markdown alternate`);
    assert.ok(existsSync(join(DIST, href)), `${href} is not in dist`);
  }
});

test("FAQ answers link to pages that exist, with plain text in structured data", () => {
  for (const page of [
    "index.html",
    "features/agentic-development/index.html",
  ]) {
    const html = read(page);
    const faq = jsonLdNodes(html).find((node) => node["@type"] === "FAQPage");
    for (const { acceptedAnswer } of faq.mainEntity) {
      assert.doesNotMatch(
        acceptedAnswer.text,
        /\]\(/,
        "no Markdown in JSON-LD",
      );
    }

    const links = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map(
      ([, href]) => href,
    );
    assert.ok(links.length > 0);
    for (const href of new Set(links)) {
      const target = href.endsWith("/") ? `${href}index.html` : href;
      assert.ok(
        existsSync(join(DIST, target)),
        `${page} links to missing ${href}`,
      );
    }
  }

  const homepage = read("index.html");
  assert.match(homepage, /href="\/blog\/testing-ai-agents-ios-simulator\/"/);

  const twin = read("features/agentic-development.md");
  assert.match(
    twin,
    /\]\(https:\/\/www\.rocketsim\.app\/blog\/testing-ai-agents-ios-simulator\/\)/,
  );
});
