---
title: "Accessibility Audit for the iOS Simulator"
description: "Audit the iOS Simulator screen for missing labels, small tap targets, low contrast, and VoiceOver issues in RocketSim's UI, or automate audits, fixes, and validation with the CLI."
sidebar:
  label: "Accessibility Audit"
  order: 3
faq:
  - question: "How do I run an accessibility audit on the iOS Simulator?"
    answer: "Open RocketSim's Accessibility window, select the Audit tab, and click Run Audit. You get a score, findings grouped by rule, highlights on the Simulator, and a prompt you can copy to your AI agent. You can also run `rocketsim accessibility-audit` from the command line."
  - question: "Does the accessibility audit require RocketSim Pro?"
    answer: "The Audit tab in the side window requires RocketSim Pro. The `rocketsim accessibility-audit` CLI command does not."
  - question: "Can an AI agent fix accessibility issues automatically?"
    answer: "Yes. Copy the prompt from the Audit tab, or let your agent run `rocketsim accessibility-audit` itself. The agent fixes the findings, rebuilds, and runs the audit again to validate the result."
---

Reviewing accessibility by hand takes time, and it's easy to miss a missing label or a tap target that's just a few points too small. The **Audit** tab in RocketSim's Accessibility window checks the current Simulator screen for you.

You can run an audit in two ways:

- **In the UI** — Click **Run Audit** in the side window to see a score, review findings, highlight affected elements, and copy a fix prompt for your agent.
- **From the CLI** — Run `rocketsim accessibility-audit` to automate audits, fixes, and validation, for example in an agent loop.

<!-- prettier-ignore -->
<video src="/features/accessibility-audit.mp4" aria-label="Running an accessibility audit from RocketSim's Accessibility window, reviewing the score and findings, and highlighting affected elements on the Simulator." controls autoplay muted loop playsinline preload="metadata" poster="/features/posters/accessibility-audit.webp" style="width: 100%; border-radius: 0.75rem;"></video>

:::note
The Audit tab requires **RocketSim Pro**. The `rocketsim accessibility-audit` CLI command does not.
:::

## Running an audit in the side window

1. Open the Simulator with your app on the screen you want to check
2. Open the **Accessibility** window from the side window
3. Select the **Audit** tab
4. Click **Run Audit**

RocketSim doesn't audit automatically when you open the tab. Run it whenever the screen is in the state you want to check. After the screen changes, RocketSim marks the previous result as stale so you know to run it again.

### The score

The score runs from 0 to 100 and reflects how many rules pass for the current screen:

| Score  | Band           |
| ------ | -------------- |
| 90–100 | **Great**      |
| 70–89  | **Good**       |
| 0–69   | **Needs work** |

A screen with any error-level finding can't reach the Great band.

### Findings and highlights

Findings are grouped by rule, each with an explanation of the problem and a suggested fix. RocketSim highlights the affected elements on the Simulator, and the highlights follow the screen as elements move, for example while you scroll.

Highlights aren't available while Xcode 27's Device Hub is in expanded mode. Switch to Compact Mode to see them. See [Device Hub Support](/docs/features/capturing/device-hub-support/).

### Copy a prompt for your agent

Select the findings you want to fix and click **Copy Prompt**. RocketSim creates a focused prompt for your AI coding agent that tells it to:

- Keep the layout unchanged
- Fix the findings in one batch
- Compare element frames before and after the fix

Paste the prompt into your agent, let it fix the findings, and run the audit again to confirm the score improves.

## What the audit checks

The audit combines deterministic rules, which are reliable, with heuristic rules that flag likely problems for you to review.

