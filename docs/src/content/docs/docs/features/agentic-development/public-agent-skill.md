---
title: "Public Agent Skill"
description: "Install the public RocketSim Agent Skill to help AI coding tools discover RocketSim, validate the install, and hand off to the bundled skill."
sidebar:
  order: 4
---

The public RocketSim Agent Skill is the lightweight discovery layer that helps AI coding tools find RocketSim on disk and hand off to the bundled in-app skill.

It now lives in its own repository:

- [RocketSim-Agent-Skill](https://github.com/AvdLee/RocketSim-Agent-Skill)

## What it does

The public skill is responsible for three things:

1. Finding a valid RocketSim install on disk
2. Validating that the bundled skill and CLI exist
3. Handing off to the bundled skill that matches the installed RocketSim version

It intentionally stays small so it rarely needs to change.

## Why there are two skills

RocketSim uses a two-layer architecture:

- The **public skill** is easy to install and stable over time
- The **bundled skill** ships with RocketSim itself and stays version-matched to the CLI

This keeps installation lightweight while still letting the installed app define the exact simulator automation capabilities for that release.

## Installation

The public skill supports multiple agent ecosystems, including:

- `skills.sh`
- Claude Code
- Cursor
- OpenAI-compatible tools such as Codex

For the latest installation instructions, use the dedicated repository:

- [RocketSim-Agent-Skill README](https://github.com/AvdLee/RocketSim-Agent-Skill)

## What happens after installation

Once installed, an agent can use RocketSim to:

- inspect visible UI state in the Simulator
- navigate app flows with taps, swipes, and typing
- work through repetitive flows more efficiently
- stay aligned with the RocketSim version installed on your machine
