# 16.3.0

**New:**
- The `rocketsim` CLI can now enable Airplane Mode and Network Speed Control profiles like 3G and 100% loss, allowing agents to test offline and poor-network app handling. (Thanks, N. Kurpas!)
- The `rocketsim` CLI can now activate accessibility-only elements using `interact activate`, enabling agents to open hidden debug menus and controls that do not respond to coordinate taps. (Thanks, J. Boulter!)
- The `rocketsim` CLI now supports two-finger tap and long-press gestures using `--touches` / `--number-of-touches`, making it possible to automate multi-touch simulator interactions. (Thanks, J. Boulter!)
- RocketSim Connect installation is now done automatically via LLDB init file.

**Fixed:**
- Fixed copying recordings and screenshots from the floating thumbnail after "Save on copy" was enabled. RocketSim now publishes a staged clipboard file with the saved capture name instead of a temporary file that is cleaned up immediately after copying. (Thanks, A. Plotnikov!)
- Fixed copied captures placing only a display name on the clipboard in some cases, ensuring the actual file URL is available for pasting.
- Fixed VoiceOver overlay navigation activation to use accessibility activation before falling back to coordinate taps, so hidden accessibility-only elements can be opened with Enter or double-click in navigation mode. (Thanks, J. Boulter!)
- Fixed a crash in accessibility element recovery by serializing point lookups that can otherwise tear down shared AXP translation objects concurrently.
- Fixed RocketSim no longer reappearing next to the Simulator after macOS temporarily reports the Simulator window as too small during Stage Manager switches. (Thanks, K. Jężak!)
- Fixed duplicate Pulse class warnings when apps link Pulse directly by namespacing RocketSim's embedded copy of Pulse.
- Fixed microphone recording cleanup when a recording is stopped while it is still launching, preventing RocketSim from keeping the macOS microphone indicator active after cancellation. (Thanks, P. Friese!)
- Fixed physical-device recordings not offering recent app metadata choices in the capture editor when no Simulator-specific metadata could be resolved. (Thanks, P. Piella!)
- Fixed the Recent Builds side panel not showing builds when simulators run in Device Hub instead of Simulator.app. (Thanks, J. Sherlock!)

# 16.2.0

**Improved:**
- Unknown Simulators are now handled better with an option to report an issue.

**Fixed:**
- `AVCaptureSessionDidStartRunning` is now posted by Simulator Camera sessions. (Thanks, A. Singh!)
- Fixed Simulator Camera crashes when apps configure exposure or observe still-image stabilization state. (Thanks, A. Daniel and F. Byaruhanga!)
- Fixed Simulator Camera preview-layer crashes caused by UIKit sending view-environment selectors to RocketSim's preview store. (Thanks, M. Richman!)
- Flutter's official camera plugin can now recreate RocketSim mock cameras by unique ID. (Thanks, Baptiste DUPUCH!)
- Added an environment variable and a `None` camera option to make Simulator Camera behave as unavailable when apps need their default no-camera fallback. (Thanks, I. Orlov and Stéphane!)
- Simulator Camera sample buffers now respect requested pixel formats and video orientation when delivering frames to apps. (Thanks, A. Singh!)
- Fixed RocketSim Connect showing stale or empty network data after relaunching your app. The Network Monitor now follows the latest live run instead of staying on a previously selected or empty session, unless you deliberately pin an older session. Connect diagnostics reports also now record connection reset reasons and ECONNRESET details for faster support triage. (Thanks, Luis Canto Hurtado!)

# 16.1.0

**New:**
- Added official support for Xcode 27 & Device Hub.

**Fixed:**
- Fixed an unknown Simulator error from showing up without a way to escape.
- The Screen Recording permission window no longer keeps reappearing at launch and during usage when access is already granted. RocketSim now confirms the permission through ScreenCaptureKit (the same API used for capturing) and only re-prompts on a genuine denial, instead of trusting a stale `CGPreflightScreenCaptureAccess` "denied" that could occur on macOS Sequoia and Tahoe. (Thanks, A. Afif and K. Matzka!)
- Better cleanup of unused captured assets.
- Fixed iPhone 17 device-frame exports rendering clipped shadows. (Thanks, Ben!)
- Fixed iPhone 17 MP4 exports rendering the screen content with a slightly mismatched corner radius compared to the device bezel. (Thanks, C. Swapp!)

# 16.0.4

**New:**
- Recordings with Simulator and microphone audio now export as a single playback-compatible audio track by default, with a new setting to keep separate tracks for post-production. (Thanks, P. Friese!)
- Connected physical devices can now be opened manually from the new status bar `Connected Devices` menu, with a new setting to keep device detection enabled without automatically opening preview windows. (Thanks, Matthew Loewen!)

**Fixed:**
- Fixed the RocketSim Pro paywall showing free-trial copy for discounted yearly purchases that charge immediately. (Thanks, Damir Štuhec!)
- Fixed a stuck Simulator recording that could only be ended by quitting RocketSim: rapidly tapping the stop button while a long recording was finalizing used to spawn parallel stop pipelines, growing memory to over 1 GB and never releasing the recorder. Stops are now idempotent. (Thanks, D. Skwiggs!)
- Fixed exported videos showing a device bezel shadow that could slowly grow in some players by clearing reused compositor buffers before drawing each frame. (Thanks, C. Swapp!)

# 16.0.3 (317)

**New:**
- Agent interactions now support portrait-upside-down Simulator orientation, keeping taps, gestures, and annotated snapshots aligned for CLI-driven workflows. (Thanks, P. Ruzman!)
- The `rocketsim` CLI can now answer Simulator Face ID prompts using `interact biometric match` or `nomatch`. (Thanks, P. Ruzman!)

**Fixed:**
- Agentic Coding in Xcode Agent Skill installation now also supports Xcode's Codex assistant.
- Fixed a crash when starting Simulator recordings with microphone capture while the selected input device exposes an unsupported multi-channel audio format. RocketSim now records microphones directly through AVFoundation so multi-channel USB interfaces keep working. (Thanks, Sebastian and S. Grunewald!)

# 16.0.2 (316)

**New:**
- Microphone recording now works for physical devices.
- Agent Skill installation now includes an explicit Agentic Coding in Xcode option for Xcode's built-in coding assistant. (Thanks, C. Pothaar)
- Location app actions now support long-pressing the map to use selected coordinates as waypoints, with a Follow roads toggle for direct off-road routes. (Thanks, D. Yoo!)

**Fixed:**
- Fixed Physical Devices live previews appearing too bright by rendering captured frames through a Metal/Core Image SDR pipeline. (Thanks, T. Hensel!)
- Fixed Simulator recordings failing after Xcode was updated while RocketSim kept running by refreshing stale Simulator control state and retrying once. (Thanks, H. van der Ploeg!)
- Fixed RocketSim agent CLI setup guidance so agents recover when their shell `PATH` cannot see an already-installed `rocketsim` command. Diagnostics reports now include Command Line Tool install state for faster support triage. (Thanks, J. Sherlock!)
- Fixed `rocketsim doctor` reporting `cli_on_path` failures or warnings even when the CLI was correctly installed and on PATH. The check now uses the CLI's own resolved executable path, so installs in PATH locations that aren't visible to the sandboxed RocketSim.app (such as `/usr/local/bin`) report correctly, including when launched as a bare `rocketsim` command. (Thanks, D. Bertrand!)
- Fixed Command Line Tool installation rejecting `~/.local/bin` even when that folder is on the user's terminal `PATH`. (Thanks, Daniel Yoo!)

