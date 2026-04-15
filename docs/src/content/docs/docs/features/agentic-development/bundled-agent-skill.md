---
title: "Bundled Agent Skill"
description: "Understand the version-matched agent skill that ships inside RocketSim and explains exactly how the bundled CLI should be used."
sidebar:
  order: 3
---

RocketSim ships with a bundled agent skill inside the app itself at:

```text
RocketSim.app/Contents/Resources/Agent-Skill/SKILL.md
```

This file is the source of truth for the installed RocketSim version. It documents the exact CLI commands, interaction workflow, and error handling that match the app you have on disk.

## Why it is bundled inside the app

Bundling the skill inside RocketSim has one big advantage: the skill and the CLI ship together.

That means agents do not need to guess whether a README, a GitHub repo, or an older release note still matches the installed CLI. They can read the bundled skill directly and know they are using guidance that matches the current RocketSim build.

## What it contains

The bundled skill documents:

- the CLI command groups and their syntax
- the recommended interaction loop for agents
- error handling and recovery patterns
- tips for selector-based targeting, coordinate fallbacks, and token-efficient usage

## Recommended agent loop

The bundled skill teaches agents to work in a simple loop:

1. Get the focused simulator
2. Read visible elements
3. Choose the next interaction mode
4. Perform the interaction
5. Re-fetch the visible elements
6. Repeat

This is what makes RocketSim feel like a strong fit for agentic development: agents can operate against the current UI state rather than guessing ahead.

## Why it improves reliability

Because the bundled skill ships with the app, RocketSim can evolve the CLI and the matching instructions together.

That gives agents:

- version-matched guidance
- fewer broken assumptions after updates
- a tighter handoff from discovery to interaction

## How agents discover it

Most agents do not jump straight to the bundled skill on their own. They first use the public RocketSim Agent Skill, which finds RocketSim on disk, validates the install, and then points the agent at this bundled file.
