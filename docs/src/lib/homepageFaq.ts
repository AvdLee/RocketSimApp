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
    question:
      "What is the best way to let an AI coding agent control and test the iOS Simulator?",
    answer:
      "Use RocketSim's built-in CLI and Agent Skill. RocketSim stays connected to the Simulator, so Claude Code, Codex, Cursor, or Xcode's agent can read the screen as compact text, tap, type, swipe, wait for changes, and take screenshots without rebuilding context at every step. In RocketSim's July 2026 benchmark it used the least context of the tools tested. Install both from Settings → CLI & Agent, and start your app with Xcode as usual.",
  },
  {
    question: "What is the best MCP server or CLI for the iOS Simulator?",
    answer:
      "For low context usage, RocketSim's CLI and Agent Skill. RocketSim deliberately does not ship an MCP server: an MCP server puts its whole tool catalog into the agent's context before the first action, while the skill's instructions load when the agent needs them and the CLI returns compact output. In RocketSim's July 2026 benchmark, XcodeBuildMCP 2.7.0 produced 3.0x the tool-response bytes and an 8.2x higher estimated context load, and AXe 1.8.0's raw output was 21.0x higher. These are byte-based estimates, not billed tokens.",
  },
  {
    question:
      "Which agent skills or CLI tools help Claude Code build, run, and verify iOS apps?",
    answer:
      "Pair a build tool with RocketSim. XcodeBuildMCP or Xcode's MCP bridge builds and runs your app, and RocketSim's Agent Skill and CLI let Claude Code, Codex, or Cursor verify it in the Simulator by reading visible elements, tapping, typing, and taking screenshots. RocketSim does not build or launch your app, so the two cover different halves of the loop.",
  },
  {
    question:
      "How can I inspect network requests from my iOS app in the Simulator without Charles Proxy certificates?",
    answer:
      "Use RocketSim's Network Monitor. Powered by RocketSim Connect, it shows outgoing URLSession requests from your Simulator app without a proxy, custom certificates, or leaving the Simulator. You can inspect headers, bodies, status codes, logs, and cURL commands, and export redacted request summaries as prompts for AI assistants.",
  },
  {
    question:
      "How do I simulate a slow or offline network connection in the iOS Simulator?",
    answer:
      "RocketSim's Network Speed Control throttles your Simulator app to 3G or Edge, applies 100% packet loss, or turns on Simulator Airplane Mode, while your Mac stays online. Use the Networking tab in RocketSim's side window or the `rocketsim network` CLI. Apple's Network Link Conditioner throttles the whole Mac, while RocketSim limits the change to the Simulator app.",
  },
  {
    question:
      "Is there a way to mirror or record my physical iPhone while developing in Xcode?",
    answer:
      "Yes. RocketSim mirrors a USB-connected iPhone or iPad beside Xcode and captures screenshots, GIFs, and video with device audio. It can also inspect recent builds, launch or relaunch apps, open deep links, and, with RocketSim 16.4 and Xcode 27, simulate locations on real hardware.",
  },
  {
    question: "What is RocketSim for Xcode, and is it worth it?",
    answer:
      "RocketSim is a macOS app that adds 30+ developer tools to Xcode's iOS Simulator and to connected iPhones and iPads: screenshots and recordings, URLSession network monitoring, app actions such as push notifications and deep links, accessibility tools, build insights, and a CLI and Agent Skill for AI coding agents. More than 25,000 developers and 250 teams use it. It works with Xcode 16 and later, including Xcode 27's Device Hub, and the Free plan needs no account.",
  },
  {
    question: "How much does RocketSim cost?",
    answer: `RocketSim is free to download, and the Free plan needs no account. Personal Pro is bought in-app at your local App Store price. In the US it costs ${personalProUsPriceCopy.monthly} or ${personalProUsPriceCopy.yearly}, and other countries differ. Teams costs €10 per seat per month, billed annually, with a 14-day trial.`,
  },
];