# 16.0.1

**New:**
- The side window now provides visual feedback for Simulator App audio and microphone audio.
- Video editor now shows a waveform if audio was recorded.
- Trim handle now shows a trim mouse cursor on hover.
- User Defaults Editor now contains a manual refresh button. (Thanks, O. Okbay)
- Added zoomed annotated snapshots to the `rocketsim` CLI using element IDs, labels, types, or values, making visual target-finding easier for agents.
- Discarding a capture now asks for confirmation and moves files to the Trash, making accidental deletes recoverable.

**Improved:**
- Agent CLI workflows now require fewer repeated approvals and support smarter refreshes and faster wait polling.
- RocketSim agent guidance now reserves `rocketsim doctor` for setup troubleshooting, and doctor reports the sandbox accessibility fallback as a passing fetch route.
- Video editor previews now play recorded audio alongside the waveform.
- Snapshot zooming now uses device-aware scale detection and clearer error reasons for offscreen or zero-area elements.

**Fixed:**
- Capture editor inspector settings are now remembered across captures and stay in sync with the floating capture controls. (Thanks, E. Sanchez!)
- Optimized window server usage, reducing CPU consumption. (Thanks, S. Vieira)
- Fixed the macOS menu bar microphone indicator staying lit after stopping a Simulator recording with the microphone enabled.
- The Command Line Tool install confirmation sheet now renders correctly in dark mode. (Thanks, H. v.d. Ploeg & L. Mehlig!)
- Video editor previews now appear immediately while fallback frames, seeking, and trim thumbnails continue loading in the background. (Thanks, E. Sanchez!)
- Fixed trim selections not being applied when exporting MP4 or GIF recordings.
- Fixed physical-device side windows disappearing after switching away from RocketSim and back.
- Fixed physical-device streaming matching for USB devices whose capture identifiers do not match their UDIDs.
- Fixed landscape support for physical device streaming windows.
- Fixed duplicate Simulator names resolving to the wrong window by using runtime suffixes in window titles.
- Fixed crash when getting an appIcon with iOS 26 Simulator (Thanks, jaecheoljung)

# 16.0.0 (312)

**New:**
- RocketSim now supports connected physical iOS devices: USB-connected iPhones appear in live preview windows with side-window controls, screenshots, disconnect-safe video recording with audio, comparing overlays, and device-specific window positioning.
- Added Physical Devices settings for USB support, network-detected devices, and ignored devices, including an in-window option to hide a device you do not want RocketSim to manage.
- Added a dedicated `CLI & Agent` settings page with installers for the bundled `rocketsim` command line tool and agent skill. The CLI installs as a symlink into a folder you pick on your PATH, so App Store updates keep it up to date automatically.
- Added `rocketsim doctor` to verify the CLI install, RocketSim app discovery, IPC reachability, simulator state, accessibility fetch route, and snapshot-store readiness before you hand control to an agent.
- Added `rocketsim screenshot` as a plain PNG fallback command for agents and automations that need visual context.

**Improved:**
- VoiceOver overlay is now faster and more complete, including elements like tab bars and nav bars. CLI performance improved by 25x.
- Physical device windows are more reliable and polished, with dark preview chrome, full-bleed device bezels, corner resizing, restored window positions, cleaner USB discovery, and improved reconnect behavior.
- The agent protocol now emits one consistent `rs/1` JSON envelope with typed errors across `elements`, `screen`, `interact`, `wait`, `do`, `snapshot`, and `doctor`, making it easier for external agent skills and automations to consume reliably.
- Agent interactions are now more robust: `interact` settles against fresh snapshots, stale `--screen` hashes fail fast, screen-change waits advance to fresh snapshots, coordinate swipes route through real HID gestures, and `interact scroll` can resolve the nearest scrollable ancestor from a visible child element.
- Agent snapshots now surface sparse web content, perception recovery hints, and ambiguity hints for duplicate labels so agents can recover with visual fallback when accessibility data is incomplete.

**Fixed:**
- Fixed RocketSim Connect payload handling running on the main thread, reducing profiling noise and avoiding unnecessary main-thread compression work in linked apps. (Thanks, K. Titov!)
- App Actions add/edit sheets now always render in dark mode, matching the rest of RocketSim's floating UI. (Thanks, L. Tuss!)
- App Actions configurations shared via Git no longer regenerate identifiers on every launch, eliminating noisy diffs across team members and making the JSON file safe to commit. Locations are now imported from the file as well. (Thanks, N. Yun!)
- Network Monitoring now reconnects reliably after rerunning a simulator app without needing to restart RocketSim. (Thanks, Tonni Hyldgaard!)
- Fixed recordings automatically exporting visible touch indicators even when touches were turned off, while still keeping captured touches available in the post editor for retrospective enabling. (Thanks, G. Gerber!)
- Fixed automatic breakpoint installation for RocketSim Connect. (Thanks, L. Hurtado!)
- Fixed the Voice Over overlay getting stuck without elements when the active Simulator window was temporarily unavailable. (Thanks, A. Mohamad!)
- Fixed device bezels for iPhone 14 Plus, iPhone 15 Pro, iPhone 15 Pro Max, iPhone 16 and iPhone 16 Plus rounding the screen content with the wrong radius, which left a transparent halo at the corners.

# 15.1.0 (311)

**New:**
- Deeplinks can now prompt for a single argument by using {ARGUMENT} in the URL, including quick relaunch pills for your most recently used values. (Thanks, H. v.d. Ploeg!)
- Holding `Cmd` over the floating side window now swaps the more button for a quick minimize button, making it faster to get RocketSim out of the way. (Thanks, T. MacDonald!)
- The Network Monitor now shows connected app logs alongside network requests, making it easier to correlate app activity with request traffic.
- Recordings now show both touch points during Option-key pinch and rotate gestures, matching the Simulator preview more closely. (Thanks, R. Labs and E. Sanchez!)
- The floating thumbnail has become a little bit bigger for a better presence on larger screens.

**Fixed:**
- Fixed a crash that could happen while exporting MP4 and GIF recordings on macOS 15. (Thanks, Bacil!)
- Fixed app group plist discovery for simulator apps so Recent Builds and User Defaults lists now show app group preferences correctly. (Thanks, Daij-Djan!)

# 15.0.3 (310)

**New:**
- Added a `Reset Keychain` quick action to the Recent Builds side window so you can clear a Simulator app's keychain without leaving RocketSim.

**Improved:**
- Build Insights now avoids unnecessary Core Data work and log reloads, improving responsiveness and reducing background churn.
- App Actions settings now reuse in-memory data instead of issuing extra fetches, making the settings screen more efficient.
- RocketSim Connect session lookups now happen off the main context during reconnect and new-run detection, reducing UI blocking.

**Fixed:**
- Fixed landscape MP4 recordings being generated incorrectly when using landscape orientation with device bezels. (Thanks, A. Machen!)

# 15.0.2 (308)
- Fixed a small issue happening on launch.

# 15.0.1 (307)

**Improved:**
- Capturing screenshots performance is now faster

