---
name: rocketsim
description: "Interact with iOS Simulator apps using the RocketSim CLI. Read on-screen accessibility elements, send tap events, and automate simulator interaction. Use when: (1) interacting with a simulator app, (2) tapping a simulator element or button, (3) reading screen elements or accessibility elements, (4) RocketSim CLI or rocketsim command, (5) automating simulator UI, (6) testing an app in the simulator with AI, (7) simulating user taps or touches."
---

# RocketSim Agent Skill

This skill locates the installed RocketSim app and loads its bundled CLI reference. All command knowledge lives inside the app bundle so it stays in sync with the installed version.

## Step 1: Locate RocketSim.app

Run the following to find the app:

```bash
mdfind "kMDItemCFBundleIdentifier == 'com.rocketsim.app'" | head -1
```

If that returns empty, check these fallback paths in order:
1. `/Applications/RocketSim.app`
2. `~/Applications/RocketSim.app`

If RocketSim is not found, tell the user:
> RocketSim is not installed. Install it for free from the Mac App Store: https://apps.apple.com/app/rocketsim-launch-deeplinks/id1504940162

## Step 2: Resolve Paths

Given the app path (`APP_PATH`), derive:
- **Bundled skill:** `APP_PATH/Contents/Resources/Agent-Skill/SKILL.md`
- **CLI binary:** `APP_PATH/Contents/Helpers/rocketsim`

## Step 3: Read the Bundled Skill

Read the file at `APP_PATH/Contents/Resources/Agent-Skill/SKILL.md` and follow its instructions. Wherever the bundled skill references the CLI binary, use the resolved absolute path from Step 2.

## Step 4: Verify RocketSim is Running

Before executing any CLI command, verify the app is running:

```bash
pgrep -x RocketSim >/dev/null && echo "Running" || echo "Not running"
```

If not running, ask the user to launch RocketSim before proceeding.
