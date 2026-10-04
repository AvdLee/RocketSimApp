---
title: "Simulator Actions"
description: "Shake an iOS Simulator, toggle light or dark appearance, simulate memory warnings, and shut down Simulators from RocketSim or a shortcut."
faq:
  - question: "How do I shake an iOS Simulator in Xcode Device Hub?"
    answer: "Focus the Simulator and select RocketSim → Simulator → Shake, use the Shake button in the Comparing tab, or assign a global shortcut in RocketSim Settings."
  - question: "What is the keyboard shortcut to shake an iOS Simulator?"
    answer: "Simulator.app historically used Control-Command-Z. RocketSim shows this as a suggestion but leaves the Shake action unassigned until you configure it."
  - question: "Can Simulator Actions control a physical device?"
    answer: "No. Shake, appearance, memory warning, and Simulator shutdown actions only support booted iOS Simulators."
---

RocketSim's **Simulator Actions** restore controls that are missing from Xcode 27 Device Hub. You can trigger each action from the RocketSim menu bar or assign a global keyboard shortcut.

## Available Simulator actions

Open **RocketSim → Simulator** to use:

- **Shake**
- **Toggle Light/Dark Appearance**
- **Simulate Memory Warning**
- **Shut Down Simulator**
- **Shut Down Other Simulators**

Shake, appearance switching, and memory warnings are also available at the bottom of the **Comparing** tab. These controls remain accessible when Device Hub uses its expanded layout because they do not depend on the Simulator's position on screen.

<!-- prettier-ignore -->
<video src="/blog/xcode-device-hub-simulator-features/comparing-simulator-actions.mp4" aria-label="Using RocketSim's Comparing-tab buttons to toggle Slow Animations, Shake, switch appearance, and simulate a memory warning in Device Hub." controls autoplay muted loop playsinline preload="metadata" style="width: 100%; border-radius: 0.75rem;"></video>

## Shake the Simulator

Use **Shake** to test undo prompts, debug menus, and any custom behavior driven by a device-shake event.

Focus the Simulator you want to control, then select **RocketSim → Simulator → Shake**. You can also select Shake from the Comparing tab or use a configured shortcut.

Simulator.app historically used <strong>⌃⌘Z</strong> for Shake. RocketSim shows this key combination as a suggestion in Settings but does not assign it automatically.

## Toggle light and dark appearance

Select **Toggle Light/Dark Appearance** to switch the focused Simulator between appearances without opening the Settings app.

The former Simulator.app shortcut was <strong>⇧⌘A</strong>. You can restore the same workflow from [RocketSim's Shortcut settings](/docs/settings/shortcuts/) or assign another key combination.

## Simulate a memory warning

Use **Simulate Memory Warning** to verify how your app releases caches and responds to memory pressure.

Simulator.app previously used <strong>⇧⌘M</strong>. RocketSim lists this as the suggested shortcut while leaving the action unassigned by default.

## Shut down Simulators

**Shut Down Simulator** stops the focused Simulator. **Shut Down Other Simulators** keeps the focused Simulator running and stops the other booted Simulators.

The second action is particularly useful when Device Hub has left several runtimes active. If an individual Simulator cannot be stopped, RocketSim continues shutting down the others.

## Configure shortcuts

Open **RocketSim → Settings → Shortcuts → Simulator**, select **Record Shortcut**, and press the key combination you want to use.

Shortcuts are global, so they continue to work while Device Hub is frontmost. RocketSim warns when a macOS menu item already uses the combination, allowing you to decide whether to keep or replace it.

## Simulator-only support

Simulator Actions do not support physical devices. When a physical device is focused, the Comparing-tab controls remain visible but disabled to avoid accidentally applying an action to another booted Simulator.

For the complete Xcode 27 workflow, see [Device Hub Support](/docs/features/capturing/device-hub-support/).
