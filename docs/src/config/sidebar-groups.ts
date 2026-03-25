interface SidebarGroupDef {
  label: string;
  collapsed?: boolean;
  /** For autogenerate groups: directory relative to the content collection root */
  directory?: string;
  /** For explicit item/link groups: slug paths relative to the content collection root */
  slugs?: string[];
}

export const sidebarGroups: SidebarGroupDef[] = [
  {
    label: "Getting Started",
    collapsed: true,
    directory: "docs/getting-started",
  },
  {
    label: "Screenshots & Recordings",
    collapsed: true,
    slugs: [
      "docs/features/capturing/screenshots",
      "docs/features/capturing/recordings",
      "docs/features/capturing/floating-thumbnail",
      "docs/features/capturing/app-store-connect-optimization",
      "docs/features/capturing/touch-indicators",
      "docs/features/capturing/120-fps-recordings",
    ],
  },
  {
    label: "Simulator Camera",
    slugs: ["docs/features/capturing/simulator-camera-support"],
  },
  {
    label: "Status Bar",
    slugs: ["docs/features/capturing/statusbar-appearance"],
  },
  {
    label: "Design Comparison",
    collapsed: true,
    directory: "docs/features/design-comparison",
  },
  {
    label: "App Actions",
    collapsed: true,
    directory: "docs/features/app-actions",
  },
  {
    label: "Networking",
    collapsed: true,
    directory: "docs/features/networking",
  },
  {
    label: "Build Insights",
    collapsed: true,
    directory: "docs/features/build-insights",
  },
  {
    label: "Accessibility",
    collapsed: true,
    directory: "docs/features/accessibility",
  },
  {
    label: "User Defaults Editor",
    slugs: ["docs/features/user-defaults-editor"],
  },
  {
    label: "Settings",
    collapsed: true,
    directory: "docs/settings",
  },
  {
    label: "Support",
    collapsed: true,
    directory: "docs/support",
  },
];
