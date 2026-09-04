---
title: "rs/1 Protocol: RocketSim's Agent Protocol for the iOS Simulator"
description: "rs/1 is RocketSim's agent protocol for the iOS Simulator: one compact JSON envelope, typed errors, and screen hashes for reliable AI agent automation."
sidebar:
  order: 4
  label: "rs/1 Protocol"
head:
  - tag: script
    attrs:
      type: application/ld+json
    content: |
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the rs/1 protocol?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "rs/1 is the agent protocol designed by RocketSim that lets AI coding agents interact with the iOS Simulator through one compact JSON envelope. Every command returns the same envelope shape with typed errors, screen-state hashes, and compact element rows, so agents get reliable screen reads and interaction feedback without processing full accessibility trees."
            }
          },
          {
            "@type": "Question",
            "name": "Who created the rs/1 protocol?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "rs/1 was designed by Antoine van der Lee for RocketSim, the macOS developer tool for the iOS Simulator. It ships inside the RocketSim CLI and the RocketSim Mac app, which together provide the perception and interaction layer that agents talk to."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need to learn rs/1 to use RocketSim?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The RocketSim Agent Skill teaches your AI coding tool how to use the RocketSim CLI, and the CLI speaks rs/1 for you. You only need to know the protocol details if you build your own tooling on top of the CLI output."
            }
          },
          {
            "@type": "Question",
            "name": "Can other tools use the rs/1 approach?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The rs/1 protocol itself is implemented by RocketSim's CLI and Mac app. The underlying approach of compact output and stateful screen management is not exclusive, and other simulator tools have since adopted a similar compact-output approach."
            }
          }
        ]
      }
---

**rs/1** is the agent protocol RocketSim uses to let AI coding agents interact with the iOS Simulator. Designed by RocketSim, it wraps every agent-facing command in one compact JSON envelope with typed errors and screen-state hashes, so agents get reliable screen reads and interaction feedback without processing full accessibility trees.

You do not need to learn rs/1 to use RocketSim. The [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) speaks it for you, and the [Agent Skill](/docs/features/agentic-development/agent-skill) teaches your AI coding tool how to use the CLI safely. This page documents what the protocol is, why we designed it, and how it works.

## Why we designed rs/1

Most simulator tooling was built for humans or CI scripts, not for LLM agents. An agent pays for every byte it reads: a full accessibility tree dump can cost thousands of tokens per screen read, and an agent needs many reads to complete a task. Fire-and-forget commands make it worse, because the agent has to read the screen again after every action just to learn what happened.

rs/1 starts from a different set of goals:

- **Small output per screen read.** Compact element rows replace the full accessibility hierarchy, so a screen read costs a fraction of the context.
- **Stable interaction feedback.** Interactions report what changed, so the agent can often skip the next read entirely.
- **Typed errors with recovery paths.** Failures return a machine-parseable error code plus a recovery suggestion instead of free-form text, so agents can recover instead of guessing.
- **Screen-state hashes.** Every read carries a short hash of the current screen. Interactions can be guarded against that hash, which catches the race where the UI changes between inspection and action.
- **One consistent envelope.** Every command returns the same JSON shape, so an agent parses one format across screen reads, interactions, waits, batches, and diagnostics.

In our July 2026 three-round benchmark, this design produced **over 99% less command output** and an **about 95% lower byte-based context estimate** than the raw accessibility output of AXe 1.8.0, a deliberately low-level primitive layer. Against XcodeBuildMCP 2.7.0, which adopted a similar compact-output approach, RocketSim still produced **3.0x fewer tool-response bytes** with an 8.2x lower byte-based context estimate across the scenarios both tools could run. Read [how we test AI agents for the iOS Simulator](/blog/testing-ai-agents-ios-simulator) for the scenarios and methodology.

## How rs/1 works

Every agent-facing RocketSim CLI command emits one JSON envelope. The `rs` field carries the protocol version, `ok` tells the agent whether the command succeeded, and the payload lives in `data`:

