import type { APIRoute } from "astro";
import { getEntry } from "astro:content";

import config from "@/config/config.json";
import { markdownResponse } from "@/lib/llms/markdown-pages";
import { personalProUsPrices } from "@/lib/pricing";

const { base_url: baseUrl } = config.site;

// What each plan costs, in words. Personal prices follow the App Store, so
// the US price is the one number that can be stated.
const priceByPlan: Record<string, string[]> = {
  Free: ["Price: free, no account needed"],
  Personal: [
    `Price in the US App Store: $${personalProUsPrices.monthly} per month or $${personalProUsPrices.yearly} per year`,
    "Price in other countries: the local App Store price, which differs per country and currency",
    "How to buy: in the RocketSim app, through the App Store",
  ],
  Teams: [
    "Price: €10 per seat per month, billed annually (€120 per seat per year)",
    "Trial: 14 days",
  ],
  Enterprise: ["Price: custom, for 20 or more seats"],
};

/** A plain Markdown version of the pricing page for AI assistants and agents. */
export const GET: APIRoute = async () => {
  const pricing = await getEntry("pricingSectionCollection", "pricing");
  const faq = await getEntry("faqSectionCollection", "faq");
  const plans = pricing?.data.plans.filter((plan) => plan.enable) ?? [];

  const planSections = plans.map((plan) => {
    const features = plan.features.filter((feature) => feature.enable);
    const included = features
      .filter((feature) => feature.included)
      .map((feature) => `- ${feature.feature}`);
    const excluded = features
      .filter((feature) => !feature.included)
      .map((feature) => `- ${feature.feature}`);
    return [
      `### ${plan.title}`,
      plan.description,
      (priceByPlan[plan.title] ?? []).map((line) => `- ${line}`).join("\n"),
      included.length > 0 ? `Included:\n\n${included.join("\n")}` : "",
      excluded.length > 0 ? `Not included:\n\n${excluded.join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  });

  const questions = (faq?.data.list ?? []).map(
    (item) => `### ${item.question}\n\n${item.answer}`,
  );

  const document = [
    "# RocketSim pricing",
    "> RocketSim is free to download. Personal Pro is bought in-app at the local App Store price: in the US $" +
      `${personalProUsPrices.monthly} per month or $${personalProUsPrices.yearly} per year. ` +
      "Teams costs €10 per seat per month, billed annually. Enterprise pricing is custom.",
    [
      `- URL: ${baseUrl}/pricing/`,
      "- Download: https://apps.apple.com/app/apple-store/id1504940162",
      `- US App Store prices checked on ${personalProUsPrices.checkedOn}`,
    ].join("\n"),
    `## Plans\n\n${planSections.join("\n\n")}`,
    `## Frequently asked questions\n\n${questions.join("\n\n")}`,
  ].join("\n\n");

  return markdownResponse(`${document}\n`);
};
