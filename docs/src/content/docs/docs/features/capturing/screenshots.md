---
title: "Screenshots"
description: "Create professional screenshots to demonstrate your app with colleagues and social media."
---

RocketSim allows you to create screenshots with bezels, a custom background color, and optionally optimized for App Store Connect. The latter makes it possible to directly drag screenshots into App Store Connect.

## Creating a screenshot

1. Open the Simulator
2. Select the Captures tab inside the RocketSim Side Window
3. Click **JPEG Screenshot** (when App Preview Optimized is enabled) ****or **PNG Record**
    
    ![CleanShot 2025-01-21 at 13.48.13@2x.png](./screenshots/cleanshot_2025-01-21_at_13.48.132x.png)
    
4. Drag or copy your screenshot using the floating thumbnail in the bottom right corner:
    
    ![CleanShot 2023-11-01 at 13.49.41@2x.png](./screenshots/cleanshot_2023-11-01_at_13.49.412x.png)
    

## App Preview Optimized

:::tip
Your App Store Connect screenshots must conform to [Apple’s Screenshot Specifications](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/). It can be challenging to convert your screenshots into the right format, but RocketSim does this all automatically for you.
:::

Updating your app’s screenshots can be time-consuming, but RocketSim simplifies this process by converting each capture into the right specifications.

![CleanShot 2023-11-01 at 13.38.49@2x.png](./screenshots/cleanshot_2023-11-01_at_13.38.492x.png)

Simply enable App Preview Optimized, create your screenshot, and drag it directly into App Store Connect.

## Troubleshooting

### Why is JPEG the default?

It’s not! You probably just enabled App Preview Optimized. App Store Connect does not accept alpha channels in images, which is why we decided to go for JPEG.

### How is App Preview Optimized, optimized?

We’re converting your images to match the image specifications and resolutions as required by App Store Connect.

### How is this better than doing CMD-S on a simulator?

The Simulator has a few flaws in their screenshots:

- Landscape is not always well supported
- You’ll always get an image without device bezels
- The resolution output is not accepted by App Store Connect

Other than that, you’ll see similar results with RocketSim.

### Why are my iPad screenshots upside-down?

RocketSim cannot detect landscape-left or landscape-right and defaults to one landscape rotation. The fix is simple: rotate your Simulator twice and create another screenshot.

### Can I create transparent screenshots?

Yes, you can! Make sure to change the background color inside **Settings** to transparent:

![CleanShot 2023-11-01 at 13.42.32@2x.png](./screenshots/cleanshot_2023-11-01_at_13.42.322x.png)

Note that App Store Connect images can’t have alpha layers, so you need to disable **App Preview Optimized mode.** Lastly, apps like Preview make it look like your screenshot’s background isn’t transparent. It’s best to copy your image into an app like Keynote to verify transparency:

![CleanShot 2023-11-01 at 13.45.08@2x.png](./screenshots/cleanshot_2023-11-01_at_13.45.082x.png)
