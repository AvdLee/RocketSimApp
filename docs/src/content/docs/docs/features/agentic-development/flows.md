---
title: "Navigation Flows"
description: "Save repeatable Simulator navigation paths as compact flow files, replay them with one command, and review the latest run on an interactive flow page."
sidebar:
  order: 5
  badge:
    text: "17.0.0"
    variant: note
---

::::note[Coming soon to RocketSim 17]
Navigation flows ship with RocketSim 17. The commands and the flow page on this page are not available in the current release.
::::

Navigation **flows** ship with **RocketSim 17.0.0**. They save repeatable navigation paths for an app in the Simulator so agents (and you) do not rediscover the same taps on every task or relaunch. Each flow is a small `.rsflow` text file on your Mac, scoped to the app's bundle id.

Flows run with the same reliability as `rocketsim do`, including checkpoints that catch wrong turns early. After a successful run, RocketSim can open a **flow review page** with real screenshots, arrows from tapped elements, and tools for visual feedback.

## Why flows exist

Agent tasks often restart the app or bounce between branches. Without flows, every session repeats the same login, settings, or onboarding taps. With flows:

- You save a path once from the steps the agent already performed.
- You replay it with `rocketsim flow <name>` instead of many separate interact commands.
- Leading `flow <prerequisite>` steps run only when needed, so shared setup stays DRY.

## Flows show up on their own

You do not have to ask for flows. When an agent uses RocketSim to navigate the Simulator, it saves the path as a flow
once it works and ends its answer with a link to the flow review page. Mentioning "RocketSim" and "flows" in a prompt
makes the agent record and replay them more eagerly. A typical prompt:

```text
Use RocketSim flows to sign in, open Settings, and change the display name. Save each part as a flow so we can replay
it later, and share the review link when you are done.
```

RocketSim also nudges agents from the command line: once a couple of screen-changing steps are unsaved, the reply carries a short hint
that names the save command, and the CLI & Agent settings and onboarding show the same example prompt.

## Discover and run flows

List the flows RocketSim knows for the app in the foreground (or pass `--app <bundle-id>` to scope another app):

```bash
rocketsim flow list
```

Each line is short: name, optional prerequisites, parameters, health markers such as `(stale)`, and a one-line `about` summary. Use `--match <text>` to filter the list.

Run a flow by name:

```bash
rocketsim flow login
rocketsim flow open-settings --app com.example.app
```

`rocketsim flow <name>` accepts the same `--udid` and `--app` options as other Simulator commands, plus `--from <step>` to resume after an environmental interruption and `--force` when a flow is marked stale but you want to retry anyway.

## Example: save and run a login flow

After signing in once (manually or with `rocketsim do`), save the path:

```bash
rocketsim flow save --name login --about "Sign in with the test account" --last 3
```

Without `--last`, save uses the last **five** successful session steps. Use `--from-step` and `--to-step` to save a specific portion of the log instead.

RocketSim writes minimal selectors, inserts `expect` checkpoints between screen changes, and never stores secrets—only placeholders. A typical `login` flow looks like this:

```text
name: login
about: Sign in with the test account
param: user = $TEST_USER
param: password secret = $TEST_PASSWORD
tap --identifier login.email
type '{user}'
tap --identifier login.password
type '{password}'
tap --label 'Sign In'
expect --label 'Home'
```

Run it with environment variables or explicit parameters:

```bash
export TEST_USER=alice
export TEST_PASSWORD=...
rocketsim flow login
```

For secrets, prefer shell expansion so values do not land in agent transcripts:

```bash
rocketsim flow login --param user=alice --param password=$TEST_PASSWORD
```

## Composition and prerequisites

Flows can call other flows. **Leading** `flow <name>` lines before the first real step are **prerequisites**. At run time RocketSim skips a prerequisite when that flow's final `expect` already holds (for example you are already on the home screen after sign-in). Any `flow` line **after** the first non-`flow` step always runs.

```text
name: open-settings
about: Open the settings screen from home
flow login
tap --label 'Settings'
expect --identifier settings.title
```

Run `rocketsim flow open-settings`; the `flow login` block runs only when you are not already signed in and on the expected screen.

## Parameters and secrets

Declare parameters in the flow header:

| Declaration                               | Meaning                       |
| ----------------------------------------- | ----------------------------- |
| `param: user`                             | Required                      |
| `param: user = default`                   | Literal default               |
| `param: user = $ENV_VAR`                  | Default from the environment  |
| `param: password secret = $TEST_PASSWORD` | Secret; value never persisted |

Use `{name}` in step text. Values resolve in order: `--param name=value` (or inline `flow login user=alice`) → environment variable → literal default.

Passwords and other secrets are never written into `.rsflow` files, session logs, or failure output. When save detects secure fields, steps become `type '{password}'` with a `secret` parameter. Typed passwords in failure replies are redacted the same way.

When saving, bind literals to env names with `--secret-env name=ENVVAR` and replace typed secret text with `--param name=literal`.

## When a flow fails

A failed run stops at the first bad step and returns **one compact reply** (exit code 1) with the current screen in the same payload, so the agent can continue manually without restarting the app.

- **Drift** (UI changed): the flow is marked **stale**. Navigate the corrected path, then run `rocketsim flow fix <name>` to merge your manual steps into the file. RocketSim may **heal** an unambiguous single-element rename automatically and persist the fix only if the rest of the run still passes.
- **Environmental** blockers (alerts, wrong app in foreground, a sheet that was dismissed, missing parameters): fix the blocker, then resume with `rocketsim flow <name> --from <step>`. Step numbers appear in the failure output and stay stable when prerequisites are skipped.

