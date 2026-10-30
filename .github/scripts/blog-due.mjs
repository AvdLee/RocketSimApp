// Decides whether a scheduled run needs to rebuild the site: true when a blog
// post's `publishedTime` passed within the last 25 hours. Posts dated in the
// future are left out of the build (see docs/src/lib/blogPublishing.ts), so
// the first deploy after their date publishes them. `NOW` overrides the clock
// for local testing, for example `NOW=2026-11-03T05:15:00Z node blog-due.mjs`.
import { appendFileSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const blogDir = "docs/src/content/blog";
const now = process.env.NOW ? new Date(process.env.NOW) : new Date();
const windowMs = 25 * 60 * 60 * 1000;

const due = [];
for (const slug of readdirSync(blogDir)) {
  let source;
  try {
    source = readFileSync(join(blogDir, slug, "index.mdx"), "utf8");
  } catch {
    continue;
  }
  const match = source.match(/^publishedTime:\s*["']?([^"'\r\n]+?)["']?\s*$/m);
  if (!match) continue;
  const published = new Date(match[1]);
  const age = now.getTime() - published.getTime();
  if (age >= 0 && age < windowMs) due.push(slug);
}

const result = due.length > 0 ? "true" : "false";
console.log(`due=${result}${due.length > 0 ? ` (${due.join(", ")})` : ""}`);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `due=${result}\n`);
}