**Fixed:**
- Fixed a crash that could happen while exporting transparent videos. (Thanks, D. Kroese!)
- Fixed a crash that could happen while capturing screenshots repeatedly after each other. (Thanks P. Bohomolnyi, A. Vivo!)
- Screenshots and videos now use the active simulator when multiple Simulator windows are open. (Thanks, M. Loewen!)
- Grammar mistake in Diagnostics alert (Thanks, D. Kroese!)
- Orange dot in status bar won't show up when general setting isn't changed (Thanks, A. Hershberger!)
- Changing the output ratio in the capture editor now updates the bezel picker to reflect the required device bezel. (Thanks, Pol!)
- Camera permission is no longer requested on launch or repeated from simulator-driven camera activity. RocketSim now only asks after pressing `Authorize Camera Access`. (Thanks, R. van Weersel, P. Tremadio, Chuck!)
- Spacebar now plays and pauses video previews in the post editor. (Thanks, Pol!)

# 15.0.0 (306)
**New:**
- There is now a post editor for screenshots and videos.
- Added a grid/list layout toggle to the deeplinks and push notifications action list for easier navigation.
- Networking features (speed control and network monitor) now have their own dedicated tab in the side window for improved discoverability.
- Tinted Liquid Glass accessibility toggle for iOS 26 simulators, allowing developers to switch the glass legibility setting live without navigating Settings.app.
- Network requests context menu now includes a "Copy Summary" option that copies a redacted version of the request summary with sensitive data (API keys, bearer tokens, etc.) automatically redacted.
- VoiceOver Accessibility Overlay with keyboard navigation for the Simulator.
- 120 FPS recording support using the Simulator framebuffer (Pro).
- Redesigned main window with Build Insights and Network Insights.
- "Open GitHub Issues" option in the status bar menu.
- Shared Xcode scheme RocketSim Sparkle for Debug-Sparkle and Release-Sparkle (direct distribution) builds.

**Fixed:**
- Added support for latest Simulators.
- Fixed video conversion failing with "Conversion failed, Retry" when recording with an external microphone selected. (Thanks, O. Atkinson!)
- Fixed the network monitor showing requests from old sessions instead of the current session.
- Fixed floating side window not following the Simulator when moving it to a secondary screen in multi-monitor setups. (Thanks, F. Mignogna)
- App Store Connect screenshot dimensions are now exported at the correct native device resolution for all device classes. (Thanks, M. Pękala, T. Sempf!)
- Audio in recorded simulator videos is now properly synchronized with video. (Thanks, Matthew, Avi!)
- Eliminated blank frames at the start of framebuffer recordings caused by decoder warmup.
- Touch indicators in framebuffer recordings now match the appearance of simctl recordings (border ring gap, press-scale animation).
- Location picker popover now correctly enforces dark mode. (Thanks, A. Durbalo)
- User Defaults Editor no longer shows up again after closing and focusing the Simulator. (Thanks, O. Foggin)
- User Defaults Editor now remains open and updates correctly on rebuilds (Thanks, Tito)
- Fixed a crash caused by background preference updates triggering main-actor UI observers off the main executor.
- Side window now correctly updates when switching between same-name simulators with different OS versions.

# 14.5.0 (295)
**New:**
- Side window shows a clear icon now for the Network Monitoring quick view.
- You can now configure metadata to show on top of captures. See the new metadata toggle in the side window.
- The Network Monitor console allows you to export network requests for AI evaluation, including predefined prompts.
- Network requests in the Network Monitor console can now be navigated using arrow keys (up/down) when a cell is selected.

**Improved:**
- Monitoring system settings like dark mode is now more efficient.

**Fixed:**
- Simulator Camera dropdown no longer appears empty
- Preview popover now scales to the available screen with padding so captures always fit.
- Builds created by Xcode 26.2 are now properly monitored.
- Optimized the performance of monitoring new builds and prevented duplicate parsing of build logs.
- Settings sidebar can no longer collapse.

# 14.4.0 (294)
**New:**
- You can now configure the Network Monitor to automatically start a new session when a new build launches. (Thanks, D. Neykov!)
- You can now record the system microphone during video recordings. (Thanks, E. Sanchez, J. Blasius, R. Jonson)

**Improved:**
- RocketSim Connect logs are now using os_log (Thanks, E. Sanchez!)
- Network Monitoring is now much more reliable on reconnecting after relaunches. (Thanks, J. Genden, A. Mittaz, Alex, A. Ashraf)

# 14.3.3 (293)
**Fixed:**
- Start trial side window no longer shows up if already pro or while having a license.
- A crash happening on launch related to app icon fetching (Thanks, Peter V.!)

# 14.3.2 (292)
**New:**
- You can now configure whether duplicate frames in GIFs should be removed to reduce GIF size. (Thanks, Alonzi!)

**Fixed:**
- Better support for fullscreen development.
- 100% loss mode could sometimes affect other Mac applications. This is no longer the case. (Thanks, D. Dimitrov)
- "Watch demo" button is no longer visible when Network Monitor is connected.

# 14.3.1 (291)
**New:**
You can now use CMD to "Save as..." on a thumbnail for a recording. 

**Fixed:**
- iPhone 17 real device bezel now works properly
- Added support for M5 simulators (Thanks, L. Creative, vdhamer)
- Added support for latest Apple Watch devices.
- App Icon works again if an app only comes with an Icon Composer app icon.

# 14.3.0 (290)
**New:**
- Push Notifications can now be granted, revoked, or reset. (Thanks for the push, Soundcloud team!)
- Real device bezels are now an option for captures (Thanks for the push, Mustafa & Hidde!)
- "Remove Watermark" option is no longer visible when Pro. (Thanks, Edward!)

**Improved:**
- Floating thumbnail now has a trash icon instead of cross to clearly indicate it's being removed.

# 14.2.5
**New:**
- The floating window can be hidden from the status bar.

**Improved:**
- Network Monitoring setup is more prominent and clearly explained.

**Fixed:**
- Network Speed Control info popup looks good in light mode now (Thanks, A. Puchta!)
- Distances will hide when rulers are turned off (Thanks, Roman!)
- Simulator camera no longer crashes for isStillimageStabilizationScene (Thanks, J. Judelson!)
- The welcome view no longer shows up consistently on launch for free users

# 14.2.4
**Fixed:**
- Magnifier fails when moving to another display (Thanks, S. Lee!)
- Captured photo's using Simulator Camera now contain metadata (Thanks, F. Byaruhanga)
- Roadmap view now looks good in light mode (Thanks, D. Vlasov)
- Custom Simulator names are now properly recorded (Thanks, M. Sabaris)

# 14.2.3 (286)
** Fixed:**
- Cancelling trimming now restores the thumbnail state properly (Thanks, E. Sanchez!)
- Catching failures in recording with enhanced logging to better fix potential issues.
- Touches show up again when exporting for quality (Thanks, Tim!) 
- Improved performance, quality, and stability of magnifier

# 14.2.2
**Fixed:**
- Dropping a file in the comparison view no longer crashes (Thanks, V. Rutberg!)
- Crash happening in Simulator Camera when fetching cgImage representation (Thanks, F. Byaruhanga)
- Crash happening in Simulator Camera when configuring `activeColorSpace`
- Network Monitor is now limited to 1000 requests to prevent memory from slowly growing (Thanks, D. Stoyanov)

# 14.2.1 (283)

**Fixed:**
- App Store Connect optimization is not enabled by default anymore
- Light mode appearance for popovers does no longer look wrong (Thanks, cldrr!)
- Xcode build duration formatting respects locale and formats as seconds (Thanks, Omar!)

# 14.2.0
**New:**
You can now generate screenshots and videos in a preferred aspect ratio like 16:9. You'll find this option in the captures side window section. Enjoy!