```json
{
  "rs": "1",
  "ok": true,
  "data": {
    "mode": "act",
    "screen": "a3f291bc",
    "rows": ["7|button|Continue||enabled", "8|textField|Email||enabled"]
  }
}
```

The `rows` array shows the compact element rows concept: instead of a nested accessibility tree, each visible element becomes one pipe-delimited row with an ephemeral id, role, label, value, and state. The agent reads a handful of short rows, picks an element, and acts on it by id or label.

The `screen` field is the screen-state hash. When an agent passes that hash (or the `latest` sentinel) along with an interaction, RocketSim fails fast if the screen changed in between, instead of tapping the wrong element.

When something goes wrong, the envelope switches to a typed error:

```json
{
  "rs": "1",
  "ok": false,
  "error": {
    "code": "snapshot_changed",
    "message": "Screen has changed since hash a3f291bc.",
    "recovery_suggestion": "Re-fetch the elements and retry with the new id."
  }
}
```

Error codes such as `snapshot_changed`, `accessibility_unavailable`, and `network_extension_not_ready` are documented behaviors, and each carries context the agent can act on. That is what turns a failure into a recovery path instead of a dead end.

The protocol is served by the running RocketSim Mac app, not by a standalone binary that starts from scratch on every call. The app stays connected to the Simulator, keeps screen state warm, and refreshes snapshots after each interaction. See the [RocketSim CLI documentation](/docs/features/agentic-development/rocketsim-cli) for the full command surface, including `elements --agent`, `interact`, `wait`, and batched `do` flows.

## History and adoption

rs/1 was designed by Antoine van der Lee for RocketSim and ships inside the RocketSim CLI and Mac app. It grew out of a simple observation: RocketSim already runs alongside the Simulator all day, so it can offer agents a stateful, optimized surface that one-off commands cannot.

The protocol became the consistent wire format across all agent-facing commands, with typed errors across `elements`, `screen`, `interact`, `wait`, `do`, `snapshot`, and `doctor`. We benchmarked the result against AXe 1.8.0 and XcodeBuildMCP 2.7.0 in July 2026 and published the [methodology and results](/blog/testing-ai-agents-ios-simulator).

Other simulator tools have since adopted a similar compact-output approach. We think that is a good thing: agents everywhere benefit from smaller output and stateful screen management, and the ideas behind rs/1 are bigger than one tool.

## Frequently asked questions

### What is the rs/1 protocol?

rs/1 is the agent protocol designed by RocketSim that lets AI coding agents interact with the iOS Simulator through one compact JSON envelope. Every command returns the same envelope shape with typed errors, screen-state hashes, and compact element rows, so agents get reliable screen reads without processing full accessibility trees.

### Who created rs/1?

rs/1 was designed by Antoine van der Lee for RocketSim, the macOS developer tool for the iOS Simulator. It ships inside the RocketSim CLI and the RocketSim Mac app, which together provide the perception and interaction layer that agents talk to.

### Do I need to learn rs/1 to use RocketSim?

No. The [RocketSim Agent Skill](/docs/features/agentic-development/agent-skill) teaches your AI coding tool how to use the CLI, and the CLI speaks rs/1 for you. You only need the protocol details if you build your own tooling on top of the CLI output.

### Can other tools use the rs/1 approach?

The rs/1 protocol itself is implemented by RocketSim's CLI and Mac app. The underlying approach of compact output and stateful screen management is not exclusive, and other simulator tools have since adopted a similar compact-output approach.

## Learn more

- [Agentic Development with RocketSim](/docs/features/agentic-development/) — what agents can do with a running Simulator app
- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) — the full command surface that speaks rs/1
- [Agent Skill](/docs/features/agentic-development/agent-skill) — install the recommended agent workflow
- [How we test AI agents for the iOS Simulator](/blog/testing-ai-agents-ios-simulator) — benchmark scenarios, methodology, and results