When a step lands on a different screen than the previous step proved, the failure names the `expected_screen`, so an agent can tell a dismissed sheet from a changed element.

`rocketsim flow verify` replays one or all flows proactively to catch drift before a task starts.

## Where flows are stored

Flows live in RocketSim's sandbox on **this Mac**, under Application Support:

`RocketSim/Flows/<bundle-id>/flows/<name>.rsflow`

They are per app bundle id, not per Xcode project or git branch. The same app on the same Mac shares flows across worktrees. `rocketsim flow list` is the supported way to see what is available; agents should not read `.rsflow` bodies for routine navigation.

Keep flows in your repository as `.rsflow` files and load them into RocketSim's flow store with `rocketsim flow sync --dir <folder>`. The sync writes every `.rsflow` file in dependency order and skips flows that did not change. Use `--dry-run` to preview, `--app <bundle-id>` to target an app, and `--prune` to remove flows the folder no longer contains. Commit the folder with your project and run the sync in a fresh checkout or a new worktree.

`flow sync --dir` is the only command that reads files from outside RocketSim's sandbox, such as an agent's temporary folder: the `rocketsim` launcher copies the files in before the sandboxed helper reads them. `flow write` reads the flow from stdin only.

## Flow review page

Every complete flow run records checkpoint screenshots and accessibility snapshots. Open the review UI from Terminal:

```bash
rocketsim flow open
rocketsim flow open login
```

`flow open` returns a **token-protected localhost URL** on the same browser preview server as `rocketsim preview`. The link is read-only, only opens flow pages, and keeps working across RocketSim restarts, so you can keep the tab open while an agent works. The page refreshes by itself when a run adds screens. `rocketsim flow open --new-link` rotates the link; an old link then shows a page that says it expired instead of an error. A newly saved flow shows its steps until the first successful run adds screens.

![Stock Analyzer demo flow in Annotated mode with accessibility overlays and step arrows](./flows/flows-tour-annotated.webp)

The board shows one card per recorded checkpoint, in order, so a screen that appears twice (for example before and after typing) keeps both screenshots. Add `?view=screens` to the URL to merge repeated screens into one card each. Connectors from the tapped element to the next screen. Toggle **Annotated** (default) or **Clean** routes, show or hide the device bezel, and turn accessibility overlays on or off. Hover and select elements to inspect labels and identifiers; the **Screens** sidebar lists the element tree with search and keyboard navigation.

![The same Stock Analyzer demo flow in Clean mode without overlays](./flows/flows-tour-clean.webp)

Pan and zoom the canvas with the mouse, trackpad, or keyboard. Comment mode (**C**) lets you attach notes to elements; pins appear on the screenshot. The **Comments** sidebar groups notes by screen, includes a prompt preview, and **Copy prompt** builds an agent-ready message from your comments. Comments are stored in the browser's `localStorage` for that flow run—they are not written into the flow store.

![Comments sidebar with prompt preview on the Stock Analyzer demo flow](./flows/flows-comments-sidebar.webp)

![Overview of a recorded Stock Analyzer demo tour on the flow page](./flows/flows-stock-tour-overview.webp)

### Keyboard shortcuts

On the flow canvas (when focus is not in a text field):

| Key        | Action                                 |
| ---------- | -------------------------------------- |
| `C`        | Toggle comment mode                    |
| `+` / `=`  | Zoom in                                |
| `-` / `_`  | Zoom out                               |
| `0`        | Actual size (100%)                     |
| `F` or `1` | Fit the board                          |
| Arrow keys | Pan (hold **Shift** for a larger step) |
| `Esc`      | Clear selection                        |

Double-click the canvas to fit the board. In comment mode, **Cmd/Ctrl+Enter** submits a new comment.

Replies after navigation commands also carry a short `!flows <url>` line (and `!flow N steps recorded; save with: rocketsim flow save --name <name>` when steps are waiting to be saved). Successful `flow save` and `flow run` replies may include `flow_url` the first time and again about every ten minutes—surface it once as `Flow review: <url>` for humans following along.

## Limits and requirements

Flows need a **booted Simulator session** with your app reachable the same way as other `rocketsim` commands. `flow open` starts or reuses a browser preview tied to that Simulator; it cannot serve a flow page without a booted device.

Flow commands count toward the same **agent-session allowance** as other interaction and capture commands. When the allowance is exhausted, RocketSim returns `quota_exceeded` and agents should stop further flow runs for that task; read-only inspection still works. Open **RocketSim → Settings → CLI & Agent** to view the allowance or upgrade to Pro.

Keep individual flows to about **15 steps**; split longer paths with a leading `flow` prerequisite. Prefer descriptive names and `flow list` over hand-editing files—use `flow show` or `flow write` only when you need to author a flow manually.

## Learn more

- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) — the broader command surface flows build on
- [Browser Preview](/docs/features/agentic-development/browser-preview) — the localhost preview server flows reuse
- [Agent Skill](/docs/features/agentic-development/agent-skill) — how agents discover `flow list`, handle failures, and use the flow review URL
- [CLI & Agent settings](/docs/settings/cli-and-agent) — install the CLI and check agent-session allowances
