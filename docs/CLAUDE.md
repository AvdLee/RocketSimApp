# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Type check the codebase
- `npm run format:check` - Check code formatting
- `npm run lint` - Lint the source code
- `npm run knip` - Check for unused dependencies/exports

## Code Style Guidelines
- Use TypeScript with strict type checking
- Follow Astro recommended ESLint rules
- Format code with Prettier (auto-configured for Astro files)
- Use ES modules for imports/exports
- Component files use `.astro` extension
- Place new components in `/src/components`
- Place new pages in `/src/pages`
- Place static assets in `/public` directory
- Content collections are in `/src/collections`