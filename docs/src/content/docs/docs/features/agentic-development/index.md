---
title: "Agentic Development with RocketSim"
description: "Learn how RocketSim helps AI coding agents inspect visible UI, navigate faster, and automate iOS Simulator flows through a stateful, version-aware interaction layer."
sidebar:
  order: 1
---

RocketSim gives AI coding agents a reliable way to work with your running iOS Simulator app. Instead of treating the Simulator like a fresh environment on every command, RocketSim stays connected to it, exposing the current UI state through a long-running app and its bundled CLI.

That changes what agentic development feels like in practice:

- Agents can inspect the visible UI before deciding what to do next
- Agents can navigate repetitive flows faster because they work against a stateful interaction layer
- Agents can spend fewer tokens when reading the current screen thanks to RocketSim's compact `--agent` output
- Agents can stay aligned with the RocketSim version already installed on your machine

## Why state matters

RocketSim runs continuously alongside the Simulator and communicates with its CLI over IPC. That architecture makes it easier for agents to work with the current app state instead of reconnecting from scratch for every action.

In practice, this means agents can:

- Keep navigation loops tight by reading current elements, acting, and reading again
- Use compact screen summaries instead of rehydrating large UI snapshots every time
- Lean on RocketSim's semantic accessibility actions before falling back to coordinates
- Move through repetitive app flows with less guesswork and less token overhead

## The four parts of the workflow

RocketSim's agentic development story has four layers:

1. **RocketSim** stays running beside the Simulator and exposes a bundled CLI.
2. **The RocketSim CLI** returns focused simulator state and performs interactions.
3. **The bundled agent skill** ships inside the RocketSim app and documents the exact CLI for that installed version.
4. **The public agent skill** finds RocketSim on disk, validates the install, and hands off to the bundled skill.

## Start here

Use the pages in this section to understand each layer:

- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli)
- [Bundled Agent Skill](/docs/features/agentic-development/bundled-agent-skill)
- [Public Agent Skill](/docs/features/agentic-development/public-agent-skill)
