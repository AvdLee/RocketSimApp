---
title: "RocketSim CLI"
description: "Use the bundled RocketSim CLI to inspect visible elements, target the active simulator, and automate taps, swipes, typing, and other interactions."
sidebar:
  order: 2
---

RocketSim ships with a bundled CLI at `Contents/Helpers/rocketsim`. The CLI communicates with the running RocketSim app over IPC, which makes simulator interaction fast, stateful, and version-aware.

## Why it matters for agents

The RocketSim CLI is the layer that turns a running Simulator app into something agents can inspect and control.

It gives agents a compact loop:

1. Ask RocketSim which simulator is currently focused
2. Read the visible UI elements
3. Decide what to do next
4. Tap, swipe, type, or press a hardware button
5. Read the updated UI state again

That loop is fast because RocketSim is already running and connected to the Simulator.

## Key commands

### Focused simulator

Use `rocketsim simulator focused` to return the currently focused simulator as JSON.

```bash
rocketsim simulator focused
```

This returns the simulator name, runtime information, and UDID.

### Visible elements

Use `rocketsim elements` to return the visible accessibility elements on screen.

```bash
rocketsim elements [--udid <udid>] [--agent]
```

For agents, `--agent` is usually the best default because it returns a compact, pipe-delimited format with the element type, label, and center coordinates.

### Interactions

RocketSim supports the most common agent interactions through `rocketsim interact`:

- `tap`
- `long-press`
- `swipe`
- `type`
- `button`

Examples:

```bash
rocketsim interact tap --label "Continue"
rocketsim interact swipe --direction up
rocketsim interact type "hello@example.com"
rocketsim interact button home
```

## Selector-based interaction first

When possible, agents should prefer selector-based interaction such as `--label`, `--type`, or `--value`.

RocketSim will first try semantic accessibility activation, which is more reliable than a raw coordinate tap when the visual affordance does not line up perfectly with the accessibility frame.

Coordinates are still available as a fallback when the UI is visible but not exposed with a stable label.

## The `--agent` advantage

`rocketsim elements --agent` matters because it reduces verbosity without losing the information an agent usually needs to act.

That means:

- fewer tokens spent describing the current screen
- faster decision loops
- easier recovery after each interaction

## Requirements

The CLI works best when:

- RocketSim is running
- at least one iOS Simulator is booted
- the public or bundled agent skill has already resolved the correct RocketSim install

The bundled agent skill page explains how agents use this CLI in practice.
