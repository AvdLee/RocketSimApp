---
name: "Agentic iOS development"
tagLine: "Let your AI coding agent see and control the Simulator"
featurePage: "agentic-development"
blogSlug: "testing-ai-agents-ios-simulator"
asset:
  type: "video"
  path: "/features/agentic-demo.mp4"
  alt: "RocketSim CLI and Agent Skill demo showing an AI coding agent inspecting and interacting with a running iOS Simulator app."
  alignment: "full-width"
  columnSpan: 12
---

RocketSim ships a version-matched `rocketsim` CLI and Agent Skill so Cursor, Xcode, Claude, Codex, and other AI coding tools can inspect and interact with your running Simulator app.

- Read compact `nav`, `act`, and `debug` screen summaries
- Tap, activate, swipe, scroll, type, use multitouch, and press hardware buttons
- Answer Face ID prompts and test offline or poor-network states
- Batch known steps while RocketSim refreshes screen state
- Validate setup with `rocketsim doctor`
- Keep the CLI and Agent Skill in sync through app updates

On the public [simulator-use benchmark](https://simulator-use.dev/benchmarks) in November 2026, a RocketSim sign-in took **2.7 seconds on 161 tokens**, the lowest token count and the second fastest of ten tools: **9.7× fewer tokens** than XcodeBuildMCP (now MobileBuildMCP) and **79× fewer** than Xcode MCP. Its **0.35 second tap** is the quickest among the tools that report what the tap did.
