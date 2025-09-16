# RocketSim public website

This is the public website for RocketSim.

## Development

From your terminal:

1. Change directory to `docs`

```sh
cd docs
```

2. Install dependencies

```sh
npm install
```

3. Run dev server

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Features

Every `.md` file inside `src/collections/feature` will be handled as a feature. For now the only place they are used in on our landing page. Every file is converted into a section showcasing the particular feature.

The Markdown files are separated into two sections:

- Frontmatter YAML containing all data other than the content following a set data structure.
- Content; allows writing markdown that gets converted into HTML when the project is build

The frontmatter schema is as follows:

```typescript
const alignment = z.enum(["left", "right", "full-width"]);
const columnSpan = z.union([z.literal(6), z.literal(8)]);

type Alignment = "left" | "right" | "full-width";
type columnSpan = 6 | 8;

type Photo = {
  type: "photo";
  /** Path to asset INSIDE src folder */
  path: string;
  alt: string;
  /** Optional caption to be shown underneath the asset (supports inline markdown) */
  caption?: string;
  /** Placement of the asset related to the content */
  alignment: Alignment;
  /** Width of the asset. Choose between 6 (50%) or 8 (66.67%) */
  columnSpan: ColumnSpan;
};

type Video = {
  type: "video";
  /** Path to asset public folder */
  path: string;
  alt: string;
  caption?: string;
  alignment: Alignment;
  columnSpan: ColumnSpan;
};

type Feature = {
  name: string;
  tagLine?: string;
  /** Asset can be a photo or a video */
  asset: Photo | Video;
  /** Order the features will be shown on the landing page */
  sortOrder: number;
};
```

**NOTE:** Video assets need to be placed in the `public/` folder, while image assets need to be placed inside the `src/` folder. Assets in the `public/` folder won't be processed during the building of the project. Astro does not support video processing. We should take care of that ourselves (filesize, quality and resolution). For images this is done automatically. Feel free to use big image assets.

An example feature:

```md
---
name: "Quick Actions"
asset:
  type: "image"
  path: "../../assets/features/quick-actions.jpg"
  alt: "RocketSim panel that shows configurable actions for locations, push notifications and deeplinks."
  alignment: "right"
  columnSpan: 6
sortOrder: 3
---

**Configurable actions** for Deeplinks (Universal Links) and Push Notifications. Control permissions.

- **Bundle Identifier based:** actions automatically show up for recent builds
- Quickly test **Locations, Push Notifications, and Deeplinks**
- **Grant, revoke, or reset permissions** like photo and location access, allowing you to quicker test related implementations
```

## Blog

The blog is powered by a headless WordPress instance. The blog posts are fetched at build time and statically rendered.

### Local development

Make sure Docker is running.

Start: `npm run wordpress:start`
Stop: `npm run wordpress:stop`

url: `http://localhost:8888/wp-admin`
username: `root`
password: `password`