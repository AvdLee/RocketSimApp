---
title: "Agentic Development with RocketSim"
description: "Let AI coding agents see and interact with your running iOS Simulator app. Automate repetitive flows, validate UI states, and navigate faster without re-describing the screen on every step."
sidebar:
  order: 1
---

RocketSim helps AI coding agents see and interact with your running Simulator app. That makes it possible to automate repetitive flows, validate UI states, and move through app navigation faster without re-describing the screen on every step.

With the RocketSim Agent Skill installed and RocketSim running, your agent can:

- Read visible accessibility elements before deciding what to do
- Tap, swipe, type, and navigate through your app reliably
- Stay in a tight interaction loop without losing context between steps
- Spend fewer tokens by using RocketSim's compact screen summaries

## What you can do with it

Agentic development with RocketSim is useful whenever you want an agent to work with a running app in the Simulator instead of just reading and writing code.

### Navigate and test app flows

Ask your agent to move through multi-step flows like onboarding, login, settings, or purchase screens. RocketSim gives the agent a way to see what is on screen and interact with it step by step.

### Validate UI after code changes

After making a code change, ask your agent to launch the app, navigate to the relevant screen, and verify that the expected elements are visible. This is faster than switching to the Simulator yourself to check.

### Reproduce bugs in context

Describe a bug and ask your agent to reproduce it in the Simulator. RocketSim lets the agent read each screen state along the way, so it can report exactly what it sees at each step.

### Automate repetitive QA flows

If you find yourself tapping through the same screens repeatedly during development, let your agent handle those flows while you focus on the code.

## Example prompts

Try these with any AI coding tool that has the RocketSim Agent Skill installed:

> Use RocketSim to navigate through the onboarding flow in the Simulator

> Use RocketSim to open the login screen, enter test credentials, and verify the home screen appears

> Use RocketSim to inspect the visible elements on screen and tap the primary CTA

> Use RocketSim to navigate to settings and toggle the feature flag for dark mode

> Use RocketSim to reproduce the crash described in this issue by navigating to the affected screen

> Use RocketSim to walk through the purchase flow and verify each step shows the correct price

## Why RocketSim is especially effective for this

### Stateful by design

RocketSim runs continuously alongside the Simulator. It maintains a live connection, so agents work against the current app state rather than reconnecting from scratch on every command. That keeps interaction loops tight and reduces the amount of context agents need to rebuild between steps.

### Compact screen summaries

RocketSim's `--agent` output format gives agents a focused, token-efficient snapshot of visible elements. Instead of processing a full JSON accessibility tree, agents get a compact pipe-delimited summary with just the element type, label, and coordinates they need to act.

### Selector-based interaction

Agents can target elements by label, type, or value instead of guessing coordinates. RocketSim uses semantic accessibility activation when possible, which is more reliable than coordinate-only approaches for buttons, toggles, and list rows.

### Version-matched automation

RocketSim ships a built-in skill alongside its CLI. That means the interaction instructions agents receive always match the installed RocketSim version. When RocketSim updates, the built-in skill updates with it automatically.

## How it works

RocketSim's agentic development support has three layers:

1. **The RocketSim CLI** lets agents inspect visible elements and perform interactions through a stateful connection to the Simulator.
2. **The built-in skill** ships inside RocketSim and documents the exact CLI for that installed version, so agents always use version-matched guidance.
3. **The RocketSim Agent Skill** is the installable entry point that discovers RocketSim on your machine and hands off to the built-in layer automatically.

You only install the public Agent Skill. RocketSim handles the rest.

## Learn more

- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) -- how agents inspect and interact with the Simulator
- [Agent Skill](/docs/features/agentic-development/agent-skill) -- what to install and how the architecture works
