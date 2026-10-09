---
title: "Browser Preview"
description: "Stream and control a booted iOS Simulator from your browser, inspect its accessibility tree, and turn visual feedback into an agent-ready prompt."
sidebar:
  order: 2
  badge:
    text: Beta
    variant: caution
---

Browser Preview is a **Beta** feature that serves a live, interactive view of your iOS Simulator at a local URL. You can review an app without keeping Simulator.app in front of you, interact with the screen from your browser, and turn visual feedback into a prompt for your AI coding agent.

The preview includes the correct device bezel and lets you switch between booted Simulators. Live input supports clicks, drags, scrolling, and keyboard typing, so you can move through a flow while reviewing it.

## Watch Browser Preview in action

<Youtube
  url="https://www.youtube.com/watch?v=nbgGxzOMqpg"
  title="Preview and control the iOS Simulator in your browser with RocketSim"
/>

The video shows how to start a preview, interact with the Simulator, select elements, and copy visual feedback for your coding agent. Read [Preview and Control the iOS Simulator in Your Browser](/blog/ios-simulator-browser-preview/) for the complete workflow.

## Start a Browser Preview

RocketSim must be running with at least one Simulator booted. Start the preview from Terminal:

```bash
rocketsim preview
```

The command prints a token-protected URL on `127.0.0.1`. Open that URL in your browser to start reviewing the active Simulator.

Choose a different localhost port when the default is already in use:

```bash
rocketsim preview --port 5000
```

When several Simulators are booted, target one by UDID:

```bash
rocketsim preview --udid <udid>
```

You can also switch between booted Simulators from the device menu above the preview.

## Open the preview from another Mac

Browser Preview stays on localhost by default. With **RocketSim Pro**, opt in to sharing it with another Mac on the same network or on your Tailscale tailnet:

```bash
rocketsim preview --lan
```

RocketSim listens only on the address it shows, and stops the preview after 30 minutes without a connected browser. The preview is served over plain HTTP, so use it on networks you trust or over Tailscale.

## Performance while streaming

RocketSim hardware-encodes the Simulator as JPEG frames capped at 30 fps, which uses about 75% less CPU per streamed Simulator and sends about 80% less data to each browser. A few rules keep your Mac responsive:

- The preview lowers its frame rate to 15 fps while any Simulator is recording, and recordings get priority when your Mac is busy
- Previews that no browser is watching, including the ones CLI agent commands start automatically, don't stream or encode frames
- Accessibility refreshes are skipped while the screen is unchanged or the Simulator is recording
- A preview stops automatically when its Simulator is deleted

## Interact from the browser

The live screen behaves like the Simulator:

- Click to tap
- Drag to perform a touch gesture
- Scroll with your mouse or trackpad
- Click the preview and type with your keyboard
- Use the controls below the device for Home and Lock

The device bezel matches the selected Simulator, giving your review the same visual context as the physical device.

## Review the accessibility tree

The **Accessibility** panel shows the visible elements RocketSim can inspect. Select an element in the tree to highlight its frame on the captured screen and add focused feedback.

Use this panel to verify labels, understand which visual control an accessibility element represents, and avoid vague feedback such as "the button near the bottom."

## Inspect the screen visually

Option-click a visible element for one-off inspection, or click the crosshair in the **Visual Feedback** panel to enter inspect mode. While inspecting:

- Hover over the screen to highlight the element under your pointer
- Click an element to select it
- Drag a marquee around several elements to review them as a group
- Press **Esc** to leave inspect mode

Add your feedback to the selected element or group. RocketSim keeps the screen state that the feedback belongs to, even if you continue navigating afterward.

## Review captured screen history

Each feedback item is grouped under the screen where you created it. Select a captured screen from the **Visual Feedback** panel to revisit that state and confirm your comments against the original UI.

The history view pauses live interaction while you inspect the capture. Choose **Return to live** or press **Esc** to continue with the current Simulator screen.

## Generate an agent-ready feedback prompt

After adding feedback, click **Copy prompt**. RocketSim creates a structured prompt containing the Simulator details, captured screen titles, selected accessibility elements, their frames, and your comments.

Paste the prompt into your AI coding agent. The element-level context gives the agent a concrete implementation target while the captured history keeps feedback from different screens organized.
