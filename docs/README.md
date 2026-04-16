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

## Content

Features live in `src/collections/feature/`, feature pages in `src/collections/feature-page/`, and the blog is powered by a headless WordPress instance. See [AGENTS.md](./AGENTS.md) for the full content authoring guide (schemas, examples, and conventions).

## Blog — Local Development

Make sure Docker is running.

Start: `npm run wordpress:start`
Stop: `npm run wordpress:stop`

url: `http://localhost:8888/wp-admin`
username: `admin`
password: `password`

### Plugins

We use the following plugins:

1. [Yoast SEO](https://wordpress.org/plugins/wordpress-seo/) - SEO optimization
2. [Code Block Pro](https://wordpress.org/plugins/code-block-pro/) - Syntax highlighting for code blocks

### Indexing

We don't want the pages of the Wordpress instance to be indexed by search engines. They should be indexed when displayed on rocketsim.app. To set this up:

1. Go into the Wordpress instance
2. Settings > Reading
3. Check: "Discourage search engines from indexing this site"

### Comments

We've disabled comments on the Wordpress instance

1. Go into the Wordpress instance
2. Settings > Discussion
3. Turn off: "Allow people to submit comments on new posts"

### Troubleshooting

#### Doctype error

Astro giving <!Doctype...> could not be read error?

To fix:

1. Go into the Wordpress instance
2. "Settings > Permalinks"
3. Set it to anything other that "Plain"
