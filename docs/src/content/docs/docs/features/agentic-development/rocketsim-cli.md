---
title: "RocketSim CLI"
description: "Install and use RocketSim's built-in CLI to inspect visible elements, automate interactions, and give agents a fast path into your running Simulator."
sidebar:
  order: 2
---

RocketSim includes a built-in CLI that lets agents inspect visible UI and interact with the Simulator through the running RocketSim Mac app. The app stays connected to the Simulator, keeps useful state warm, and exposes a compact command line surface for agents and local automation.

For agentic development, we recommend installing both the CLI and [RocketSim Agent Skill](/docs/features/agentic-development/agent-skill) from **RocketSim → Settings → CLI & Agent**.

The CLI works with the Simulator UI that is already running. It does not build, install, or launch apps from an Xcode project; use Xcode or your normal build tooling for that step, then let RocketSim inspect and interact with the app on screen.

## Installing the CLI

1. Open **RocketSim → Settings → CLI & Agent**
2. In **Command Line Tool**, click **Install Command Line Tool**
3. Choose the default selected folder if it is on your `PATH`, or pick another folder such as `/opt/homebrew/bin` or `/usr/local/bin`
4. Confirm the installation

RocketSim creates a `rocketsim` symlink in that folder. The real executable stays inside `RocketSim.app`, so App Store updates keep the command up to date automatically.

![CLI & Agent settings showing the command line tool installer](./rocketsim-cli/cli-agent-settings.png)

This symlink setup is useful for both agents and CI scripts. Anything that runs `rocketsim` from `PATH` uses the same RocketSim version you have installed.

## The agent interaction loop

The CLI gives agents a compact workflow:

1. Ask RocketSim which simulator is currently focused
2. Read the visible UI elements
3. Decide what to do next
4. Tap, swipe, type, or press a hardware button
5. Read the updated UI state
6. Repeat

That loop is fast because RocketSim is already connected to the Simulator. There is no reconnection overhead between steps, and the running app can cache and optimize work across repeated commands.

## Why RocketSim is fast for agents

RocketSim is not just a standalone command that starts from scratch every time. The CLI talks to the running Mac app, which can keep simulator state, reuse context between commands, and optimize repeated screen reads and interactions.

The CLI uses RocketSim's `rs/1` protocol for agent workflows. You do not need to learn the protocol details; it is the compact, agent-optimized layer that lets RocketSim provide reliable screen reads, interaction feedback, and recovery paths while keeping output small.

In our internal research, RocketSim's CLI completed the same agent workflows about **19% faster, avoided wrong taps entirely**, and used about **63% fewer estimated tokens** than a popular alternative.

## Key commands

### Doctor

Checks whether the CLI install, RocketSim app, IPC connection, Simulator state, accessibility permission, and snapshot store are ready for agent workflows.

```bash
rocketsim doctor
```

### Focused simulator

Returns the currently focused simulator as JSON, including name, runtime, and UDID.

```bash
rocketsim simulator focused
```

### Visible elements

Returns the accessibility elements currently visible on screen.

```bash
rocketsim elements [--udid <udid>] [--agent]
```

The `--agent` flag is the recommended default for agent workflows. It returns a compact, pipe-delimited format that is easier and cheaper for agents to process.

RocketSim's element pipeline is designed for real app navigation. It can include visible controls from top bars, navigation bars, tab bars, and other chrome that agents often need to move through a flow. When web content or other complex views expose limited accessibility data, RocketSim can add recovery hints so the agent knows when to use visual context.

### Screen summary and snapshots

For agents that need a stable view of the current screen, RocketSim provides screen and snapshot commands:

```bash
rocketsim screen
rocketsim snapshot
```

These commands are optimized for agent workflows and help agents reason about whether the screen changed after an interaction.

### Screenshot fallback

When accessibility data is not enough, agents can request a plain PNG screenshot:

```bash
rocketsim screenshot > screen.png
```

This is useful for visual fallback flows, sparse web content, or debugging what the agent sees.

### Waiting for UI changes

