---
title: "Deep-Link Testing on a Physical Device"
description: "Open custom URL schemes, deep links, and Universal Links on a connected physical iPhone or iPad from RocketSim's Recent Builds side window."
seoParent:
  name: "Physical Device Testing"
  path: "/docs/features/physical-devices/"
sidebar:
  order: 4
---

RocketSim 16.4 lets you run saved deep links and Universal Links on a connected physical iPhone or iPad. Select a recent device build and trigger the same reusable App Actions you already use with the Simulator.

## Requirements

- RocketSim 16.4 or later
- Xcode 27
- A paired iPhone connected over USB
- An app run on that device from Xcode
- A saved deeplink App Action matching the app's bundle identifier

## Open a deep link

1. Configure the URL under **RocketSim → Settings → App Actions**.
2. Run the matching app on your physical iPhone or iPad from Xcode.
3. Focus the physical-device preview and open **Recent Builds**.
4. Select the app and open the **Deeplinks** tab.
5. Choose the URL you want to test.

RocketSim asks Xcode's device-control service to open the URL on the selected iPhone. Custom URL schemes route to the installed app; Universal Links follow the association and routing rules configured by your app and website.

## Reuse dynamic URLs

Deep links with one placeholder continue to work on physical devices. For example:

```text
stocks://analyze/{SYMBOL}
```

When you trigger the action, RocketSim asks for the runtime value and substitutes it into the final URL. Recently used values remain available for repeating the same test.

## Troubleshooting

- Confirm the selected recent build has the same bundle identifier as the saved App Action.
- Run the app from Xcode again if it does not appear in Recent Builds.
- Test the final URL in Safari on the device to separate app-association issues from RocketSim execution.
- Universal Links can open the website when the associated-domains entitlement or `apple-app-site-association` file is incorrect.

For creating and organizing URLs, see [Deep Links & Universal Links](/docs/features/app-actions/deeplinks-universal-links/).
