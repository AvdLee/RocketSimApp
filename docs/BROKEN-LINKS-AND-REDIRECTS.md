# Broken links and redirects — full analysis

Analysis of all internal doc links and redirects after the docs restructure (committed and local changes). Ensures every `/docs/...` link has a valid target and old URLs redirect correctly.

---

## 1. Internal links audit (all current links)

Every internal doc link was checked against existing files. **All current link targets have a corresponding page** in the repo.

| Link target                                                    | Used in                                                                                                                    | File exists               |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `/docs/docs/features/app-actions/app-directory-access`         | user-defaults-editor.mdx                                                                                                   | ✓ app-directory-access.md |
| `/docs/features/capturing/simulator-camera-support`            | setting-up-rocketsim-connect.md                                                                                            | ✓                         |
| `/docs/features/networking/network-traffic-monitoring`         | setting-up-rocketsim-connect.md, network-speed-control.mdx, network-traffic-monitoring.md (Networking Insights), index.mdx | ✓                         |
| `/docs/features/networking/networking-insights`                | network-traffic-monitoring.md                                                                                              | ✓                         |
| `/docs/getting-started/setting-up-rocketsim-connect`           | network-traffic-monitoring.md, simulator-camera-support.md, networking-insights.md, index.mdx                              | ✓                         |
| `/docs/docs/features/capturing/app-store-connect-optimization` | recordings.md                                                                                                              | ✓                         |
| `/docs/docs/features/capturing/touch-indicators`               | recordings.md                                                                                                              | ✓                         |
| `/docs/docs/features/capturing/floating-thumbnail`             | recordings.md, app-store-connect-optimization.md                                                                           | ✓                         |
| `/docs/docs/features/build-insights/team-build-insights`       | build-insights.md                                                                                                          | ✓                         |
| `/docs/docs/settings/side-window`                              | onboarding.md                                                                                                              | ✓                         |
| `/docs/getting-started/onboarding`                             | index.mdx, PageTitle.astro                                                                                                 | ✓                         |
| `/docs/getting-started/product-tour-and-quick-demos`           | index.mdx, PageTitle.astro                                                                                                 | ✓                         |
| `/docs/getting-started/how-large-teams-use-rocketsim`          | index.mdx                                                                                                                  | ✓                         |
| `/docs/features/capturing/screenshots`                         | index.mdx                                                                                                                  | ✓                         |
| `/docs/features/design-comparison/comparing-designs`           | index.mdx                                                                                                                  | ✓                         |
| `/docs/getting-started/configuring-app-actions`                | index.mdx                                                                                                                  | ✓                         |
| `/docs/features/accessibility/toggles-and-dynamic-text`        | index.mdx                                                                                                                  | ✓                         |
| `/docs/settings/side-window`                                   | index.mdx                                                                                                                  | ✓                         |
| `/docs/support/faq`                                            | index.mdx, menu.json                                                                                                       | ✓                         |
| `/docs/support/reporting-an-issue`                             | index.mdx                                                                                                                  | ✓                         |

**Conclusion:** No broken internal links remain. The fixes applied earlier (index.mdx + simulator-camera-support.md) resolved all invalid targets.

---

## 2. URL format note (/docs/ vs /docs/docs/)

- **Sidebar** in `astro.config.ts` uses `/docs/docs/...` for some manual links (e.g. Simulator Camera, Status Bar, User Defaults Editor).
- **Content and index** use a mix: `/docs/getting-started/...`, `/docs/features/...`, `/docs/settings/...` (single “docs”) and `/docs/docs/...` (double) in a few places.

If the built site serves doc pages under **/docs/docs/...**, then links that use **/docs/getting-started/...** (single) could 404. **Action:** Run the docs site locally and open a few links (e.g. “Get Started”, “Network Traffic Monitoring”). If you see 404s, either (a) change internal links and redirect destinations to use `/docs/docs/...`, or (b) adjust Starlight so the canonical URL uses a single `docs` segment.

---

## 3. Redirects configured in astro.config.ts

Redirects cover both possible old URL styles (single and double `docs`) so bookmarks and external links keep working.

| From                                                                                | To                                                     |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `/docs/features/rocketsim-connect/introduction-and-setup`                           | `/docs/getting-started/setting-up-rocketsim-connect`   |
| `/docs/features/rocketsim-connect/network-traffic-monitoring`                       | `/docs/features/networking/network-traffic-monitoring` |
| `/docs/appearance/side-window`                                                      | `/docs/settings/side-window`                           |
| `/docs/appearance/shortcuts`                                                        | `/docs/settings/shortcuts`                             |
| `/docs/features/app-actions/general-app-actions`                                    | `/docs/getting-started/configuring-app-actions`        |
| `/docs/features/app-actions/build-insights`                                         | `/docs/features/build-insights/build-insights`         |
| `/docs/features/app-actions/network-speed-control-and-simulator-airplane-mode`      | `/docs/features/networking/network-speed-control`      |
| `/docs/docs/features/rocketsim-connect/introduction-and-setup`                      | `/docs/getting-started/setting-up-rocketsim-connect`   |
| `/docs/docs/features/rocketsim-connect/network-traffic-monitoring`                  | `/docs/features/networking/network-traffic-monitoring` |
| `/docs/docs/appearance/side-window`                                                 | `/docs/settings/side-window`                           |
| `/docs/docs/appearance/shortcuts`                                                   | `/docs/settings/shortcuts`                             |
| `/docs/docs/features/app-actions/general-app-actions`                               | `/docs/getting-started/configuring-app-actions`        |
| `/docs/docs/features/app-actions/build-insights`                                    | `/docs/features/build-insights/build-insights`         |
| `/docs/docs/features/app-actions/network-speed-control-and-simulator-airplane-mode` | `/docs/features/networking/network-speed-control`      |

If the live site uses **/docs/docs/...** for docs, update the **To** column (and `astro.config.ts`) to use that pattern (e.g. `/docs/docs/getting-started/setting-up-rocketsim-connect`).

---

## 4. Summary

- **Links:** All internal doc links point to existing pages; no further link fixes needed.
- **Redirects:** Old restructure paths (rocketsim-connect, appearance, general-app-actions, build-insights, network-speed-control) are covered for both `/docs/...` and `/docs/docs/...`.
- **Verify:** Run the app locally and confirm (1) which URL pattern the docs use, and (2) that redirects send to the correct canonical URLs.
