---
title: "Configuring App Actions"
description: "Configure RocketSim App Actions for your project to test deep links, push notifications, location simulation, quick actions, and privacy permissions."
sidebar:
  order: 3
---

A major part of RocketSim’s functionality is based on so-called App Actions. They’re configured based on your app’s primary target bundle identifier and allow you to perform the following actions:

- Test deeplinks (Universal Links)
- Test Push Notifications
- Simulate Locations (Single Locations & Routes)
- Run quick actions like relaunching, terminating, or resetting app state
- Reset permissions (E.g., location access, photo access)

## Create a new App Actions Group

1. Start by opening the Settings window from either the Status Bar menu or the side window more menu:

   ![App Actions configuration with bundle identifier selection](./configuring-app-actions/cleanshot_2025-01-21_at_13.35.412x.png)

2. Select the App Actions tab and create a new group:

![App Group setup in the Settings panel](./configuring-app-actions/cleanshot_2023-11-01_at_11.30.572x.png)

1. Provide the bundle identifier for your recent build. If you’ve already build your app before configuring, RocketSim will be able to suggest your recent build.

   ![Adding a new app group for organizing App Actions](./configuring-app-actions/cleanshot_2023-11-01_at_11.32.582x.png)

2. Press the **Add** button and start adding an App Action. For example, start by adding a deeplink for a basic website:

   ![App Actions list showing configured deep links and push notifications](./configuring-app-actions/cleanshot_2023-11-01_at_11.35.292x.png)

3. Go back to the Simulator and notice that your deeplink shows up after selecting the Recent Build matching your App Action Group:

   ![Selecting the active app group for the current project](./configuring-app-actions/cleanshot_2025-01-21_at_13.37.472x.png)

4. Click on your App Action and validate that it correctly opens the configured deeplink:

   ![App Actions available in the side window after configuration](./configuring-app-actions/cleanshot_2025-01-21_at_13.38.312x.png)

## Exploring all App Actions

Well done, you’ve configured your first App Actions group and executed a deeplink in the Simulator!

This is just the beginning, there’s much more to discover. While you’re at it, how about creating App Actions for [Location Simulation](/docs/features/app-actions/location-simulation) and [Push Notifications](/docs/features/app-actions/push-notifications)?

You can also explore relaunch buttons, directory shortcuts, or the permissions section. Networking tools like [Network Speed Control](/docs/features/networking/network-speed-control) and [Network Traffic Monitoring](/docs/features/networking/network-traffic-monitoring) now live in the dedicated **Networking** tab in the side window.
