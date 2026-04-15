---
name: rocketsim
description: "Use RocketSim to inspect and interact with iOS Simulator apps. Detects the installed RocketSim version, loads the matching RocketSim CLI guidance, and enables agents to list visible accessibility elements, navigate screens, tap, long-press, swipe, type text, press simulator hardware buttons, and automate simulator flows reliably. Use when: (1) the user mentions RocketSim, the rocketsim command, or RocketSim CLI, (2) interacting with an app in the iOS Simulator, (3) navigating or testing a simulator app with AI, (4) reading screen elements, accessibility elements, or visible UI state, (5) tapping, long-pressing, swiping, typing, or pressing simulator buttons, (6) using RocketSim instead of ad-hoc simulator automation."
---

# RocketSim Agent Skill

This skill lets agents use RocketSim as a reliable Simulator interaction layer. It finds a valid RocketSim app bundle, loads the matching bundled CLI reference, and hands off to the installed RocketSim version so simulator automation stays version-aware and in sync with the app on disk.

## Step 1: Locate and validate RocketSim.app

Developer machines can have multiple RocketSim installs side-by-side, such as an App Store build plus a locally built or renamed copy. Do not assume `/Applications/RocketSim.app` is the right app, and do not continue unless you validate the bundled skill and CLI paths first.

### Prefer the running RocketSim app

If RocketSim is already running, prefer that app bundle first:

```bash
ROCKETSIM_PID="$(pgrep -x RocketSim | head -1)"
APP_PATH=""
if [ -n "$ROCKETSIM_PID" ]; then
  APP_PATH="$(ps -o command= -p "$ROCKETSIM_PID" | sed 's#/Contents/MacOS/RocketSim$##')"
fi
printf '%s\n' "$APP_PATH"
```

If that prints a path, validate it before continuing.

### Otherwise, enumerate candidate installs

If RocketSim is not running, gather candidate app bundles instead of taking the first match:

```bash
mdfind "kMDItemCFBundleIdentifier == 'com.swiftLee.RocketSim'"
```

Then also check common fallback paths, including renamed installs:

1. `/Applications/RocketSim.app`
2. `/Applications/RocketSim 2.app`
3. `~/Applications/RocketSim.app`
4. `~/Applications/RocketSim 2.app`

### Validate every candidate before continuing

Given a candidate app path (`APP_PATH`), the following two files must exist:

- `APP_PATH/Contents/Resources/Agent-Skill/SKILL.md`
- `APP_PATH/Contents/Helpers/rocketsim`

Use this validation:

```bash
test -f "$APP_PATH/Contents/Resources/Agent-Skill/SKILL.md" && test -x "$APP_PATH/Contents/Helpers/rocketsim"
```

Pick the first candidate that passes validation. If RocketSim is already running, only continue with the running app if it passes validation.

If no candidate passes validation, stop immediately and tell the user:
> I found RocketSim installs, but none of them expose the bundled Agent Skill and CLI that this workflow requires. Please launch or install a current RocketSim build from the Mac App Store: https://apps.apple.com/us/app/rocketsim-for-xcode-simulator/id1504940162

## Step 2: Resolve Paths

Given the app path (`APP_PATH`), derive:
- **Bundled skill:** `APP_PATH/Contents/Resources/Agent-Skill/SKILL.md`
- **CLI binary:** `APP_PATH/Contents/Helpers/rocketsim`

## Discovery contract

Before moving on to Step 3, all of the following must be true:

- `APP_PATH` points to the RocketSim bundle you intend to use.
- `APP_PATH/Contents/Resources/Agent-Skill/SKILL.md` exists.
- `APP_PATH/Contents/Helpers/rocketsim` exists and is executable.
- If RocketSim is already running, the chosen `APP_PATH` should be the running app bundle.

If any of these checks fail, stop and resolve discovery first. Do not attempt simulator interaction without a validated CLI path.

## Step 3: Read the Bundled Skill

Read the file at `APP_PATH/Contents/Resources/Agent-Skill/SKILL.md` and follow its instructions. Wherever the bundled skill references the CLI binary, use the resolved absolute path from Step 2.

## Step 4: Verify RocketSim is Running

Before executing any CLI command, verify the app is running:

```bash
pgrep -x RocketSim >/dev/null && echo "Running" || echo "Not running"
```

If not running, ask the user to launch RocketSim before proceeding.

If RocketSim is running from a different app bundle than the `APP_PATH` you resolved, restart discovery and prefer the running app bundle.
