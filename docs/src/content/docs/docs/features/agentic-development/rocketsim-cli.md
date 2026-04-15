---
title: "RocketSim CLI"
description: "Inspect visible elements, navigate screens, and automate taps, swipes, typing, and hardware button presses through RocketSim's built-in CLI."
sidebar:
  order: 2
---

RocketSim includes a built-in CLI that lets agents inspect visible UI and interact with the Simulator through a running RocketSim session. The CLI communicates with RocketSim over IPC, so interaction is fast and stateful.

## The agent interaction loop

The CLI gives agents a compact workflow:

1. Ask RocketSim which simulator is currently focused
2. Read the visible UI elements
3. Decide what to do next
4. Tap, swipe, type, or press a hardware button
5. Read the updated UI state
6. Repeat

That loop is fast because RocketSim is already connected to the Simulator. There is no reconnection overhead between steps.

## Key commands

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

> Use RocketSim to press the home button and relaunch the app

## Requirements

The CLI works when:

- RocketSim is running
- At least one iOS Simulator is booted
- The [RocketSim Agent Skill](/docs/features/agentic-development/agent-skill) has been installed so agents can discover RocketSim automatically
