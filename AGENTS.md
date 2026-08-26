# Development Guide

## Commands

- `npm run dev` — Start dev server (localhost:8080, HMR overlay disabled)
- `npm run build` — Production build
- `npm run build:dev` — Development build
- `npm run preview` — Preview production build
- `npm run lint` — ESLint
- `npm run test` — Vitest (single run)
- `npm run test:watch` — Vitest (watch mode)
- E2E tests use Playwright (`npx playwright test`), config in `playwright.config.ts`

## Path Alias

Use `@/*` for `src/*` (e.g., `import Button from "@/components/ui/button"`).

## Architecture

- Entry: `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`
- Single-page portfolio with React Router v6 (`/` and `*` only)
- `next-themes` handles dark mode; theme tokens are HSL CSS variables in `src/index.css`
- Animation library is `motion` (import from `motion/react`, not `framer-motion`)
- shadcn/ui components live in `src/components/ui/` (config: `components.json`)

## TypeScript / Lint

- **Compiler enforces unused locals/parameters** (`noUnusedLocals: true`, `noUnusedParameters: true`) — build fails if unused vars exist.
- ESLint has `@typescript-eslint/no-unused-vars` turned **off**, so lint alone won't catch them. Trust the compiler.
- `noImplicitAny: true` and `strict: true` are enabled.

## Testing

- Unit: Vitest + jsdom + `@testing-library/jest-dom`
- Test pattern: `src/**/*.{test,spec}.{ts,tsx}`
- Setup file: `src/test/setup.ts` — mocks `window.matchMedia` and `IntersectionObserver`, exports `triggerIntersection(...)` for observing tests.
- E2E: Playwright tests in `./e2e/`, runs against `localhost:8080`, Chromium only.

## Build Quirks

- Three.js is intentionally large and lazy-loaded via `StatsSection`; chunk size warning limit is raised to 1000 KB.
- Manual chunks split React, Motion, Radix, Router, and Three.js into separate bundles (`vite.config.ts`).
- `NotFound` page is lazy-loaded with `React.lazy`.

## Styling Conventions

- Tailwind CSS v3 with `tailwindcss-animate` plugin.
- All theme colors are HSL CSS variables defined in `src/index.css`.
- Custom cursor is hidden on desktop (`pointer: fine`) and disabled on touch devices (`pointer: coarse`).
- Accessibility: visible `:focus-visible` outline and a `.skip-link` for keyboard navigation.

## Notes

- Site is Polish-language; `index.html` lang is `pl`.
- `react-refresh/only-export-components` allows constant exports.
