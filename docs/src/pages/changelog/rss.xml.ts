import rss from "@astrojs/rss";

import config from "@/config/config.json";
import changelogMarkdown from "@/data/changelog.md?raw";
import releaseDates from "@/data/release-dates.json";
import { parseChangelog, type ReleaseDateMap } from "@/lib/changelog";

function releaseContentHtml(
  release: ReturnType<typeof parseChangelog>[number],
) {
  return release.sections
    .map(
      (section) => `<h2>${section.title}</h2>
${section.html}`,
    )
    .join("\n");
}

export function GET(context: { site?: URL }) {
  const site = context.site?.toString() ?? config.site.base_url;
  const releases = parseChangelog(
    changelogMarkdown,
    releaseDates as ReleaseDateMap,
  );

  return rss({
    title: "RocketSim Changelog",
    description:
      "Release notes and App Store updates for RocketSim, the Xcode Simulator companion for developers and AI coding agents.",
    site,
    customData: "<language>en</language>",
    items: releases
      .filter((release) => release.date)
      .map((release) => ({
        title: `RocketSim ${release.version}`,
        description: release.summary,
        content: releaseContentHtml(release),
        pubDate: new Date(`${release.date}T00:00:00Z`),
        link: `${config.site.base_url}/changelog/#${release.slug}`,
      })),
  });
}
