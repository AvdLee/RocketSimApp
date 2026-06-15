---
title: "Device Hub Support"
description: "RocketSim works with Xcode 27's new Device Hub. Attach the side window in Compact Mode and keep using VoiceOver Navigator, design comparison, and capture tools."
sidebar:
  order: 4
---

Device Hub is the new app introduced with **Xcode 27** at WWDC. It brings Simulators and connected devices together in a single window, replacing the standalone Simulator window you used in earlier Xcode versions. RocketSim adds first-class support for Device Hub, so the workflows you already rely on keep working alongside it.

![RocketSim's side window showing the VoiceOver Navigator next to an iPhone running inside Xcode 27's Device Hub](./device-hub-support/voiceover-navigator.png)

## The side window and Compact Mode

RocketSim's side window attaches to a single, focused device window — just like it does with the Simulator. Device Hub only exposes that kind of window when it runs in **Compact Mode**, showing one device at a time.

When Device Hub is in Compact Mode, RocketSim's side window appears automatically next to the device, giving you the familiar capture, comparison, and accessibility tools right where you expect them.

If you don't see the side window, switch Device Hub into Compact Mode so a single device is in focus.

## Run Device Hub on its own

For the best experience, we recommend running **Device Hub on its own**, without also running Simulator.app at the same time. Both apps can drive Simulator windows, and running them together makes it ambiguous which window RocketSim should attach to.

Keeping Device Hub as your single Simulator surface keeps the side window predictable and avoids duplicate or misplaced windows.

## What keeps working

All the side window features continue to work with Device Hub in Compact Mode, including:

- Screenshots and recordings
- Design comparison, grids, and rulers
- The VoiceOver Navigator and other accessibility tools

![RocketSim's design comparison tools overlaying a device inside Xcode 27's Device Hub](./device-hub-support/design-comparison.png)

## Running into issues?

Device Hub is brand new in Xcode 27, and edge cases can still slip through. If the side window doesn't attach the way you expect, or something looks off, please [report an issue on GitHub](https://github.com/AvdLee/RocketSimApp/issues) with as much detail as you can share. That helps us tighten Device Hub support quickly.