**Fixed:**
- Pasting images for comparison is now more reliable.
- Enhanced debugging options for myself to help you with Network Speed Control issues. If it's not working, reach out via Settings -> About -> Report an issue.
- The latest Tahoe beta caused the onboarding to crash, this is now solved.

# 14.1.0
**New:**
We enhanced the captures side window. You can now change the touches and background from within the side window and NEW: use a mesh gradient as a background!

**Fixed:**
- RocketSim can now be used together with Pulse integrations.
- App Store Connect resolutions are up to date for September 2025 changes.
- A crash could happen when selecting a file in the design comparison.

# 14.0.1 (278)
**New:**
- The Accessibility Dynamic Type slider now provides quick access to the SwiftUI DynamicType value (Thanks, Leo!)

**Improved:**
- Magnifier shows image in higher quality now (Thanks, M. Lomtev)

**Fixed:**
- NSMicrophoneUsageDescription is no longer required for Simulator Camera (Thanks, P. Friese)
- When recording with a Pro and non-Pro Simulator, the correct one is now always used. (Thanks, L. Goldner)
- Camera only starts streaming when the Simulator actually requested it.
- RocketSimConnect no longer runs when in SwiftUI Previews mode. (Thanks, K. Türk)
- Deeplinks now properly open without blocking the app. (Thanks, N. Mouthaan!)

# 14.0.0 (277)
**New:**
- You can now press spacebar to show a preview of the screenshot/video thumbnail (Thanks, Aayush!)
- App Icon for macOS Tahoe
- Redesign following macOS glassifying effect
- Simplified controls using standard components for easier understanding
- Accent color support, customize to your system preference
- Added support for September 2025 Simulators (17, 17 Pro, 17 Pro Max, Air)

**Improved:**
- Screenshots and videos performance drastically improved
- GIF Conversion performance improved

**Fixed:**
- Magnifier no longer shows the cursor (Thanks, E. Conty!)
- Scrolling of thumbnails with the scroll wheel works more reliable
- A crash happening during GIF conversion should no longer occure

# 13.5.1 (273)
**NEW:**
- The Camera Simulation window can be set to hidden from General Preferences if not needed. (Thanks, M. Elagha)

**FIXED:**
- Applied several performance improvements.
- Audio is no longer out of sync with video (which previously occurred occasionally). (Thanks, M. Elagha)
- The directory picker sometimes stopped working. (Thanks, W. Lutz)
- Simulator Camera now captures metadata even without AVCaptureVideoDataOutput configured. (Thanks, N. Mauri)
- Simulator Camera now works properly with photo and video output. (Thanks, J. Hrach!)
- RocketSim Connect no longer disconnects right after connecting (happened occasionally)
- Simulator Camera now works with DataScannerViewController (Thanks, J. Stoppenbach!)

# 13.5.0 (272)
**NEW:**
Camera Simulation is now generally available and allows you to use your Mac camera inside the Simulator.
With this update, it also support AVCaptureMetadata to detect barcodes like QR.

# 13.4.1 (271)
**NEW:**
You can now use camera functionality in the Simulator by streaming your macOS camera.
Enable this functionality from the Settings and find out more about it in our documentation.

**FIXED:**
- A crash on launch happening due to missing Sparkle framework.
- Adjusting the video zoom factor for camera simulation does no longer result in a crash (no-op).
- Adjusting video mirroring for camera simulation does no longer result in a crash (no-op).
- Camera Simulation is now mirrored by default for a more natural experience. (Thanks, Hidde!)

# 13.4.0 (270)
**NEW:**
You can now use camera functionality in the Simulator by streaming your macOS camera.
Enable this functionality from the Settings and find out more about it in our documentation.

**FIXED:**
- Adjusting the video zoom factor for camera simulation does no longer result in a crash (no-op).
- Adjusting video mirroring for camera simulation does no longer result in a crash (no-op).
- Camera Simulation is now mirrored by default for a more natural experience (Thanks, Hidde!)

# 13.3.4 (268)

**FIXED:**
- Pasteboard URL execution now properly works with the history (Thanks, W. Jacobs!)
- RocketSim Connect no longer shows a warning like 'writeImageAtIndex'. (Thanks, G. Steffens)

# 13.3.3 (267)
**NEW:**
- Clipboard URL will only be replaced by a new URL (Thanks, Monday Team!)
- A clipboard URL history shows up in the status bar menu (Thanks, Monday Team!)

**FIXED:**
- Fixed a crash occuring for builds syncing.
- Fixed a bunch of smaller performance issues.

# 13.3.2 (266)
**FIXED:**
- Side window now works again with latest iPad simulators. (Thanks, R. Groot!)
- Optimized the performance of recent build monitoring which caused high CPU usage.
- Welcome view will be shown less often.

**NEW:**
- You can now disable the welcome view from showing on app startup inside General Settings (Thanks, N. Ansel!)
- You can now disable the orange dot in the status bar from General Settings (Thanks, A. Hershberger!)

# 13.3.1
**FIXED:**
- Recent builds properly update when a Simulator does not have any recent builds yet.
- Deeplinks are handled properly on fresh launch
- Synced app groups JSON files retain order of keys to prevent unexpected Git changes (Thanks, A. Yurkevich!)
- Added support for latest new iPad Simulators

# 13.3.0
**NEW:**
- Build insights now show incremental and clean builds seperately
- You can open deeplinks in the active simulator using a deeplink: rocketsim://open-deeplink?url=<your_url>

**FIXED:**
- Clean builds are no longer counted as a build. This drastically impacted build stats and lowered the averages quite a bit. It's recommended to look at future build stats only after installing this build.

# 13.2.0
**FIXED:**
- Network Monitor works again on macOS 15.4.
- There's now a "Scroll to Bottom" button in the Network Monitor to quickly jump to the latest request.
- By default, the Network Monitor will now follow your latest requests.
- Deleting a lot of Network Monitor requests will no longer result in a crash (Thanks, M. Jönsson)
- RocketSim Connect no longer crashes for background AVAsset download tasks (Thanks, B. Fischer)
- Added extra console logs to clarify if RocketSim Connect is working as expected.
- Fixed a crash happening right on launch (Thanks, C. Swapp)

# 13.1.3
**IMPROVED:**
- Added logging for RocketSimConnect to better facilitate fixing edge cases.

**FIXED:**
- Solved an issue where RocketSimConnect would not work due to invalid state.

# 13.1.2
**FIXED:**
- Found another case in which build insights wouldn't properly sync.

# 13.1.1
**FIXED:**
- Build insights better sync now using registered workspaces.

# 13.1.0
**NEW:**
- You can now use custom coordinates for locations (Thanks, C. Snyder!)
- You can now configure custom names for locations (Thanks, J. Sherlock!)

**FIXED:**
- Application folders open correctly if there are multiple recent builds with the same bundle identifier (Thanks, D. Yoo!)
- Use a fallback locale identifier if locale pretty strings aren't available (Thanks, L. Vogt!)
- Tap area of minus delete button in app actions group is now bigger

# 13.0.7
**NEW:**
- Added support for the iPhone 16e Simulator
- Added support for the iPad Mini (A17 Pro) Simulator
- Added support for new Xcode 16.3 Simulator directories restructure (Thanks, Noam!)

# 13.0.6

**FIXED:**
- Directory opener uses the selected recent build properly. (Thanks, Alonzi)
- Network Speed Control now considers all recent build bundle identifiers for filtering. (Thanks, M. Smith)
- Support more timezones by using known timezone identifiers (Thanks, N. Antebi)

# 13.0.5

