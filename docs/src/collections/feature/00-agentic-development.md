---
showOnHomepage: true
name: "Agentic iOS development"
tagLine: "Let your AI coding agent see and control the Simulator"
featurePage: "agentic-development"
asset:
  type: "video"
  path: "/features/agentic-demo.mp4"
  alt: "RocketSim CLI and Agent Skill demo showing an AI coding agent inspecting and interacting with a running iOS Simulator app."
  alignment: "full-width"
  columnSpan: 12
---

RocketSim ships a version-matched `rocketsim` CLI and Agent Skill so Cursor, Xcode, Claude, Codex, and other AI coding tools can inspect and interact with your running Simulator app.

- Read compact visible-element summaries with fewer tokens per screen read
- Tap, swipe, type, wait, and capture screenshots through the running RocketSim app
- Use selector-based interactions instead of fragile coordinate-only taps
- Validate setup with `rocketsim doctor`
- Keep the CLI and Agent Skill in sync through app updates

In our July 2026 head-to-head benchmark against the AXe 1.8 CLI, AXe emitted **138.8× more command output** and had a **23.4× higher byte-based context estimate**. RocketSim completed the measured command work in **32% less total time**. The context estimate is a reproducible proxy, not actual model-token or billing usage.

[Read the Agentic Development docs](/docs/features/agentic-development/) or [review the benchmark methodology and results](https://github.com/AvdLee/RocketSim/blob/master/docs/agent-protocol/eval/2026-07-24-axe-1.8-and-device-hub.md).
