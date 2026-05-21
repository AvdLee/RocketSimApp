---
title: "Agentic Development with RocketSim"
description: "Let AI coding agents see and interact with your running iOS Simulator app through RocketSim's version-matched CLI and Agent Skill."
sidebar:
  order: 1
---

RocketSim helps AI coding agents see and interact with your running Simulator app. The RocketSim Mac app stays connected to the Simulator, keeps useful state warm, and exposes a compact CLI that agents can use to inspect screens, tap controls, type text, and verify UI changes.

RocketSim does not build, install, or launch your app from source. Start the app with Xcode or your normal build tooling first, then use RocketSim for fast Simulator inspection and interaction.

With the RocketSim Agent Skill installed from **Settings → CLI & Agent**, your agent can:

- Read visible accessibility elements, including common navigation and tab bar items
- Tap, swipe, type, and navigate through your app reliably
- Stay in a tight interaction loop without rebuilding context between steps
- Use compact screen summaries to spend fewer tokens per UI read
- Fall back to screenshots when accessibility data is not enough

## What you can do with it

Agentic development with RocketSim is useful whenever you want an agent to work with a running app in the Simulator instead of just reading and writing code.

### Navigate and test app flows

Ask your agent to move through multi-step flows like onboarding, login, settings, or purchase screens. RocketSim gives the agent a way to see what is on screen and interact with it step by step.

### Validate UI after code changes

After making a code change, launch the app from Xcode or ask your agent to use your normal build tooling. Once the app is running, ask the agent to navigate to the relevant screen with RocketSim and verify that the expected elements are visible. This is faster than switching to the Simulator yourself to check.

### Reproduce bugs in context

Describe a bug and ask your agent to reproduce it in the Simulator. RocketSim lets the agent read each screen state along the way, so it can report exactly what it sees at each step.

### Automate repetitive QA flows

If you find yourself tapping through the same screens repeatedly during development, let your agent handle those flows while you focus on the code.

## Example prompts

Try these with any AI coding tool that has the RocketSim Agent Skill installed:

> Use RocketSim to navigate through the onboarding flow in the Simulator

> Use RocketSim to open the login screen, enter test credentials, and verify the home screen appears

> Use RocketSim to inspect the visible elements on screen and tap the primary CTA

> Use RocketSim to take a screenshot if the accessibility snapshot does not expose the web content clearly

> Use RocketSim to navigate to settings and toggle the feature flag for dark mode

> Use RocketSim to reproduce the crash described in this issue by navigating to the affected screen

> Use RocketSim to walk through the purchase flow and verify each step shows the correct price

## Why RocketSim is especially effective for this

### Stateful by design

RocketSim runs continuously alongside the Simulator. Because there is already a Mac app watching the active device, RocketSim can reuse state, cache expensive work, and optimize repeated agent loops in ways one-off commands cannot. In our internal research, RocketSim's CLI completed the same agent workflows about **19% faster, avoided wrong taps entirely**, and used about **63% fewer estimated tokens** than a popular alternative.

### Compact screen summaries

RocketSim's `--agent` output format gives agents a focused, token-efficient snapshot of visible elements. Instead of processing a full JSON accessibility tree, agents get a compact summary with the element type, label, and coordinates they need to act.

RocketSim also recovers many elements that are easy to miss in raw accessibility output, including top bars, navigation bars, tab bars, and visible controls that are needed to move through an app.

### Selector-based interaction

Agents can target elements by label, type, or value instead of guessing coordinates. RocketSim uses semantic accessibility activation when possible, which is more reliable than coordinate-only approaches for buttons, toggles, and list rows.

### Agent-optimized protocol

The CLI uses RocketSim's `rs/1` protocol for agent workflows. You do not need to learn the protocol details; the important part is that it is designed for compact, reliable interaction through the running RocketSim app.

### Version-matched automation

RocketSim ships the CLI and Agent Skill inside the app. When RocketSim updates, the installed command and the skill instructions can update with it, so your agent keeps using guidance that matches the RocketSim version you have installed.

## How it works

RocketSim's agentic development support has three layers:

1. **The RocketSim Mac app** keeps the live Simulator connection, caches state, and performs the optimized work.
2. **The RocketSim CLI** exposes that running app to agents through commands such as `elements`, `interact`, `wait`, `screenshot`, and `doctor`.
3. **The RocketSim Agent Skill** teaches your AI coding tool how to use the CLI safely and consistently.

Install both the command line tool and Agent Skill from **RocketSim → Settings → CLI & Agent**. RocketSim creates symlinks into your chosen folders, so the CLI and skill keep pointing at the latest installed app.

## Learn more

- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) -- how agents inspect and interact with the Simulator
- [Agent Skill](/docs/features/agentic-development/agent-skill) -- how to install the recommended agent workflow
- [CLI & Agent settings](/docs/settings/cli-and-agent) -- how to install the CLI and skill from RocketSim