**FIXED:**
- An unlinked device is no longer automatically linked upon startup (Thanks, N. Nijland!)
- Build activities are now also synced when already registered, but without App Group (Thanks, Monday team!)

# 13.0.4
Some users experienced issues with the Network Monitor. This can be solved by enabling RocketSim at:
System Settings → Privacy → Local Network → Turn RocketSim on.

We're now actively promoting this in the console as well when RocketSim Connect fails.

# 13.0.3
You're a developer, so you'll recognize this pain: High CPU was caused by an SF Symbol animation in SwiftUI.
Yes, indeed, a single SwiftUI modifier! Fixed now!

**FIXED:**
- Promo offer for monthly now correctly works. (Thanks, J. Fabisevich)
- High CPU caused by Network Monitor symbol animation. (Thanks, J. Fabisevich)
- Network Monitor performance improved for large number of requests (Thanks, K. van Seventer, Corné)
- Email subscribe window no longer jumps between textfields on typing. (Thanks, ayumakesit)

# 13.0.2
**FIXED:**
- RocketSim windows are no longer taking over spaces overview in Mission Control.
- Trial reminder does not automatically subscribe to SwiftLee Weekly.
- Trial copy in paywall only shows if actually eligible.
- Added a deeplink to open the roadmap for voting.

# 13.0.1
**FIXED:**
- Recent build app actions would not always show up.
- Onboarding would close without completing permissions.

# 13.0.0
**NEW:**
sk affecting your Mac's connectivity.
- Onboarding checklist: Try out all RocketSim features by following a features checklist.

**Improved:**
- Stage Manager caused the windows to show up weirdly if minimized. 
- Prevent tracking accessibility toggle when source of change is the Simulator.
- Network monitor for free users now properly shows a title bar.
- Dark mode for the Network Monitor (Thanks, Sean!)
- Both left and right shift now work with ruler distance and magnifier (Thanks, SwiftDev on X!)

# 12.12.0
**New:**
- Made it more clear that Network Traffic Monitoring is a thing in RocketSim
- Added RocketSim Connect instructions to set it up using a breakpoint.

**Improved:**
- Simulator Side Window, User Defaults Editor, and Network Traffic window now show up front whenever you open the Simulator. This results in a more seamless development experience. 
- Network Traffic Monitor console won't switch back to setup screen after being connected once. This allows you to pause the debugger or continue exploring network requests after a build stopped. (Thanks Abe, Jim, P. Wolowicz)
- Simulator Airplane Mode instructions for Sequoia now deeplinks into the correct system settings window.

**Fixed:**
- Simulator Side Window will show up again when activating the Simulator and it will no longer show a dock icon.
- Captures now require users to manually select a destination the first time, ensuring greater security and explicit consent.

# 12.11.17
- FIXED: An issue causing RocketSim windows to show up in expose on fresh launch (Thanks, J. Fabisevich)
- FIXED: Side window no longer floats on top of other RocketSim windows (Thanks, H. Vukovic)
- FIXED: Welcome screen looks good in light mode (Thanks, Sean)

# 12.11.16
- NEW: User Defaults Editor shows highlighted rows when clicking (Thanks, J. Bryson)
- NEW: Added a welcome view that shows at most once per week or when there's a new major release.
- FIXED: Crash taking place on launching RocketSim to the foreground
- FIXED: Reduced logging causing high CPU in exceptional occasions
- FIXED: RocketSim Connect no longer creates user defaults values

# 12.11.15
- NEW: Preparing for RocketSim Insights

# 12.11.14
- FIXED: An issue causing RocketSim windows to show up in expose (Thanks, J. Fabisevich, P. Friese)
- FIXED: Watermark is now disabled automatically after becoming Pro (Thanks, xu-chris)
- FIXED: Locales are now ordered alphabetically (Thanks, B. Kolkman, Lindboe)

# 12.11.13
- FIXED: another bug caused by Sequoia, leading to developer directory permissions failure. (Thanks, J. McCance)
- UPDATED: Improved the onboarding messaging based on RocktSim Developer Research 2024. Developers report building up to 2 times faster.
- NEW: You can now redeem offer codes from the sales view.

# 12.11.12
- FIXED: macOS 15.1 will fix Xcode access on Sequoia. Until then, this release contains a fix to solve Xcode selection for the current active session.

# 12.11.11
- FIXED: App icon no longer shows up if there's no RocketSim window visible (Thanks, J. Fabisevich, K. Oelfke)

# 12.11.10
- NEW: Added notes about a bug on macOS 15.0.0 causing Xcode selection to fail unexpectedly.

# 12.11.9
- FIXED: A crash happening when changing the grid size to 0 while grid is visible (Thanks, Miguelife)
- FIXED: Latest devices support for App Store Connect preview resolutions
- FIXED: Side window remains clickable when preferences are open (Thanks, J. Bailey)
- FIXED: Adding new deeplinks, push notifications, or locations refreshes the side window (Thanks, Tomas)
- FIXED: Wildcard bundle identifiers now work with push notifications
- FIXED: Deeplinks, Locations, and Push Notifications no longer require two clicks when RocketSim is not in focus (Thanks, J. Bailey)
- FIXED: RocketSim no longer occupies screen sharing (Thanks, J. Fabisevich)
- FIXED: Xcode selection is no longer needed for newest Watch Simulator (Thanks, K. Oelfke)
- NEW: Saved location will be opened if thumbnails auto close settings is enabled (Thanks, F. Cani)
- NEW: App Actions preferences screen is now using a table for easier editing, filtering, and handling large number of actions.

# 12.11.8
- FIXED: A crash happening on launch for some users. (Thanks, D. Taka, L. Gergel)

# 12.11.7
- NEW: Added support for iPhone 16 etc. devices

# 12.11.6
## Internal
- Migrated to use ConvertKit emails

# 12.11.5
- FIXED: RocketSim's full screen window is no longer visible during screen sharing (Thanks, J. Fabisevich!)
- FIXED: Network Monitor toolbar no longer disappears or becomes unresponive

# 12.11.4
- NEW: Updated the onboarding and added feature previews to sales page.
- FIXED: A crash happening for some clients due to CA_ASSERT_MAIN_THREAD_TRANSACTIONS (Thanks, J. Riley!)
- FIXED: A crash happening when turning on/off slow animations

# 12.11.3
- NEW: Side window shows last 5 network requests
- FIXED: RocketSim Connect onboarding allows scrolling

# 12.11.2
- NEW: Network Monitor UI improvements, including help text & hiding unuseful elements (Thanks, E. Sanchez!)
- NEW: RocketSim Connect onboarding shows code examples (Thanks, E. Sanchez!)
- FIXED: RocketSim launches faster now due to optimizations
- FIXED: You can no longer open multiple RocketSim Connect setup windows

# 12.11.1
- FIXED: Grammar mistake in RocketSim Connect setup code
- FIXED: Removed assertion failures in Connect code and replaced with logs

# 12.11.0
- NEW: RocketSim Connect with Network Monitoring
- FIXED: Landscape left- or right will now be correctly detected.

# 12.10.0
- NEW: Copy pasteboard from and to the Simulator (Thanks, Basel)
- NEW: Toggle slow animations from the comparing window
- NEW: Toggle slow animations using a shortcut
- FIXED: RocketSim's windows are no longer hidden during screen capture
- FIXED: Ruler distances don't show up anymore if rulers are hidden
- IMPROVED: Application launch performance
- IMPROVED: Onboarding no longer asks for email since there's an in-app option

