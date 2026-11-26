/**
 * Questions on the Flows page. Answers are plain text with Markdown links, so
 * they work on the page, in FAQPage structured data, and in the Markdown twin.
 * Keep claims in step with the Navigation Flows docs.
 */
export const flowsFaq: { question: string; answer: string }[] = [
  {
    question: "What are RocketSim Flows?",
    answer:
      "Flows are saved iOS Simulator navigation paths. After your agent reaches a screen once, RocketSim saves the steps as a short text file. Next time, the agent replays the whole path with one command, such as `rocketsim flow open-settings`, instead of reading the screen and tapping step by step. See the [Navigation Flows docs](/docs/features/agentic-development/flows/).",
  },
  {
    question: "Which AI coding agents can use Flows?",
    answer:
      "Any agent that can run shell commands, including Cursor, Codex, Claude Code, and Xcode's agent. Flows use the same RocketSim CLI and Agent Skill as the rest of RocketSim's [agentic development](/features/agentic-development/) features. The flow review page opens in the IDE's own browser where the IDE has one.",
  },
  {
    question: "Why do flows save tokens?",
    answer:
      "A replayed flow replaces many read, tap, and verify turns with one command and one short reply. The agent only reads the screen when it needs to decide something new. A failed run also returns one compact reply that names the step, the reason, and the nearest matching element, so the agent does not have to explore to recover.",
  },
  {
    question: "What happens when my app's UI changes?",
    answer:
      "The flow stops at the step that no longer matches and reports it with the closest elements on the current screen. Your agent finishes the step by hand, then runs `rocketsim flow fix` to rewrite the step in the saved file. `rocketsim flow verify` replays flows before a task starts, to catch drift early.",
  },
  {
    question: "How do flows handle logins and secrets?",
    answer:
      "A flow can declare parameters, and mark one as secret. A secret's value comes from an environment variable at run time and is never written to the flow file, a log, or a failure reply. A flow can also name another flow as a prerequisite, such as a login, and RocketSim skips it when its final check already holds.",
  },
  {
    question: "Where are flows stored, and can my team share them?",
    answer:
      "Flows are plain-text `.rsflow` files in RocketSim's Application Support folder on your Mac, grouped by app. To share them with your team, keep the files in your repository and load them with `rocketsim flow sync --dir <folder>`, which saves only the flows that changed.",
  },
  {
    question: "Can I give feedback on a flow and let my agent apply it?",
    answer:
      "Yes. Open the flow review page, press C, and comment on any element. When an agent is watching the flow, each comment moves from Queued through Implementing to Done as the agent works, and the agent can ask you a question right in the comment. No copying between the page and your agent. Without a watching agent, Copy prompt turns your comments into one message.",
  },
  {
    question: "Can I compare a flow in dark mode or a larger text size?",
    answer:
      "Yes. Add a `variant` line to a flow, such as `variant: appearance = light, dark`, and run `rocketsim flow <name> --all-variants`. RocketSim runs the flow in each combination of appearance, text size, and orientation, then puts your Simulator back. The review page has a Variant menu to switch between the runs.",
  },
  {
    question: "Can I turn a flow into a demo video?",
    answer:
      "Yes. `rocketsim video record --flow <name> --touches --zoom` records the flow at a watchable pace with a gliding pointer, and zooms into each tapped element. Record it again whenever your app changes to get an up-to-date video.",
  },
  {
    question: "Do flows work with RocketTrace?",
    answer:
      "Yes. Start a [RocketTrace](https://rockettrace.app/rocketsim/?utm_source=rocketsim&utm_medium=referral&utm_campaign=flows-page) recording, replay a flow with RocketSim, stop the recording, and read the ranked findings. Because the flow takes the same path every time, a trace before and after a fix compares like for like.",
  },
  {
    question: "Which RocketSim version includes Flows?",
    answer:
      "Flows ship with RocketSim 17. Install the CLI and Agent Skill from Settings → CLI & Agent.",
  },
];