| Rule                                            | What it flags                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| `missing_label`                                 | Interactive elements without an accessibility label                        |
| `image_without_label`                           | Images that VoiceOver reads without a description                          |
| `label_is_asset_name`, `non_descriptive_label`  | Labels that look like asset names, filenames, or identifiers               |
| `redundant_role_in_label`                       | Labels that repeat the role, such as "Settings button"                     |
| `duplicate_labels`                              | Different elements that VoiceOver announces identically                    |
| `adjustable_without_value`                      | Sliders and steppers that don't expose a value                             |
| `hit_region_small`                              | Tap targets below 44×44 points (an error below 28×28 points)               |
| `overlapping_targets`                           | Tap targets that overlap each other                                        |
| `offscreen_content_not_scrollable`              | Content that continues offscreen without being reachable through scrolling |
| `parent_child_conflict`                         | Controls that a combined row hides from VoiceOver                          |
| `fragmented_group`                              | Content that should be one VoiceOver element but is split into several     |
| `no_heading_on_screen`, `heading_trait_missing` | Screens without headings, or section titles without the heading trait      |
| `selected_state_missing`                        | Tab or segmented controls that don't expose which item is selected         |
| `contrast_low`                                  | Text with low contrast against its background (heuristic)                  |

The audit only reports what VoiceOver users can reach for rules about VoiceOver output. Touch target and contrast rules still check every element. RocketSim also avoids false positives for common patterns: grouped tiles under a heading, text covered by a floating control, controls that only overlap at the current scroll position, and content beyond the edge of a SwiftUI scroll view or carousel aren't reported.

Some accessibility problems can't be detected from the screen alone. The audit lists these in a **not covered** section, for example accessibility hints and information conveyed by color only, so you know what to review manually.

## Automating audits with the CLI

The same audit is available from the command line, which makes it a good fit for agents, scripts, and CI-style checks. Install the CLI from **Settings → CLI & Agent** first. See [RocketSim CLI](/docs/features/agentic-development/rocketsim-cli/) for setup.

```bash
rocketsim accessibility-audit \
  [--udid <udid>] \
  [--screen <hash>|latest] \
  [--rules <id,id,...>] \
  [--exclude-rules <id,...>] \
  [--severity error|warning] \
  [--format compact|full] \
  [--no-contrast]
```

| Option                       | Description                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--udid <udid>`              | Audit a specific booted Simulator instead of the focused one.                                                                       |
| `--screen <hash>\|latest`    | Guard the audit against a changed screen. Pass a screen hash from `rocketsim screen`, or `latest` to use the current stored screen. |
| `--rules`, `--exclude-rules` | Run or skip specific rules by ID.                                                                                                   |
| `--severity error\|warning`  | Only return findings of the given severity.                                                                                         |
| `--format compact\|full`     | `compact` (default) groups repeated findings per rule. `full` returns one finding per occurrence.                                   |
| `--no-contrast`              | Skip the heuristic contrast checks.                                                                                                 |

The response uses the [`rs/1` protocol](/docs/features/agentic-development/rs1-protocol/) and includes:

- A `summary` with the `score`, number of `errors`, `warnings`, and `heuristic` findings, and `elements_audited`
- `findings` grouped by rule with a `severity`, whether the rule is `deterministic` or `heuristic`, the affected element ids and frames, a `message`, and a suggested `fix`
- `not_covered` with what the audit couldn't check

### Audit, fix, and validate with an agent

The CLI turns accessibility work into a loop your AI agent can run on its own:

1. **Audit** — The agent runs `rocketsim accessibility-audit` on the screen under test.
2. **Fix** — The agent fixes the findings in your code, without changing the visible layout. It saves `rocketsim elements` output before the fix so it can compare element frames afterwards.
3. **Validate** — After rebuilding and returning to the same screen, the agent runs `rocketsim accessibility-audit --screen latest --format full` again and compares the element frames with the ones from before the fix.
4. **Repeat** — The agent continues until the findings are gone, and reports any heuristic findings it deliberately declined with a short reason.

The [RocketSim Agent Skill](/docs/features/agentic-development/agent-skill/) teaches your agent this workflow, including a dedicated reference for fixing small tap targets without changing layout. You can try it with a prompt like:

> Use RocketSim to audit the current screen for accessibility issues, fix the findings without changing the layout, and run the audit again to validate.

## Requirements

- RocketSim Pro for the Audit tab in the side window
- A booted Simulator showing the screen you want to audit
- The `rocketsim` command line tool for CLI audits, installed from **Settings → CLI & Agent**