### Internal
- IMPROVED: Removed unnecessary refresh of devices on launch
- UPDATED: No longer using legacy RevenueCat API Key

# 12.9.5
- NEW: Application Groups can now be defined using wildcards. E.g. com.company.* (Thanks, George Labs!)
- FIXED: Status bar update minimum Xcode version now shows currently configured Xcode version (Thanks, Owen!)
- FIXED: Build statistics wouldn't always update in real time

# 12.9.4
- FIXED: Side window is no longet cut off (Thanks, D. Vekariya)

# 12.9.3
- NEW: Add support for latest iPad M4 Simulator

# 12.9.2
- NEW: Explore build durations per Xcode version
- NEW: App Icon is now aligned with Xcode & Simulator app icons (Thanks, E. Sanchez)

### Internal
- NEW: Added email upsell in side window
- NEW: Added promo offer upsell in side window
- NEW: Added `Campaign` custom field to Sendy subscriptions

# 12.9.1
- NEW: Build insights show a p75 and p95 percentile for better understanding of build times
- FIXED: Build insights change arrow is now correct 
- FIXED: Apple TV is still unsupported, but no longer becomes unrecoverable.
- FIXED: Order of App Actions in preferences now matches the order of the side window (Thanks, J. Fabisevich)
- FIXED: Vision Pro screenshots are no longer skewed (Thanks, R. Lariotte)
- FIXED: App Preview Videos are now correctly optimized for App Store Connect (Thanks, A. Sereno, O. Bukhantsov)
- FIXED: URLs executed from clipboard are now properly encoded (Thanks, W. Jacobs)

# 12.9.0
- NEW: Build insights. Track your build count and duration from within the side window
- IMPROVED: Perform button contains a chevron now to improve the affordance (Thanks, E. Sanchez)
- FIXED: Device names with e.g. 16GB in their name now work with the side window (Thanks, J. van Order)
- FIXED: Status bar correctly shows 9:41 in all timezones now (Thanks, P. Friese)
- FIXED: RocketSim's windows don't show up as sharable during meetings anymore (Thanks, R. Verhoeven)
- FIXED: Recent builds are now filtered on Simulator runtime identifier

# 12.8.0
- NEW: Other plist files found inside the standard preferences folder are now available for the User Defaults Editor (Thanks, M. De Vries) 
- IMPROVED: Adding a new action now responds to the return key (Thanks, J. Fabisevich)
- IMPROVED: Deeplinks edit view now shows a bigger textfield for easier URL editing (Thanks, M. Buchetics)
- IMPROVED: OS version prefix will now show up if two builds with the same name and simulator show up to distinguish builds (Thanks, M. Monizza)
- FIXED: Changing the status bar wifi bars from 4 to 2 and back to 4 now works (Thanks, R. Lariotte)
- FIXED: Editing a location now works again (Thanks, M. Buchetics)

# 12.7.1
- FIXED: Simulator window updates to another Simulator upon closing a Simulator
- FIXED: Vision Pro Simulator no longer asks for Xcode version (Thanks, F. Morin!)

# 12.7.0
- FIXED: Configuring the status bar time when 24 hour clock is turned of now works (Thanks, F. Pizzano!)
- FIXED: The Side Window will now show up next to clones as well. (Thanks, K. Matzka!)
- FIXED: Two Simulators, same name, different OS, are now handled well with the Side Window. (Thanks, R. Silva!)
- FIXED: Watermarks are now correctly positioned on all Simulators
- FIXED: App Store Connect App Preview resolutions are now correct (Thanks, A. Arutiunov, S. Gardner!)
- FIXED: Video timer visible after recording stopped no longer happens. (thanks, R. Silva!)
- IMPROVED: Side window updates faster when switching simulators using single-click
- IMPROVED: Reduced memory footprint and increased performance of switching between Simulators
- IMPROVED: Recent builds refresh much faster due to caching, resulting in a more responsive status bar menu (Thanks, M. Renaud!)

### Internal
- FIXED: Added a source field for SwiftLee subscribers

# 12.6.5
- FIXED: Changing the status bar could result in a crash (Thanks, F. Pizzano!)

### Internal
- NEW: Opt-in all users for launch at login to increase retention.
- NEW: Update segmentation for email subscribers to allow email campaigns for custom segments

# 12.6.4
- FIXED: Sometimes the sales window would show up, even when you're Pro.

### Internal
- NEW: Tracking launch on start as user property
- FIXED: License activation timeout no longer results in pro becoming `false`
- FIXED: Discount strikethrough price now matches the actual normal price when using monthly package

# 12.6.3
- FIXED: Simulators would sometimes not load if one of the Simulators' state is "Creating" (Thanks, R. Wells!)
- FIXED: Watch status bar changes aren't supported and that's now clear from the UI (Thanks, B. Rudhart)
- FIXED: When status bar overrides aren't available, the UI will now tell you

# 12.6.2
- NEW: Onboarding shows recent builds 
- FIXED: Status bar time is now set to 9:41 in all timezones (Thanks, G. Jerman)
- FIXED: Recent builds would sometimes not show up right after launch
- FIXED: Added small improvements to the sales view

# 12.6.1
- NEW: Onboarding shows recent builds 
- FIXED: Status bar time is now set to 9:41 in all timezones (Thanks, G. Jerman)
- FIXED: Recent builds would sometimes not show up right after launch

# 12.6.0
- NEW: You can now update the status bar appearance from the capturing window.

# 12.5.0
- NEW: You can now adjust comparison offset using the keyboard. Hold shift to move with 10px at each step. (Thanks, C. Riboe, C. Garcia!)
- FIXED: Simulator is not launched on fresh RocketSim launch. (Thanks, G. Jerman!)
- FIXED: Changing the captures location didn't update the UI (Thanks, B. Scott!)

### Internal:
- NEW: Added SwiftLee Weekly to menu subscribe
- NEW: Updated `emailSubscribe` event to contain list as property

# 12.4.2
- FIXED: JSON Syncing of app groups is now more clear
- FIXED: Rulers distance no longer clips behind device mask (Thanks, E. Ntonas!)

### Internal
- NEW: You can now subscribe to SwiftLee Weekly in the onboarding

# 12.4.1
- FIXED: Crash wasn't fixed previously. Now it should be by using CADisplayLink for the magnifier.
- FIXED: Another small crash found when the grid thick lines was set to 0 (Thanks, Arman!)

### Internal
- NEW: Updated tracking event for payramp
- FIXED: Booting Simulator on launch now works as expected

# 12.4.0
- FIXED: A crash happening when the Grid block size was set to 0 (Thanks, Arman!)
- FIXED: A crash related to the magnifier
- FIXED: Onboarding demo video button would not change from 'skip' to 'next' (Thanks, Swaan!)

### Internal
- NEW: Payramp experiment

# 12.3.0
- NEW: Recent builds selection now shows "No other builds" when there's only a single recent build available. (Thanks, B. Scheele)
- NEW: A new reset button allows you to restore dynamic type to its default value (Thanks, H. van der Ploeg)
- NEW: Filenames for screenshots and recordings now contain the device inches (Thanks, J. Bryson)
- NEW: You can now open the recordings destination location from the Settings screen (Thanks, R. Silva)
- NEW: You can now disable the side window damping animation from the Settings (Thanks, devmuaz)
- NEW: Enable auto saving for captures from the Captures settings screens (Thanks, D. Smith)
- NEW: A new shortcut allows you to quickly minimize the side window (Thanks, D. Lutti)
- NEW: Search App Actions to filter a large collection (Thanks, F. Jacques) 
- FIXED: Improved performance of SwiftUI redraws to increase overall responsiveness

