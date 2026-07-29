---
title: "Deep Links & Universal Links"
description: "Test deep links and universal links on the iOS Simulator or a connected physical iPhone or iPad. Save and trigger URL schemes from RocketSim's side window."
---

A deeplink or Universal Link allows you to redirect users to a specific location of your app. A common example is opening a map location in WhatsApp, which will directly open inside Apple Maps.

The same functionality can be built into your apps. I’ve seen developers manage all supported deeplinks in notes, reminders, or hosted HTML pages. With RocketSim, you can now manage all supported deeplinks in a single place, accessible for all Simulators.

## Creating a deeplink (Universal Link)

1. Open Settings
2. Select the **App Actions** tab
3. Create a new deeplink inside your app's group:

   ![Deep link editor in the App Actions settings with URL scheme input](./deeplinks-universal-links/cleanshot_2025-01-21_at_14.23.352x.png)

4. Open the Simulator
5. Execute the action by tapping your deeplink from the side window:

   ![Deep link list in the side window ready to trigger](./deeplinks-universal-links/cleanshot_2025-01-21_at_14.24.042x.png)

## Deeplinks with arguments

RocketSim 15.1 adds support for a single runtime argument inside a deeplink URL. Use curly braces to mark the placeholder, for example `stocks://analyze/{SYMBOL}`.

That makes it easy to keep one reusable deeplink around for many test cases instead of saving a separate action per symbol, product ID, or user identifier.

![Deeplink editor showing a configured runtime placeholder such as {SYMBOL} in the URL.](./deeplinks-universal-links/deeplinks_argument_settings_example.png)

When you trigger that deeplink from the side window, RocketSim opens a compact input view right there in the Simulator context. Enter the value you want to use and RocketSim substitutes it into the final URL before launching your app.

RocketSim also keeps recently used values as quick relaunch actions, so repeating the same test case only takes one click. RocketSim 16.4.2 preserves long arguments without truncating the important URL text. The history wraps long values across rows, keeps up to six recent entries, and becomes vertically scrollable when needed.

![Side window deeplink prompt showing a runtime argument field and recent values for quick relaunch.](./deeplinks-universal-links/deeplinks_with_argument_side_window.png)

## Test deep links on a physical device

Starting with RocketSim 16.4 and Xcode 27, the Deeplinks tab is also available for apps run on a connected physical iPhone or iPad. RocketSim discovers the installed build, matches it by bundle identifier, and opens the selected URL through Xcode's device-control service.

See [Deep-Link Testing on a Physical Device](/docs/features/physical-devices/deep-link-testing/) for requirements, step-by-step setup, and troubleshooting Universal Link associations.

## Learn more

If you’d like to learn more about deeplinks and Universal Links, I encourage you to read the following articles:

- [**Deeplink URL handling in SwiftUI**](https://www.avanderlee.com/swiftui/deeplink-url-handling/)
- [**Universal Links implementation on iOS**](https://www.avanderlee.com/swiftui/universal-links-ios/)
