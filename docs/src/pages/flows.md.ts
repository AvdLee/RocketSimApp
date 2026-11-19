import type { APIRoute } from "astro";

import config from "@/config/config.json";
import { flowsFaq } from "@/lib/agents/flowsFaq";
import { faqWithAbsoluteLinks } from "@/lib/faqText";
import { markdownResponse } from "@/lib/llms/markdown-pages";

/** The Markdown twin of the Flows page. */
export const GET: APIRoute = () => {
  const baseUrl = config.site.base_url;
  const faq = flowsFaq
    .map(
      ({ question, answer }) =>
        `### ${question}\n\n${faqWithAbsoluteLinks(answer, baseUrl)}`,
    )
    .join("\n\n");

  return markdownResponse(
    [
      "# Navigation Flows for iOS Simulator Agents",
      "> Save repeatable iOS Simulator navigation paths as flows, replay them with one command, and review every run on a live flow page.",
      `- URL: ${baseUrl}/flows/`,
      `- Documentation: ${baseUrl}/docs/features/agentic-development/flows/`,
      "RocketSim Flows save the path an agent walked in the iOS Simulator as a short `.rsflow` text file. The agent replays it with one command, RocketSim skips prerequisite flows that already hold, and a failed step returns one compact reply that names the step, the reason, and the nearest element.",
      `## Frequently asked questions\n\n${faq}`,
    ].join("\n\n") + "\n",
  );
};