# 12.2.0
- NEW: Increased the contrast of the side window for better visibility on dark backgrounds 
- NEW: Added a 'Report an issue' menu item to the status bar menu (Thanks, O. Bilous)
- NEW: Added a small white border to increase visibility of onboarding window
- FIXED: Lifetime subscription (yes, that existed in the early days!) now correctly restores when other subscriptions are also found (Thanks, P. Adams!)
- FIXED: Updated Xcode selection failed alert (Thanks, O. Bilous)

### Internal
- NEW: Add promo offer for yearly subscription

# 12.1.1
- FIXED: Group User Defaults are now detected if the group identifier doesn't contain the exact bundle identifier (Thanks, H. van der Ploeg)

# 12.1.0
- NEW: Redesigned the recent builds window to be more focused on the current application
- NEW: Any User Defaults plist inside your App Group can now be edited (Thanks, R. Stone)
- NEW: A dedicated User Defaults button makes accessing the User Defaults Editor easier

# 12.0.4
- FIXED: Group User Defaults would not always show up (Thanks, S. Sturm, H. van der Ploeg)
- NEW: Added a Status Bar Menu link to RocketSim's new documentation

# 12.0.3
- FIXED: Recovering from unknown Simulator is now guided by allowing you to select a new Xcode
- FIXED: User Defaults search is now case insensitive (Thanks, K. Oelfke)
- FIXED: Closing all Simulator could result in high CPU usage (Thanks, M. Doubek, K. Oelfke)

# 12.0.2
- FIXED: Welcome screen textfield editing works again (Thanks, J. Parker)
- UPDATED: New support email address

# 12.0.1
- FIXED: Recordings and screenshots work again

# 12.0.0
- NEW: A brand new User Defaults editor allows you to edit user defaults in realtime
- NEW: Added Group User Defaults to the list of files & directories

# 11.3.0
- NEW: Added an onboarding video to both status bar menu and onboarding.
- FIXED: Side window actions are now working directly even when the window is not active.

# 11.2.2
- FIXED: Added support for latest simulators

# 11.2.1
- NEW: You can now position an overlay image using pixel precision (Thanks, C. Garcia, A. Spreys)
- FIXED: Touches only show when enabled. (Thanks, J. Wardell)
- FIXED: Increased contrast of Roadmap view (Thanks, E. Dorphy)
- FIXED: Rulers & Magnifier now work correctly in landscape mode (Thanks, S. Houtzager)
- FIXED: Cursor will no longer be visible inside magnifier (Thanks, A. Dee)
- FIXED: Magnifier vertical coordinates are no longer inverted (Thanks, M. Strokin)

# 11.2.0
- NEW: Perform Menu Action: Relaunch your app in a given language/locale (Thanks, V. Socaciu)
- NEW: Perform Menu Action: Relaunch your app in a given time zone
- FIXED: Touches on visionOS Simulator are now positioned correctly.
- IMPROVED: Roadmap items are now sorted on status

# 11.1.0
- NEW: You can update the time zone with a location change (Thanks, O. Khan!)
- NEW: Mouse events will now clickthrough the comparing overlay image
- FIXED: Comparing tool and rulers work again (Thanks, H. Solorzano)

# 11.0.0
- NEW: Added support for the Apple Vision (visionOS) Simulator
- NEW: Added support for the Apple Watch Simulator 
- NEW: Added support for Xcode 15 Beta
- IMPROVED: Bezels look sharper, and inputs are better placed
- IMPROVED: Bezel captures are generating faster
- FIXED: Audio recording works again on macOS 13.3 and up

Beta 2
- NEW: Added extra debug logging for audio issues
- NEW: Added pressing touch animations
- FIXED: Default touches color is now better of contrast

Beta 3:
- NEW: Edge pop drag touches are now visible in recordings (Thanks, Julia)
- NEW: Touches show with a little extra in-animation for easier following
- NEW: A new Capturing Setting allows to show touches constantly, following your mouse. Also known as Attention Effect. (Thanks, Btjones) 
- FIXED: Touches now work through the overlay if opacity mode is active (Thanks, Hidde)
- FIXED: Default App Icon for watchOS is now correct (Thanks, Hidde)
- FIXED: watchOS App Icon is now rounded in Recent Builds (Thanks, Hidde) 

# 10.5.1
- FIXED: You can vote on features again. Open the Status Bar Menu and select "Roadmap..."

# 10.5.0
- NEW: Added an environment toggle for Light/Dark Mode
- NEW: You can now use ⇧ Shift to show the distance between rulers
- UPDATED: Onboarding now asks for Developer Directory access to ensure functionalities like environment toggles work as expected

# 10.4.1
- FIXED: Sales window only opens once after ruler was clicked (Thanks, Dr. Holger Flick)
- FIXED: Recording audio with an external screen is now working (Thanks, alvesmarcos)

# 10.4.0
- NEW: License managing

NEW SUBTITLE
- Build Apps Faster
+ Rulers, Grid, Swift Tools

NEW KEYWORDS
- swift,swiftui,gif,tools,simctl,recording,devcleaner,grid,ruler,productivity,design,touches,bezels
+ playground,testflight,swiftui,deeplink,bakery,accessibility,xscope,simctl,recording,devcleaner,build

# 10.3.3
- FIXED: Environment Override Toggles will now work consistently (Thanks, S. Zats, A. Savides, and many more!)
- FIXED: Ruler outputs are no longer cut off (Thanks, V. Yevtushenko, Jostster)

# 10.3.2
- NEW: Implemented a slight under-the-hood improvement and fixed two of the most significant crashes.

# 10.3.1
- FIXED: Recordings could fail when audio was enabled (Thanks, B. Skane)

# 10.3.0
- NEW: Added an onboarding option to follow RocketSim's email list
- NEW: Simulator will launch and open when RocketSim starts (Thanks, Fesh-com)
- NEW: Advanced comparing sliders show pixel value for x- and y offsets. (Thanks, L. Griffie)
- NEW: You can double tap the advanced slider value textfields to reset
- NEW: Magnifier toggling can now be disabled
- NEW: You can use the Magnifier outside of the screen bounds
- NEW: Pick a color using the magnifier and copy the value as NSColor, UIColor, or SwiftUI Color
- FIXED: Simulator Side Window no longer attaches to Simulator NSMenus (Thanks, Vasselli)
- FIXED: Rulers can be removed by dragging outside of the view again

# 10.2.1
- UPDATED: Improved Tab Animation
- NEW: Airplane Mode system extension approval requirement is more clear
- NEW: Simulator automatically opens after onboarding completes

# 10.2.0
- NEW: Environment Overrides for Accessibility & Dynamic Type
- NEW: Moved the minimize button to the more menu
- NEW: Improved contrast of tab view and added some animations

# 10.1.0
- NEW: Airplane mode. Disable networking for a specific Simulator app, without affecting your Mac connectivity.
- NEW: Added a Settings promotion section
- FIXED: Improved touch area of Grid & Rulers buttons (Thanks, D. Cherny)
- FIXED: Permission buttons work again when locations section collapsed (Thanks, R. Jonson)
- FIXED: A crash happening when closing sheets
- FIXED: A crash happening when simulating a route with over 4000 waypoints (Thanks, A. Hart)

