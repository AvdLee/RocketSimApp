---
title: "CLI & Agent"
description: "Install RocketSim's command line tool and bundled Agent Skill from Settings so agents and scripts use the latest installed app version."
---

Use **RocketSim → Settings → CLI & Agent** to install the `rocketsim` command line tool and the RocketSim Agent Skill.

This is the recommended setup for agentic development. The command line tool gives agents a fast way to interact with the running Simulator through RocketSim, while the Agent Skill teaches your AI coding tool how to use that CLI reliably.

## Install the command line tool

1. Open **RocketSim → Settings → CLI & Agent**
2. In **Command Line Tool**, click **Install Command Line Tool**
3. Choose the default selected folder if it is on your `PATH`, or pick another folder such as `/opt/homebrew/bin` or `/usr/local/bin`
4. Confirm the installation

RocketSim creates a `rocketsim` symlink in the folder you choose. The real executable stays inside `RocketSim.app`.

![CLI & Agent settings showing the command line tool installer](./cli-and-agent/cli-agent-settings.png)

That means:

- `rocketsim` is available from Terminal, agents, and CI scripts
- The command stays tied to the RocketSim app you installed
- App Store updates keep the command up to date automatically
- Repairing the install updates the symlink if RocketSim moved

## Install the Agent Skill

The Agent Skill is installed from the same settings page.

1. Open **RocketSim → Settings → CLI & Agent**
2. Install the command line tool first if it is not installed yet
3. In **Agent Skill**, choose **General Agents**
4. Click **Install**
5. Restart or refresh your tool if it does not detect new skills automatically

RocketSim installs the skill as a symlink to the bundled skill inside the app. The skill and CLI are version-matched, so your agent receives instructions that match the RocketSim version it is controlling.

![CLI & Agent settings showing Agent Skill installation options](./cli-and-agent/cli-agent-settings.png)

We recommend **General Agents** because it installs into the shared `.agents/skills` location. Multiple AI coding tools can reuse that same version-matched RocketSim skill. Use a tool-specific destination only if your tool does not scan the shared location.

## Why this setup is recommended

The RocketSim Mac app is already running beside the Simulator. It can keep state, cache expensive work, and optimize repeated agent loops. The CLI exposes that running app to agents, and the Agent Skill helps agents use the CLI in the right order.

In our internal research, RocketSim's CLI completed the same agent workflows about **19% faster, avoided wrong taps entirely**, and used about **63% fewer estimated tokens** than a popular alternative.

## Verify the setup

Run:

```bash
rocketsim doctor
```

The doctor command checks whether RocketSim, the CLI install, the Simulator, accessibility permissions, and agent workflow state are ready.

Then ask your AI coding tool:

> Use RocketSim to inspect the visible elements in the focused Simulator

If everything is installed correctly, the agent should use RocketSim to read the current screen and continue from there.

## Troubleshooting

### The command is not found

Make sure you chose a folder that is on your shell `PATH`. You can reinstall from **Settings → CLI & Agent** and choose another folder.

### RocketSim says the command needs repair

The existing `rocketsim` symlink points somewhere unexpected. Click **Repair Command Line Tool** to point it back to the current RocketSim app.

### My agent does not see the skill

Some AI coding tools only scan skill folders when they start. Restart the tool or reload its workspace after installing the skill.

### I use a custom skill folder

Use **Choose Custom Skill Folder...** in the Agent Skill section and select the folder your tool scans for skills.
