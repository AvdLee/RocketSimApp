---
title: "FAQ"
description: "Frequently asked questions about RocketSim — licensing, App Store Connect issues, transparent captures, network speed control troubleshooting, and more."
---

## Licensing & Pricing

### Do you offer out-of-the App Store distribution?

Yes, we do. Get in touch via [support@rocketsim.app](mailto:support@rocketsim.app)

### Are there non-recurring subscriptions as well?

Yes, you can consider buying [Team Licenses](https://www.rocketsim.app/for-teams/).

### I can’t reimburse App Store subscriptions, is there an alternative?

Yes, we offer [Team Licenses](https://www.rocketsim.app/for-teams/). The [manager approval guide](/docs/teams/how-to-get-rocketsim-approved-at-work/) gives you a copyable request for centralized billing.

### Do you provide the option for commercial or team licenses?

Yes, check out [Team Licenses](https://www.rocketsim.app/for-teams/).

### Can I buy a lifetime license?

No, but you can join SwiftLee Weekly’s referral program to get a lifetime RocketSim license. Just join the newsletter [here](https://swiftlee-weekly.com/?utm_source=rocketsim&utm_medium=referral&utm_campaign=swiftlee_weekly&utm_content=faq_lifetime_license) and follow the instructions in the email.

## RocketSim for Teams

### How can I get my manager to approve RocketSim?

Use the [RocketSim manager approval guide](/docs/teams/how-to-get-rocketsim-approved-at-work/) for a copyable request, a simple payback summary, and answers to common procurement questions.

### I installed RocketSim from the App Store. How do I activate my team license?

Installing the app doesn't unlock RocketSim Pro for team members. Sign in through the [activation link](https://teams.rocketsim.app/login?redirectTo=%2Factivate-seat) and click **Activate your seat**. If RocketSim doesn't open, you can enter your license key manually. The [activation guide](/docs/teams/activating-your-team-seat/) covers both options.

### I got a new Mac. How do I move my team seat?

Each Mac uses one seat, so unlink your old Mac first. A team manager can do this in the [Teams dashboard](https://teams.rocketsim.app/login) under **Settings → Users** with **Unlink device**. Then [activate your new Mac](/docs/teams/activating-your-team-seat/#move-your-seat-to-a-new-mac).

### How do I renew my team license or update payment details?

Sign in to the [Teams dashboard](https://teams.rocketsim.app/login) and go to **Settings → Subscription**. From there, you can re-subscribe after your license expired or was canceled, update a payment method that failed, add seats, and download invoices. The [team subscription guide](/docs/teams/managing-your-team-subscription/) walks you through each step.

### RocketSim says my payment is due. What should I do?

If you're a developer, let your team manager know — they're the only ones who can pay. If you're the manager, sign in to the [Teams dashboard](https://teams.rocketsim.app/login) and pay the open invoice. RocketSim keeps working while the message shows, and nothing is deleted if the license is deactivated. The [payment due guide](/docs/teams/what-to-do-when-your-payment-is-due/) has a copyable message for your manager and the steps to pay.

## Screenshots & Recordings

### Why is my video not accepted by App Store Connect?

The videos are optimized for App Previews following [these specifications](https://help.apple.com/app-store-connect/?lang=en/#/dev4e413fcb8). App Store Connect does not accept each device, so your selected Simulator could not support App Previews. Make sure to use a Simulator matching a device from the App preview specifications.

### I only get JPEG images, how can I get PNG images again?

You've likely enabled App Store Connect (ASC) Optimization. ASC requires JPEG images without alpha layer. Disable the option and you should get PNGs again.

### Can I create transparent captures?

Yes, make sure to disable **App Preview Optimized** and set your background color to transparent.

## Permissions & Troubleshooting

### Why does RocketSim need screen recording permissions?

As a developer, I know how important it is to not just use any permissions. Adding the requirement for screen recording permissions was something I disliked, but it was unavoidable. RocketSim is sandboxed and can't read NSWindow titles without screen recording permissions. RocketSim needs to read the title of the Simulator windows to determine the currently active Simulator.

### Network Speed Control isn’t working for me, what can I do?

This is usually caused by missing system permissions.

1. Quit **Xcode**, all **Simulators**, and **RocketSim**, then reopen them.

   (This often fixes the issue after Xcode or macOS updates.)

2. Open **System Settings → Privacy & Security** and approve any pending **RocketSim** permissions.
3. Open System Settings → Network → Filter and verify whether RocketSim is present & enabled
4. On **macOS Sequoia (15) and later**, enable the Network Extension:
   - **System Settings → General → Login Items & Extensions**
   - Find **RocketSim**, click **(i)**, and enable **Network Extension**
     You may need to approve permissions more than once.
5. Still not working? Do a clean reinstall:
   - Delete **RocketSim.app** from Applications
   - Empty the Trash and reinstall RocketSim
6. If it *still* doesn’t work, run `systemextensionsctl list` and email the output to [support@rocketsim.app](mailto:support@rocketsim.app)

## About RocketSim

### Why wouldn't I just use xcrun simctl?

Yes, RocketSim uses xcrun simctl as well, but it enhances the output and provides interfaces for quicker access. Recordings, for example, are enhanced with touches and device bezels that you won't get through the command line tools.

### Where can I follow active development?

RocketSim is developed by [Antoine van der Lee](https://www.twitter.com/twannl). You can follow him or the official [RocketSim Twitter Account](https://www.twitter.com/rocketsim_app) for updates about development.

### Where can I report bugs or feature requests?

Issues and feature requests are managed on [GitHub](https://github.com/AvdLee/RocketSimApp/issues).
