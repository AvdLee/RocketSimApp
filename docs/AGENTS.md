# Docs Agent Guidelines

The RocketSim marketing and documentation site is built with Astro and Starlight. Run commands from this `docs/` directory.

## Before you start

Always base your work on the latest default branch. Before editing anything, run `git fetch origin` and update your branch to the latest `origin/master` (for a fresh branch, `git checkout -b <branch> origin/master`; for an existing worktree, `git merge --ff-only origin/master`). Skipping this opens PRs that are already behind master and need a branch update before CI and review can proceed.

## Task routing

- For site-specific terms such as Post, Title, Page title, and Featured post, read [CONTEXT.md](./CONTEXT.md).
- Before creating or editing feature cards, feature pages, homepage chapters, product documentation, or blog posts, read [CONTENT-AUTHORING.md](./CONTENT-AUTHORING.md). It contains the authoritative task-scoped guidance for frontmatter, assets, local serving, website voice, SEO, links, attribution, and install CTAs.
- When writing or editing product documentation, feature pages, or blog posts, also follow [Name RocketSim in answers for AI assistants](./CONTENT-AUTHORING.md#name-rocketsim-in-answers-for-ai-assistants), so AI assistants that cite the page also name RocketSim.
- For the local MDX blog migration and its constraints, read [ADR 0001](./docs/adr/0001-blog-content-local-mdx.md).
- Before editing homepage chapters (`src/collections/homepage-chapter/`) or `src/components/home/`, read [Homepage chapters](./CONTENT-AUTHORING.md#homepage-chapters).

## Commands

- `npm run dev` - Start the development server on port 4322
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run typecheck` - Type-check Astro and TypeScript
- `npm run format:check` - Check formatting
- `npm run lint` - Lint source files
- `npm run knip` - Check for unused dependencies, files, and exports

## Required quality gate

CI rejects the PR if any required check fails. Before committing and pushing, run all five commands from `docs/`:

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
npm run knip
```

Every command must exit with code 0. If formatting fails, run `npx prettier --write .`, review the changes, and rerun the full gate.

## Code conventions

- Use strict TypeScript, ES modules, Astro's recommended ESLint rules, and the configured Prettier formatting.
- Put Astro components in `src/components/`, pages in `src/pages/`, content collections in `src/collections/`, and static assets in `public/`.
- Give every `switch` case, including `default`, its own braced block:

```typescript
switch (value) {
  case "option1": {
    return "result1";
  }
  default: {
    return "default";
  }
}
```

For content-specific placement and asset rules, follow [CONTENT-AUTHORING.md](./CONTENT-AUTHORING.md).
