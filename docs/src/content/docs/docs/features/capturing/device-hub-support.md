---
title: "Device Hub Support"
description: "RocketSim works with Xcode 27's Device Hub in expanded and Compact Mode for captures, accessibility, design comparison, and agent workflows."
sidebar:
  order: 4
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

## Use Device Hub with AI agents

Starting with RocketSim 16.4.2, the [`rocketsim` CLI](/docs/features/agentic-development/rocketsim-cli/) and `rocketsim doctor` resolve booted Simulators through Device Hub as well as Simulator.app. Your agent can inspect and interact without opening the standalone Simulator app.

When only one Simulator is booted, RocketSim selects it automatically. If several are booted, focus the one you want to control or pass its UDID using `--udid <udid>`. Compact Mode is only required when the workflow depends on a screen-relative overlay.

## Running into issues?

Device Hub is brand new in Xcode 27, and edge cases can still slip through. If the side window doesn't attach the way you expect, or something looks off, please [report an issue on GitHub](https://github.com/AvdLee/RocketSimApp/issues) with as much detail as you can share. That helps us tighten Device Hub support quickly.
