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
Navigation flows ship with RocketSim 17. The commands, the flow page, and online sharing on this page are not available in the current release.
::::

Navigation **flows** ship with **RocketSim 17.0.0**. They save repeatable navigation paths for an app in the Simulator so agents (and you) do not rediscover the same taps on every task or relaunch. Each flow is a small `.rsflow` text file on your Mac, scoped to the app's bundle id.

Flows run with the same reliability as `rocketsim do`, including checkpoints that catch wrong turns early. After a successful run, RocketSim can open a **flow review page** with real screenshots, arrows from tapped elements, and tools for visual feedback. When you want someone else to look at a flow, such as a translator or a designer, you can [share it online](#share-a-flow-online) as a read-only page and collect their comments. Sharing is off until you turn it on.

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

`rocketsim flow verify` replays one or all flows proactively to catch drift before a task starts. Add `--branches` to replay a flow and every flow that starts with it, trunk first.

## Compare a flow in different looks

Compare one flow in light and dark, with different text sizes, or in portrait and landscape. Add a `variant` header to the flow:

```text
name: open-settings
about: Open the settings screen from home
variant: appearance = light, dark
flow login
tap --label 'Settings'
expect --identifier settings.title
```

Then run every combination or a single one:

```bash
rocketsim flow open-settings --all-variants
rocketsim flow open-settings --variant appearance=dark
```

The axes are `appearance` (`light`, `dark`), `dynamic-type` (`extra-small` up to `accessibility-extra-extra-extra-large`), and `orientation` (`portrait`, `landscape`). A flow can use up to three axes and twelve combinations, and the first value is the baseline the flow is written for. RocketSim sets the Simulator, runs the flow, and puts the Simulator back afterwards. A failure in another variant is a finding about your app, not a stale flow, so it does not mark the flow as stale. The flow review page gets a **Variant** menu in the sidebar to switch between the runs.

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

Pan and zoom the canvas with the mouse, trackpad, or keyboard.

### Switch between flows

When an app has more than one flow, the **Screens** sidebar starts with a flow picker. Choose another flow and the board changes in place, without going back to the list, and your view settings stay. Screens are spaced further apart, so you can see the line leaving each screen before its label.

### See several flows as a tree

Flows that start with the same flow, such as pin, rename, and delete after "open the chat menu", show as one tree. Open the first flow and choose **Tree** to see every branch fan out from the screen they share. The branches of a fork stack under each other, and a note lists menu items that no flow covers yet. Replay the whole tree with `rocketsim flow verify <name> --branches`.

### Give feedback and let your agent apply it

The flow page is a live feedback canvas. Comment mode (**C**) lets you attach notes to elements, and pins appear on the screenshot. RocketSim keeps your comments, so they survive a reload. The **Comments** sidebar splits them into **Queued** and **Done**.

When an agent is watching the flow, the page shows it, and each comment moves through Queued, Implementing, and Done as the agent works, with its notes next to the comment. When the agent needs more information, it asks a question in the comment and you answer in the page. Nothing needs to be copied between the page and your agent.

Agents watch for comments with `rocketsim flow feedback <name> --watch`, apply them, and report back with `--resolve`. The [Agent Skill](/docs/features/agentic-development/agent-skill) teaches agents this loop. When no agent is watching, use **Copy prompt** to build an agent-ready message from your comments.

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

## Share a flow online

RocketSim can publish a read-only snapshot of a flow at `flows.rocketsim.app`, so a reviewer can open it in a browser and comment on screens, and your agent can apply the comments you approve. Sharing is strictly opt-in and off by default. Nothing leaves your Mac unless you turn sharing on and confirm a preview of what goes online.

You manage sharing yourself on the flow page. Agents cannot publish, unpublish, or approve comments. Follow the [Share a flow and collect feedback](/tutorials/share-a-flow-for-feedback/) tutorial for a complete example.

### Turn on sharing and publish

Open the flow page with `rocketsim flow open <name>` and click the **Share** button in the toolbar. The **Share online** panel has three tabs: **Share**, **Reviews**, and **Settings**.

1. **Unlock sharing.** The panel asks for Touch ID or your Mac password, so an agent that can open the page cannot publish or approve comments for you. The unlock lasts a short time. **Lock sharing now** in **Settings** ends it earlier.
2. **Turn on online sharing.** The first time, a short disclosure explains what leaves your Mac. Confirm it with **Turn on**. You can also change this later with **Allow sharing flows online** in **Settings**.
3. **Check the preview.** Before every publish, the panel shows each screen, what goes online, and what stays on your Mac. Uncheck a screen to leave it out, or mask a screen.
4. **Confirm your email.** The first time, enter an owner email. RocketSim sends you a link to confirm it, and the flow goes live once you do.
5. **Publish.** Choose **Publish version 1**. The panel then shows the link, with **Copy link**.

![The Share online panel with a preview of the screens that go online, what stays on the Mac, and the owner email](./flows/flows-share-panel-preview.webp)

If your team turned online sharing off for your Mac, the panel says so and offers no actions.

### What is shared, and what is not

- **Shared:** Screenshots, element labels, screen titles, and the app name, icon, and version.
- **Not shared:** Your steps and commands, parameter values and defaults, secrets, the bundle ID, masked areas, and screens you leave out.

Masks are applied to the screenshot on your Mac before upload, so RocketSim's servers never receive the masked pixels. Screenshots show whatever was on screen, including names and other test data you typed, so mask anything real before you publish.

### The link and the viewer

A published flow has a link such as `flows.rocketsim.app/<id>/<flow-name>`. The id is random, so the link cannot be guessed, and RocketSim does not list or index shared flows. Anyone you send the link to can look at the flow. The page is read-only and carries a **Made with RocketSim** badge. Only you can change it, by publishing a new version.

### Reviewers confirm their email and comment

A reviewer can look without an account. To comment, they enter their email address and an optional name, and RocketSim emails them a link to confirm it. Comments are plain text of up to 500 characters, and links in comments are rejected. Each reviewer sees only their own comments. You see all of them, with the reviewer's name and email address, in the **Reviews** tab. RocketSim emails you when new comments arrive, at most once per flow every six hours.

![The shared flow in the browser, with the reviewer's comments on screens and the owner's Made with RocketSim badge](./flows/flows-shared-viewer-comments.webp)

### Approve comments before your agent sees them

Comments from reviewers are text from other people, so nothing reaches your agent until you approve it. Open the **Reviews** tab, then **Approve** or **Reject** each comment. **Undo** changes your mind, and **Approve all** approves what is pending.

![The Reviews tab with pending comments to approve or reject and one approved comment](./flows/flows-share-reviews-tab.webp)

Then ask your agent to apply the feedback. It runs `rocketsim flow share-feedback <name>`, which returns only the approved comments, as quoted app data and not as instructions. Your agent never sees reviewer emails or names, only labels such as "Reviewer 2".

### Publish a new version

Every publish creates a new immutable version, and the link always shows the latest one. Earlier versions stay viewable. Local changes to a flow never touch what you published. When you publish a new version, the approved comments are marked as resolved, and reviewers see **Fixed in version N** on their own comments, which they can reopen.

### Unpublish a flow

Choose **Unpublish** in the **Share** tab. The link stops working, and the flow, its versions, and its comments are deleted. An unpublished flow shows the same "not found" page as a link that never existed.

### How long a flow stays online

A shared flow goes offline 30 days after its last activity. A view, a comment, a new version, and a renewal count as activity. A view counts when someone opens the flow in a browser, at most once an hour, so link previews and crawlers do not keep a flow online. RocketSim emails you 7 days before a flow goes offline, with a link to renew it in one click. You can also renew it from your account page.

### Your flows on the website

At `flows.rocketsim.app`, you can log in with your email address and see your flows. RocketSim emails you a link to log in, or to register the first time. Each flow lists its status, latest version, last update, the date it goes offline, and the number of open comments.

![The account page at flows.rocketsim.app with three shared flows and their status](./flows/flows-account-overview.webp)

- **Open flow** opens the flow in owner view, with all comments.
- **Copy link** copies the link to share.
- **Keep online** renews the flow for another 30 days.

The website never unpublishes or deletes a flow. Those actions stay on your Mac, in the Share panel.

### Commands for shared flows

| Command                                | What it does                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `rocketsim flow publish <name>`        | Opens the Share panel for the flow in your browser. You publish from there.                          |
| `rocketsim flow unpublish <name>`      | Opens the Share panel in your browser. You unpublish from there.                                     |
| `rocketsim flow share-status <name>`   | Opens the Share panel in your browser, which shows the status of the flow.                           |
| `rocketsim flow share-feedback <name>` | Returns the reviewer comments you approved, as quoted data. Add `--app <bundle-id>` to scope an app. |

The first three commands only open the Share panel, so a person always makes the decision. An agent cannot publish, unpublish, or approve comments with them.

### Limits for online sharing

- 5 live flows per owner
- 10 versions per flow
- 16 screens per version
- 500 characters per comment
- 50 comments per reviewer per version

RocketSim also limits how often people can sign in and comment, to prevent abuse.

### Privacy of shared flows

Online sharing only applies when you choose to share a flow. Without it, flow data stays on your Mac, and opening a public flow link does not send anything from your Mac. When you do share, RocketSim processes your email address, the flow content you publish, and the email addresses and comments of reviewers. The [privacy statement](/privacy/#online-sharing) lists what we process, which providers we use, and how long we keep it.

## Record a demo video

Turn a flow into a polished demo video, for example for an App Store preview:

```bash
rocketsim video record --flow login --touches --zoom > demo.mp4
```

RocketSim starts the recording, runs the flow at a watchable pace with a pointer that glides from tap to tap, zooms into each tapped element, and ends the recording when the flow does. When your app changes, record the flow again to get an up-to-date video. See [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) for the styling options.

## Limits and requirements

Flows need a **booted Simulator session** with your app reachable the same way as other `rocketsim` commands. `flow open` starts or reuses a browser preview tied to that Simulator; it cannot serve a flow page without a booted device.

Flow commands count toward the same **agent-session allowance** as other interaction and capture commands. When the allowance is exhausted, RocketSim returns `quota_exceeded` and agents should stop further flow runs for that task; read-only inspection still works. Open **RocketSim → Settings → CLI & Agent** to view the allowance or upgrade to Pro.

Keep individual flows to about **15 steps**, and keep the `about` summary to **80 characters**; split longer paths with a leading `flow` prerequisite. Prefer descriptive names and `flow list` over hand-editing files—use `flow show` or `flow write` only when you need to author a flow manually.

## Learn more

- [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli) — the broader command surface flows build on
- [Browser Preview](/docs/features/agentic-development/browser-preview) — the localhost preview server flows reuse
- [Agent Skill](/docs/features/agentic-development/agent-skill) — how agents discover `flow list`, handle failures, and use the flow review URL
- [Share a flow and collect feedback](/tutorials/share-a-flow-for-feedback/): publish a flow, collect reviewer comments, and apply them with your agent
- [CLI & Agent settings](/docs/settings/cli-and-agent) — install the CLI and check agent-session allowances