# 10.0.6
- NEW: Enable Stage Manager from the Status Bar Menu for the front-most Simulator (has to be an iPad). (Thanks, M. Zelinka)
- FIXED: iPad Air (5th Generation) with App Store Connect Preview conversion enabled now works. (Thanks, P. Miller)
- FIXED: GIFs are now correctly supporting landscape.
- FIXED: Onboarding is no longer a floating panel. (Thanks, J. Wardell)

# 10.0.5
- NEW: Sales View Redesign
- NEW: Onboarding re-activates after granted permissions
- FIXED: Deeplinks in the side window will now consistently execute

# 10.0.4
- UPDATED: Amplitude tracking for screens

# 10.0.3
* NEW DEVELOPER UTILITY: What the Error Code?? Get an explanation for errors like "The operation couldn't be completed"
* UPDATED: App Icon shows and hides based on visible windows

# 10.0.2
* NEW: You'll be warned if you're using multiple groups with the same bundle identifier
* NEW: You can now keep the floating windows visible, even when the Simulator hides. This can be useful when implementing designs with other IDEs like VSCode.
* FIXED: Screenshots no longer result in "Images can't contain alpha channels or transparencies." if dragged into App Store Connect (Thanks, B. Thompson, N. Efergan)
* FIXED: Reset button in side window not working properly (Thanks, D. Giani)
* FIXED: Section Header of quick actions is not tappable
* UPDATED: Changed Quick Actions add button title to just "Add"

# 10.0.1
FIXED
* Floating windows sometimes didn't show (Thanks, R. Jonson)

# 10.0
Introducing Location Simulation

* Scenario testing: City Run, Bicycle run, and Freeway Drive
* Simulate routes from start to destination using Quick Actions
* Update GPS to a specific point on the map

NEW
* Vote for upcoming features using the Roadmap statusbar menu item
* GIFs now support bezels and touches
* Recordings perform significantly faster
* Location Quick Actions: update the location of the Simulator
* Toggle between Quick Actions types for better overview
* Quick Actions show a help popover in case of long titles

FIXED
* Recent builds wouldn't always refresh

# 9.5.0
* NEW: Record videos with audio
* NEW: Grant, revoke, or reset camera permissions
* NEW: Access Settings from the side window menu
* FIXED: Magnifier now works on a second screen
* FIXED: Both screenshot & video now apply the same rotation

# 9.4.0
* NEW: Magnify for precise design validation
* NEW: Access settings from the side window context menu
* FIXED: Added support for the latest Simulators 

# 9.3.0:
* NEW: Advanced comparing options. Adjust zoom, horizontal, and vertical offsets.
* FIXED: Renamed Preferences to Settings

# 9.2.0:
* NEW: Added a directory for File Provider Storage (#249)
* NEW: Derived Data deletion is more performant by using trash (#245)
* NEW: Added a Terminate perform action
* NEW: Added a Relaunch perform action (#238)
* FIXED: Side window correctly shows on secondary screens (#256)
* FIXED: Editing App Actions Group title performs more consistently (#251)

# 9.1.0:
* NEW: Minimize mode. Hide the side window when you don't need it
* NEW: Sticky window alignment. Always show the window to the left, bottom, or right
* NEW: Added animations to improve the experience
* NEW: Screenshots now support App Store Connect Optimization
* NEW: Videos & Screenshots with bezels now support App Store Connect Optimization
* NEW: The Side Window animates smoothly with your Simulator

# 9.0.2
* FIXED: A minor issue causing in-app purchases to fail

# 9.0.1
* FIXED: Rulers are now clipped to the bounds of the Simulator screen
* FIXED: Update menu bar icon adjusts correctly and shows black in light mode

# 9.0.0
* NEW: Bundle identifier-based App Actions
* NEW: Send Push Notifications
* NEW: Updated floating window design
* NEW: Grant, Revoke, and Reset permissions quickly
* NEW: Videos support alpha channels now
* FIXED: Added support for the latest devices (Simulators)
* FIXED: App crashing with a grid block size of 0

# 8.7.0
* Bezels work again for free users
* Increased performance across the app, making the app feel more performant

# 8.6.2
* "An update is available" message no longer shows when you're already on the latest version.

# 8.6.1
* Applied several minor performance improvements and enhanced support logs

# 8.6.0
* Added support for the latest announced devices and new Simulators
* Fixed an issue causing RocketSim to be stuck at launch

# 8.5.0
NEW
* You can now change the device bezel color to any color you like

FIXES
* Fixed a typo (Thanks, vdhamer!)
* Sales window symbol is no longer wrongly displayed (Thanks, AbdelAli!)

# 8.4.0
* Recent builds window visibility can be toggled from preferences
* Recent builds with Single App Icon are now displayed correctly (Thanks, Sherlouk!)

# 8.3.0
NEW
- Grids now support thin & thick lines, configurable from the preferences.

# 8.2.0
NEW
- Rulers now show percentage for better position control. (Thanks for the idea, Hidde!)
- Derived data and previews cache deletion confirm alerts can now be suppressed. (Thanks for the idea, Sindre!)
FIXES
- Confirmation alerts are now following the Human Interface Guidelines. (Thanks, Sindre!) 

# 8.1.0
NEW
- Delete the Xcode Previews Cache in case you're running into Previews issues. (Thanks for the tip, Terje!)

# 8.0.3
FIXES
- Rating request popups is no longer spammy, sorry! (Thanks, Raph!)
- RocketSim window no longer shows up during space switching (Thanks, Nathan!)

# 8.0.2
FIXES
- Sales view is now better aligned (Thanks, F. Wallner!)
- Applied several performance improvements

# 8.0.1

NEW
- A new App Icon as a result of a collaboration with Michael Flarup and Adam Whitcroft.
- Added support for switching scenes

FIXES
- Statusbar image is now a little less wide (Thanks, Flo!)
- Removed Derived Data deletion confirmation (Thanks, J. Blasius!)
- Improve support for external screens 
- Floating thumbnails buttons now always work (Thanks, R. Skov!)

# 8.0.0
NEW
- Introducing Grids & Rulers
- Derived Data can now be deleted globally or per app
- Added a deeplink group remove button
- Floating windows visibility can now be toggled from the status bar menu
- You can now configure a shortcut to toggle the visibility of the floating windows

FIXES
- Copy of asset now actually copies the file
- Recent build menu now opens correctly on a second screen
- Touch no longer appears in the bottom-left corner
- Floating action buttons now also appear after the conversion completes while hovering
- The first touch is now captured as well during recordings
- Floating thumbnails start a little higher to take into account the dock spacing
- Onboarding images are no longer blurry on non-retina displays

# 0.5.0
- Pasteboard URL is now correctly remembered
- Pasteboard URL is now limited to 30 characters

# 0.4.0
- Refresh removed from the menu. Refreshing now happens automatically
- App version number is now visible in the preferences screen
- Running a deeplink successfully no longer shows an error notification
- Failures are reported more clearly with describing alerts
- Added simple tracking using Google Analytics

# 0.3.0
- You can now run a deeplink from the clipboard (#24)
- It's now more clear that the JSON feed URL should be a remote URL (#19)

# 0.2.0
- Showing a notification if deeplink launching failed (#20)
- Bring the simulator to the front upon executing the deeplink
- Use a shortcut to relaunch the last deeplink
- Using the front-most simulator now for deeplinking
- Releases can now be delivered (#13)
- No longer show error for successful deeplink

# 0.1.0
- Initial release containing a JSON feed and `.plist` file option
