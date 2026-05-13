# Development Guide

## Commands
- `npm run dev` - Start dev server (port 8080)
- `npm run build` - Production build
- `npm run lint` - ESLint check
- `npm run test` / `npm run test:watch` - Run tests

## Path Alias
Use `@/*` instead of relative paths (e.g., `import Button from "@/components/ui/button"`)

## Testing
Tests are in `src/test/` and use Vitest with @testing-library/jest-dom.

## Notes
- Dev server runs on port 8080
- Duplicate `use-toast` hooks exist in both `src/hooks/` and `src/components/ui/`
- ESLint has relaxed rules (`@typescript-eslint/no-unused-vars` is off, `noImplicitAny: false`)