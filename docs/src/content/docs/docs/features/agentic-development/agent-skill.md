---
title: "Agent Skill"
description: "Install the RocketSim Agent Skill to give AI coding tools a reliable, version-matched way to inspect and interact with iOS Simulator apps through RocketSim."
sidebar:
  order: 3
---

The RocketSim Agent Skill is the only part you need to install. Once installed, it automatically detects the RocketSim version on your machine, connects your agent to RocketSim's built-in interaction layer, and enables reliable Simulator automation through the RocketSim CLI.

## What you install

The RocketSim Agent Skill is a lightweight, installable skill that lives in its own repository:

- [RocketSim-Agent-Skill](https://github.com/AvdLee/RocketSim-Agent-Skill)

It supports popular AI coding tools like Claude Code, Cursor, and Codex. The easiest way to install is through [skills.sh](https://skills.sh):

```bash
npx skills add https://github.com/AvdLee/RocketSim-Agent-Skill --skill rocketsim
```

For more installation options, see the [RocketSim-Agent-Skill README](https://github.com/AvdLee/RocketSim-Agent-Skill).

## What happens after installation

When an agent triggers the RocketSim skill, the following happens automatically:

1. The skill finds a valid RocketSim installation on your machine
2. It validates that RocketSim includes the built-in skill and CLI
3. It hands off to the built-in skill, which contains the version-matched CLI reference
4. The agent can now inspect visible elements and interact with the Simulator

You do not need to configure anything beyond the initial install. The handoff is seamless.

## Why the built-in skill updates automatically

RocketSim ships a built-in skill alongside its CLI inside the app. Every time RocketSim updates, the built-in skill updates with it. That means the CLI reference your agent uses is always accurate for the RocketSim version you have installed.

This is the key advantage of the two-layer architecture:

- **The public skill** (what you install) stays small, stable, and rarely changes
- **The built-in skill** (inside RocketSim) stays version-matched and ships with every update

You get a simple installation experience and version-matched accuracy without maintaining anything yourself.

## You only install the public skill

The built-in skill is not something you install separately. It is part of the RocketSim app and is read automatically by the public skill during handoff.

If you see references to a "bundled skill" or "built-in skill" in other documentation, that is the version-matched layer inside RocketSim that the public skill connects to. You do not need to interact with it directly.

## What the agent can do after setup

Once the skill is installed and RocketSim is running, your agent can:

- Read visible accessibility elements before interacting
- Tap, long-press, swipe, and type using labels or coordinates
- Press simulator hardware buttons like Home, Lock, or Siri
- Navigate multi-step app flows with fewer retries
- Use compact `--agent` output to spend fewer tokens per screen read

## How to verify it works

Open an agent and try:

> Use RocketSim to navigate through `<your_app_name>` in the Simulator

If the skill is installed and RocketSim is running, the agent should detect RocketSim, read the visible UI, and start interacting with the app based on what is on screen.

## Learn more

- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) -- the commands agents use to inspect and interact with the Simulator
- [Agentic Development with RocketSim](/docs/features/agentic-development/) -- scenarios, example prompts, and why RocketSim is effective for agent-driven Simulator automation
