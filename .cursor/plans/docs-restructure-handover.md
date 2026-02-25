# Documentation Restructure - Handover Document

## What Was Done

Full restructure of the RocketSim documentation site (Astro/Starlight) to improve feature discoverability. The sidebar went from 4 top-level collapsed sections to 12 clearly organized sections.

### Sidebar: Before vs After

**Before** (everything hidden behind "Features" > collapsed sub-groups):
```
Getting Started (collapsed)
Features (collapsed) > Capturing / Design Comparison / App Actions / RocketSim Connect / Accessibility
Appearance (collapsed)
Support (collapsed)
```

**After** (every feature category visible at a glance):
```
Getting Started (6 pages)
Screenshots & Recordings (7 pages)
Simulator Camera (link)
Status Bar (link)
Design Comparison (4 pages)
App Actions (6 pages)
Networking (3 pages)
Build Insights (2 pages)
Accessibility (3 pages)
User Defaults Editor (link)
Settings (2 pages)
Support (3 pages)
```

### New Pages Created (13)

1. `getting-started/setting-up-rocketsim-connect.md` - How RocketSim Connect works, setup via code or breakpoint, privacy note
2. `features/accessibility/voiceover-navigator.md` - Beta feature, VoiceOver element overlay
3. `features/capturing/120-fps-recordings.md` - Beta feature, high framerate recordings
4. `features/networking/networking-insights.md` - Beta feature, historical network analysis
5. `features/capturing/app-store-connect-optimization.md` - Extracted from recordings mega-page
6. `features/capturing/touch-indicators.md` - Extracted from recordings mega-page
7. `features/capturing/floating-thumbnail.md` - Post-capture workflow
8. `features/app-actions/quick-actions.md` - Split from general-app-actions
9. `features/app-actions/privacy-permissions.md` - Split from general-app-actions, includes push notification reset story
10. `features/app-actions/app-directory-access.md` - Split from general-app-actions
11. `features/build-insights/team-build-insights.md` - Includes Max Godfrey/Tilt testimonial
12. `features/accessibility/environment-overrides.md` - Accessibility toggles + Dynamic Type
13. `collections/feature/20-voiceover-navigator.md` - Landing page feature entry (uses placeholder image)

### Existing Pages Refactored (6)

- `recordings.md` - Trimmed to basics, renamed "Creating Recordings", extracted ASC/touch content
- `screenshots.md` - Renamed to "Taking Screenshots"
- `onboarding.md` - Added RocketSim philosophy section (side window as part of Simulator, user control)
- `side-window.md` - Enhanced with user control framing
- `exploring-all-rocketsim-features.md` - Repurposed as "Additional Resources"
- `user-defaults-editor.mdx` - Rewritten, fixed outdated "can't add values" content

### Files Moved

- `appearance/` -> `settings/` (side-window.md, shortcuts.md + their images)
- `app-actions/build-insights.md` -> `build-insights/build-insights.md`
- `app-actions/network-speed-control-and-simulator-airplane-mode.mdx` -> `networking/network-speed-control.mdx`
- `rocketsim-connect/network-traffic-monitoring.md` -> `networking/network-traffic-monitoring.md`
- `app-actions/user-defaults-editor.mdx` -> `features/user-defaults-editor.mdx`

### Files Deleted

- `app-actions/general-app-actions.mdx` (split into 3 dedicated pages)
- `rocketsim-connect/introduction-and-setup.md` (superseded by new RocketSim Connect page)
- `appearance/` directory (moved to `settings/`)
- `rocketsim-connect/` directory (content redistributed)

## What Still Needs Work

### Screenshots Needed (7 must-have)

The new pages are text-only. These screenshots would add the most value:

1. **VoiceOver Navigator** - Overlay showing numbered accessibility elements on a Simulator. Also needed for the landing page feature entry (`20-voiceover-navigator.md` currently uses a placeholder image from environment-overrides).
2. **120 FPS Recordings** - Settings toggle showing where to enable 120 FPS.
3. **Privacy & Permissions** - Side window showing the permission picker + Grant/Revoke/Reset buttons.
4. **App Directory Access** - The directory dropdown showing available folders.
5. **Team Build Insights** - Dashboard showing build time comparison across machines.
6. **Environment Overrides** - Accessibility toggles panel + Dynamic Type slider.
7. **Floating Thumbnail** - The thumbnail appearing with action buttons after a capture.

### Beta Feature TestFlight Links

The 3 beta feature pages (VoiceOver Navigator, 120 FPS Recordings, Networking Insights) have `PLACEHOLDER` in the TestFlight URL. Replace with the real TestFlight invite link.

### Content Review

All new pages were written using the antoine-writer skill for voice consistency. Review for:
- Accuracy of technical details (especially RocketSim Connect setup paths)
- Whether any features have changed since the codebase was analyzed
- Tone adjustments (the pages are a first draft)

### Internal Links

Some internal links use `/docs/docs/features/...` format. Verify these resolve correctly in production. The RocketSim Connect page links to `/docs/features/capturing/simulator-camera-support` and `/docs/features/networking/network-traffic-monitoring` — check if the `/docs/docs/` prefix is needed.

### Potential URL Redirects

Several pages were moved or deleted. If this is a live site with existing traffic, consider redirects for:
- `/docs/docs/appearance/side-window` -> `/docs/docs/settings/side-window`
- `/docs/docs/features/app-actions/build-insights` -> `/docs/docs/features/build-insights/build-insights`
- `/docs/docs/features/rocketsim-connect/*` -> corresponding networking/getting-started pages
- `/docs/docs/features/app-actions/general-app-actions` -> `/docs/docs/features/app-actions/quick-actions`
- `/docs/docs/features/app-actions/network-speed-control-and-simulator-airplane-mode` -> `/docs/docs/features/networking/network-speed-control`

## Key Decisions Made During Planning

1. **"Screenshots & Recordings" as one section** rather than two separate sections, because they share sub-features (ASC optimization, touch indicators, floating thumbnail).
2. **Simulator Camera and Status Bar as standalone links** rather than nested inside sections with only one page.
3. **Privacy messaging for RocketSim Connect kept brief** ("don't wake sleeping dogs") — a short reassurance, not a full privacy page.
4. **Push notification reset highlighted as unique to RocketSim** — `xcrun simctl privacy` can't do it.
5. **"Debugging Tools" section eliminated** — Network Speed Control moved to Networking, User Defaults Editor became a standalone link.
6. **Settings section** created for Side Window and Shortcuts (moved out of Getting Started — these are configuration, not onboarding).

## Technical Notes

- Build: `cd docs && npm run build` — 51 pages, 38 indexed, 0 errors
- Lint: `npm run lint` — 0 errors
- Typecheck: `npm run typecheck` — 0 errors
- The sidebar in `astro.config.ts` uses a mix of `autogenerate` (for sections with multiple pages in a directory) and explicit `link` entries (for standalone pages like Simulator Camera and Status Bar).
- The `package-lock.json` change is unrelated — it was already modified before this work started.

## Conversation Reference

The full planning conversation is in the agent transcripts. Key chat: [Docs restructure and gaps](b457782d-67f9-4c15-9419-9e8c827b9f30).
