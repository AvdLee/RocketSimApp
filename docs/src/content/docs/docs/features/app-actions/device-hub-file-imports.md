---
title: "Device Hub File Imports"
description: "Drag push payloads, certificates, photos, videos, app bundles, and links into an iOS Simulator running in Xcode 27 Device Hub."
faq:
  - question: "Can I drag files into an iOS Simulator in Device Hub?"
    answer: "Yes. Drag supported files or links onto RocketSim's visible side window to import them into the active Simulator."
  - question: "Which files can RocketSim import into a Simulator?"
    answer: "RocketSim supports APNS push payloads, CER, CRT, DER, and PEM certificates, photos, videos, app bundles, and HTTP or custom-scheme links."
  - question: "Can I import files into a physical device?"
    answer: "No. Device Hub file imports use Simulator tooling and are disabled when a physical device is focused."
---

RocketSim restores **drag-and-drop file imports** for an iOS Simulator running in Xcode 27 Device Hub. Drop a supported file or link onto RocketSim's visible side window to import it into the active Simulator.

## Import a file

1. Open a Simulator in Device Hub and focus its window.
2. Drag a supported file or link over RocketSim's side window.
3. Drop the item when **Drop to import into the Simulator** appears.

The drop area covers the visible tab bar and selected tab content. If you use the Comparing tab, its existing **Drop an image here** target takes precedence so you can still create a design comparison.

## Supported file types

RocketSim imports:

- `.apns` push notification payloads
- `.cer`, `.crt`, `.der`, and `.pem` root certificates
- Photos and videos
- `.app` bundles
- HTTP(S) and custom-scheme links

Files are temporarily copied into RocketSim's sandbox before being passed to the Simulator and removed afterward. Links are opened directly without creating a temporary file.

### Push notification payloads

An `.apns` file must contain a JSON object with a non-empty `"Simulator Target Bundle"` value matching your app's bundle identifier. The payload also needs the regular `aps` dictionary expected by Apple:

```json
{
  "Simulator Target Bundle": "com.example.MyApp",
  "aps": {
    "alert": {
      "title": "RocketSim",
      "body": "Testing a push notification"
    }
  }
}
```

See [Push Notifications](/docs/features/app-actions/push-notifications/) if you want to save and reuse payloads as RocketSim App Actions.

### Certificates

Drop a `.cer`, `.crt`, `.der`, or `.pem` file to add it as a trusted root certificate in the Simulator. Only install certificates you trust.

### Photos and videos

RocketSim adds supported image and video files to the Simulator's media library. This is useful when testing photo pickers, uploads, camera-roll permissions, or media-heavy layouts.

### App bundles

Drop a built `.app` bundle to install it on the focused Simulator. The dropped item must be an app directory rather than an archive or installer package.

### Links

Drop an `https://`, `http://`, or custom-scheme URL to open it in the focused Simulator. Universal Links and custom deep links follow the same Simulator routing behavior as other opened URLs.

## Import multiple items

You can drop several supported items at once. RocketSim processes them serially and continues after an individual failure.

Afterward, RocketSim reports one of the following outcomes:

- **Imported into _Simulator name_**
- **Imported _count_ items into _Simulator name_**
- **Some imports failed**
- **Import failed**

## Simulator-only support

File imports are unavailable for physical devices because they rely on Simulator tooling. RocketSim disables the drop target when a physical device is focused, preventing the files from being sent to another booted Simulator by mistake.

Read [Device Hub Support](/docs/features/capturing/device-hub-support/) for window setup, Simulator actions, and agent workflows.
