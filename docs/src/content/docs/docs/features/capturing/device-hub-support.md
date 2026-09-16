---
title: "Device Hub Support"
description: "RocketSim works with Xcode 27's Device Hub in expanded and Compact Mode for captures, accessibility, design comparison, and agent workflows."
sidebar:
  order: 4
faq:
  - question: "Does RocketSim support Xcode 27 Device Hub?"
    answer: "Yes. RocketSim supports Simulators in expanded and Compact Mode for captures, Simulator actions, file imports, accessibility, design comparison, and agent workflows."
  - question: "How do I shake a Simulator in Device Hub?"
    answer: "Use RocketSim's Simulator menu, the Shake button in the Comparing tab, or assign a global Shake shortcut in RocketSim Settings."
  - question: "Can I use Slow Animations in Device Hub?"
    answer: "Yes. Enable Slow Animations from RocketSim's Comparing tab or assign it a global shortcut under the Simulator shortcut group."
  - question: "Can I drag files into Device Hub?"
    answer: "RocketSim accepts push payloads, certificates, photos, videos, app bundles, and links dropped onto its side window for an active Simulator."
  - question: "Can I open multiple Simulators in Device Hub?"
    answer: "Yes. Select File → New Window or press Shift-Command-N in Device Hub, then open a Simulator in each window."
---

Device Hub is the new app introduced in **Xcode 27**. It brings Simulators and connected devices together in a single window, replacing the standalone Simulator window you used in earlier Xcode versions. RocketSim adds first-class support for Device Hub, so the workflows you already rely on keep working alongside it.

![RocketSim's side window showing the VoiceOver Navigator next to an iPhone running inside Xcode 27's Device Hub](./device-hub-support/voiceover-navigator.png)

## Using the side window

RocketSim's side window appears for Simulators in both the expanded Device Hub and **Compact Mode**. You can take screenshots, create recordings, and use side-window actions in either layout.

Screen-relative overlays still require Compact Mode because RocketSim needs a single device window to align them correctly. Switch to Compact Mode when using design comparison, grids, rulers, or VoiceOver overlays directly on top of the Simulator.

If you don't see the side window, focus the Simulator inside Device Hub. RocketSim detects Simulators that are already open when it launches and ones that you boot afterward.

## Run Device Hub on its own

For the most predictable window attachment, run **Device Hub on its own** without displaying the same Simulator in Simulator.app at the same time.

RocketSim keeps app actions inside the surface you are using, so deep links and push notifications no longer switch your workflow from Device Hub to Simulator.app.

## What keeps working

Side-window features continue to work with Device Hub, including:

- Screenshots and recordings
- Design comparison, grids, and rulers in Compact Mode
- The VoiceOver Navigator and screen-relative accessibility overlays in Compact Mode

![RocketSim's design comparison tools overlaying a device inside Xcode 27's Device Hub](./device-hub-support/design-comparison.png)

Recent Builds also follows Simulator apps run through Device Hub. For connected iPhones and iPads, RocketSim provides a dedicated USB preview and physical-device actions; see [Physical Device Testing](/docs/features/physical-devices/).

## Restore missing Simulator actions

RocketSim 16.5 restores several actions that Device Hub no longer provides:

- Shake the focused Simulator
- Toggle light and dark appearance
- Simulate a memory warning
- Shut down the focused Simulator
- Shut down all other Simulators

Use these actions from **RocketSim → Simulator**, the Comparing tab, or a global keyboard shortcut. Read [Simulator Actions](/docs/features/app-actions/simulator-actions/) for each access point and the suggested Simulator.app shortcuts.

<!-- prettier-ignore -->
<video src="/blog/xcode-device-hub-simulator-features/comparing-simulator-actions.mp4" aria-label="Using RocketSim's Comparing-tab buttons to control Slow Animations, Shake, appearance, and memory warnings in Xcode Device Hub." controls autoplay muted loop playsinline preload="metadata" style="width: 100%; border-radius: 0.75rem;"></video>

[Slow Animations](/docs/features/design-comparison/slow-animations/) remains available from RocketSim's Comparing tab and as a configurable global shortcut.

## Drag files into Device Hub

Drop supported files or links onto RocketSim's visible side window to import them into the focused Simulator. RocketSim supports:

- `.apns` push notification payloads
- `.cer`, `.crt`, `.der`, and `.pem` root certificates
- Photos and videos
- `.app` bundles
- HTTP(S) and custom-scheme links

The [Device Hub File Imports guide](/docs/features/app-actions/device-hub-file-imports/) explains the requirements and feedback for each type. Imports and Simulator actions are disabled for physical devices so RocketSim never targets a different booted Simulator by mistake.

## Open multiple Simulators

Device Hub can show multiple Simulators, although the workflow is different from Simulator.app. Select **File → New Window** or press <strong>⇧⌘N</strong>, then open a device in each window.

Use Compact Mode when you want focused, side-by-side Simulator windows. RocketSim attaches its side window to the Simulator you focus.

## Use Device Hub with AI agents

Starting with RocketSim 16.4.2, the [`rocketsim` CLI](/docs/features/agentic-development/rocketsim-cli/) and `rocketsim doctor` resolve booted Simulators through Device Hub as well as Simulator.app. Your agent can inspect and interact without opening the standalone Simulator app.

When only one Simulator is booted, RocketSim selects it automatically. If several are booted, focus the one you want to control or pass its UDID using `--udid <udid>`. Compact Mode is only required when the workflow depends on a screen-relative overlay.

## Running into issues?

Device Hub is brand new in Xcode 27, and edge cases can still slip through. If the side window doesn't attach the way you expect, or something looks off, please [report an issue on GitHub](https://github.com/AvdLee/RocketSimApp/issues) with as much detail as you can share. That helps us tighten Device Hub support quickly.
