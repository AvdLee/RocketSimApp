import { aiFundamentals } from "./tutorials";

/**
 * Questions on the Tutorials page. Answers are plain text with Markdown links,
 * so they work on the page and in FAQPage structured data. Keep claims in step
 * with the RocketSim CLI and Navigation Flows docs.
 */
export const tutorialsFaq: { question: string; answer: string }[] = [
  {
    question: "What is the RocketSim CLI?",
    answer:
      "The RocketSim CLI is a command line tool, built into RocketSim, that reads and controls the iOS Simulator from Terminal. You and your AI coding agent use it to read visible elements, tap, type, wait for screens, and capture screenshots. See the [RocketSim CLI docs](/docs/features/agentic-development/rocketsim-cli/).",
  },
  {
    question: "How do I install the RocketSim CLI?",
    answer:
      "Open RocketSim, go to Settings → CLI & Agent, and click Install Command Line Tool. RocketSim creates a `rocketsim` command in the folder you choose, and App Store updates keep it current. Follow the [setup tutorial](/tutorials/set-up-rocketsim-for-your-agent/) for each step.",
  },
  {
    question: "Do I need to learn the CLI commands?",
    answer:
      "No. Your AI agent runs the commands. You install the CLI and the RocketSim Agent Skill once from Settings → CLI & Agent, then describe what you want in a prompt. The tutorials show the commands so you know what your agent does.",
  },
  {
    question: "What is an Agent Skill?",
    answer: `An Agent Skill is a folder of instructions that an AI agent loads when a task needs it. RocketSim's skill teaches Cursor, Codex, Claude Code, and Xcode's assistant to navigate the iOS Simulator with the RocketSim CLI. To make agents use it in a project, add a rule to your AGENTS.md. See [how to write an AGENTS.md](${aiFundamentals("how-to-write-agents-md")}) and the [Agent Skill docs](/docs/features/agentic-development/agent-skill/).`,
  },
  {
    question: "How do I make my agent use RocketSim?",
    answer:
      "Install the Agent Skill, then add a short iOS Simulator section to your AGENTS.md that tells agents to use the RocketSim skill for Simulator navigation. Follow [Tell your agent to use RocketSim](/tutorials/agents-md-rocketsim-skill/) for the exact wording.",
  },
  {
    question: "Which tutorial should I start with?",
    answer:
      "Start with [Set up RocketSim for your agent](/tutorials/set-up-rocketsim-for-your-agent/), then tell your agent to use it in AGENTS.md. Once your agent drives the Simulator, continue with the Flows tutorials to save and replay paths.",
  },
  {
    question: "Which RocketSim version do the Flows tutorials need?",
    answer:
      "Flows ship with RocketSim 17. The agent tutorials work with the current release. See the [Flows page](/flows/) for what is coming.",
  },
];
