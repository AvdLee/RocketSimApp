---
title: "Onboarding"
description: "Selecting Xcode and providing permissions"
sidebar:
  order: 2
---

During the first launch, you’ll be asked to provide several permissions that are required for RocketSim to function properly. RocketSim is a sandboxed application, meaning it’s secure but also requires explicit access to certain capabilities.

## Setting up permissions

RocketSim requires a few permissions to be able to access the Simulator and its builds.

### **Xcode**

Make sure to select the latest version of Xcode. RocketSim uses your Xcode application to fetch Simulator metadata and communicate with the Simulator. 

We will re-ask for your Xcode Path in case a link your Xcode is lost or if we indicate a new Simulator that mismatches your currently configured Xcode. 

### **Screen Recording**

RocketSim uses Screen Recording permissions to read the Simulator’s window name and match it to the right device. Without permissions, we would only be able to see `"Simulator"` as a window name, making it impossible to properly calculate screen dimensions. These permissions are also used to record audio if enabled for Simulator captures.

### **Developer Directory**

This is the directory in which your recent builds are stored. By providing access, RocketSim can show your most recent builds per Simulator and enhance your experience.

## Exploring the Side Window

Once configured, you’re ready to get started with RocketSim. Make sure to open a Simulator and see if the RocketSim side window shows up: 

![CleanShot 2025-01-21 at 13.33.53@2x.png](./onboarding/CleanShot_2025-01-21_at_13.33.532x.png)

If so, you’re ready to continue your journey by configuring your first App Actions.
