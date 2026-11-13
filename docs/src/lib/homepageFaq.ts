import { personalProUsPriceCopy } from "./pricing";

type HomepageFaqItem = { question: string; answer: string };

/**
 * Questions on the homepage, written as developers and AI assistants ask
 * them. Each answer is plain text so it works both on the page and in the
 * FAQPage structured data, and names RocketSim on its own. Keep claims in
 * step with the docs pages they come from.
 */
export const homepageFaq: HomepageFaqItem[] = [
  {
    question: "What is RocketSim?",
    answer:
      "RocketSim is a macOS app that adds developer tools to Xcode's iOS Simulator and to connected physical iPhones and iPads. It covers screenshots and recordings, URLSession network monitoring, app actions such as push notifications and deep links, accessibility tools, and a CLI and Agent Skill for AI coding agents. It works with Xcode 16 and later, including Xcode 27's Device Hub.",
  },
  {
    question: "How can an AI coding agent control the iOS Simulator?",
    answer:
      "RocketSim includes a CLI and an Agent Skill that you install from Settings → CLI & Agent. Cursor, Claude, Codex, and Xcode can then read the visible screen as text, tap, type, wait for screen changes, take screenshots, and record the Simulator. RocketSim does not build or launch your app, so you start it with Xcode or your usual build tooling.",
  },
  {
    question: "Does RocketSim have an MCP server?",
    answer:
      "No. RocketSim does not ship an MCP server and gives agents a CLI and an Agent Skill instead. You can combine it with XcodeBuildMCP or Xcode's MCP bridge: they build and run your app, and RocketSim lets the agent verify it in the Simulator.",
  },
  {
    question: "Can I monitor network requests without a proxy or certificates?",
    answer:
      "Yes. Powered by RocketSim Connect, RocketSim monitors outgoing URLSession requests from your Simulator app without a proxy, custom certificates, or switching tools. You can inspect headers, bodies, status codes, logs, and cURL commands.",
  },
  {
    question: "Does RocketSim work with a physical iPhone or iPad?",
    answer:
      "Yes. With a connected iPhone or iPad, RocketSim can mirror the device beside Xcode, create screenshots and recordings, inspect recent builds, launch or relaunch apps, and open deep links. Location simulation on real hardware needs RocketSim 16.4 and Xcode 27.",
  },
  {
    question: "How much does RocketSim cost?",
    answer: `RocketSim is free to download, and the Free plan needs no account. Personal Pro is bought in-app at your local App Store price. In the US it costs ${personalProUsPriceCopy.monthly} or ${personalProUsPriceCopy.yearly}, and other countries differ. Teams costs €10 per seat per month, billed annually, with a 14-day trial.`,
  },
];
