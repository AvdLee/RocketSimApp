# Docs Agent Guidelines

## After Making Changes

Always run these checks from the `docs/` directory after modifying files:

1. `npm run lint` - Verify ESLint passes
2. `npm run format:check` - Verify Prettier formatting
3. `npm run typecheck` - Verify TypeScript types
4. `npm run build` - Verify production build succeeds
