# Docs Agent Guidelines

## After Making Changes — Required Quality Gate

CI will **reject** the PR if any of the checks below fail. Always run every check from the `docs/` directory **before** committing and pushing:

```bash
cd docs
npm run lint          # ESLint
npm run format:check  # Prettier (fix with: npx prettier --write .)
npm run typecheck     # astro check (TypeScript)
npm run build         # Production build
npm run knip          # Unused files and dependencies
```

If `format:check` fails, run `npx prettier --write .` and commit the result.

All five commands must exit with code 0 before you push.