Agents can wait for screen changes or elements before continuing:

```bash
rocketsim wait screen-changed
rocketsim wait element --label "Continue"
```

This keeps agent flows from racing ahead before the app has finished navigating or rendering.

### Interactions

RocketSim supports the most common agent interactions through `rocketsim interact`:

```bash
rocketsim interact tap --label "Continue"
rocketsim interact tap 210 642
rocketsim interact long-press --label "Delete"
rocketsim interact swipe --direction up
rocketsim interact swipe --from 200,650 --to 200,150
rocketsim interact type "hello@example.com"
rocketsim interact button home
```

`interact` is designed to work with fresh screen state. When an agent uses the Agent Skill, RocketSim can guide it toward safer command sequences and recovery paths if the screen changes between inspection and interaction.

## Why `--agent` matters

The `--agent` flag reduces the element output from full JSON to a compact pipe-delimited format. That means fewer tokens per screen read, faster agent decision loops, and easier recovery after each interaction.

Here is the same screen in both formats:

**Default JSON output:**

```json
[
  {
    "type": "Button",
    "label": "Continue",
    "value": null,
    "role": "AXButton",
    "frame": { "x": 120, "y": 620, "w": 180, "h": 44 },
    "center": { "x": 210, "y": 642 }
  },
  {
    "type": "TextField",
    "label": "Email",
    "value": "",
    "role": "AXTextField",
    "frame": { "x": 40, "y": 320, "w": 320, "h": 44 },
    "center": { "x": 200, "y": 342 }
  },
  {
    "type": "StaticText",
    "label": "Welcome back",
    "value": null,
    "role": "AXStaticText",
    "frame": { "x": 80, "y": 120, "w": 240, "h": 32 },
    "center": { "x": 200, "y": 136 }
  }
]
```

**Agent output (`--agent`):**

```text
type|label|cx|cy
Button|Continue|210|642
TextField|Email|200|342
StaticText|Welcome back|200|136
```

The agent format contains everything an agent typically needs to decide what to do next: the element type, its label, and its center coordinates. For most interaction loops, this is all the context required.

Use the full JSON output when you need extra metadata like `value`, `role`, or the full accessibility frame.

This structured output for agents works especially well with the [RocketSim Agent Skill](/docs/features/agentic-development/agent-skill), which connects your AI coding tool to the CLI automatically. We highly recommend using the Agent Skill instead of asking an agent to invent CLI calls on its own.

## Selector-based interaction

When possible, agents should prefer targeting elements by label, type, or value instead of raw coordinates:

```bash
rocketsim interact tap --label "Submit"
rocketsim interact tap --type Button --label "OK"
rocketsim interact long-press --label "Reorder" --duration 1.5
```

RocketSim will first try semantic accessibility activation, which is more reliable than a coordinate tap when the visual affordance does not align perfectly with the accessibility frame. This matters for controls like toggles, list rows, and buttons where the tappable area is asymmetric.

Coordinates are still available as a fallback when the element is visible on screen but not exposed with a stable label.

## Named swipe directions

For common gestures, agents can use named directions instead of explicit coordinates:

```bash
rocketsim interact swipe --direction up
rocketsim interact swipe --direction back
rocketsim interact swipe --direction notification-center
rocketsim interact swipe --direction control-center
```

Valid directions: `up`, `down`, `left`, `right`, `back`, `notification-center`, `control-center`.

## Example prompts

These prompts work well with the CLI interaction loop:

> Use RocketSim to read the visible elements and tap the primary action button

> Use RocketSim to swipe through the onboarding carousel and verify each page title

> Use RocketSim to type a search query into the search field and select the first result

> Use RocketSim to press the home button, then inspect the Simulator after the app is open again

## Requirements

The CLI works when:

- RocketSim is running
- At least one iOS Simulator is booted
- The command line tool is installed from **Settings → CLI & Agent**
- The [RocketSim Agent Skill](/docs/features/agentic-development/agent-skill) has been installed so agents can discover RocketSim automatically
